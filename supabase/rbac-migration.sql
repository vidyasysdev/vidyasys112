-- ============================================================
-- Vidyasys RBAC Migration (idempotent — safe to re-run)
-- Run AFTER schema.sql and fix-live-db.sql in Supabase SQL Editor
--
-- Adds: roles, account status, role permissions, project-level
-- feature flags, platform settings, audit log, report workflow.
-- All privileged writes go through SECURITY DEFINER functions so
-- permissions are enforced at the database, not just the UI.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profile role columns
-- ------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('admin', 'creator', 'moderator', 'ambassador', 'user'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active'
  CHECK (account_status IN ('active', 'suspended', 'disabled'));

-- Backfill roles from legacy is_admin flag
UPDATE profiles SET role = 'admin', is_admin = true WHERE is_admin = true AND role <> 'admin';

-- ------------------------------------------------------------
-- 2. Tables
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
  role TEXT NOT NULL CHECK (role IN ('admin', 'creator', 'moderator', 'ambassador', 'user')),
  permission TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (role, permission)
);

CREATE TABLE IF NOT EXISTS project_features (
  project_key TEXT NOT NULL CHECK (project_key IN ('notes', 'academic_projects', 'hardware_projects', 'student_essentials')),
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (project_key, feature_key)
);

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_label TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  target_label TEXT,
  previous_value TEXT,
  new_value TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs (actor_id);

CREATE TABLE IF NOT EXISTS report_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES user_reports(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_label TEXT,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_report_notes_report ON report_notes (report_id);

-- Report workflow columns
ALTER TABLE user_reports ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE user_reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Migrate legacy status values to the spec workflow:
-- pending / in_review / resolved / rejected
DO $$
DECLARE c RECORD;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.user_reports'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.user_reports DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;
UPDATE user_reports SET status = 'in_review' WHERE status = 'investigating';
UPDATE user_reports SET status = 'rejected' WHERE status = 'dismissed';
ALTER TABLE user_reports ADD CONSTRAINT user_reports_status_check
  CHECK (status IN ('pending', 'in_review', 'resolved', 'rejected'));

-- ------------------------------------------------------------
-- 3. Permission catalog + default matrix (spec §4)
--    Admin is always granted everything inside has_permission().
-- ------------------------------------------------------------
INSERT INTO role_permissions (role, permission, enabled) VALUES
  ('creator',      'manage_users',      false),
  ('creator',      'change_roles',      false),
  ('creator',      'create_content',    true),
  ('creator',      'moderate_reports',  false),
  ('creator',      'ambassador_tools',  false),
  ('creator',      'manage_permissions',false),
  ('creator',      'manage_projects',   false),
  ('creator',      'view_audit_log',    false),
  ('creator',      'manage_settings',   false),

  ('moderator',    'manage_users',      false),
  ('moderator',    'change_roles',      false),
  ('moderator',    'create_content',    false),
  ('moderator',    'moderate_reports',  true),
  ('moderator',    'ambassador_tools',  false),
  ('moderator',    'manage_permissions',false),
  ('moderator',    'manage_projects',   false),
  ('moderator',    'view_audit_log',    false),
  ('moderator',    'manage_settings',   false),

  ('ambassador',   'manage_users',      false),
  ('ambassador',   'change_roles',      false),
  ('ambassador',   'create_content',    false),
  ('ambassador',   'moderate_reports',  false),
  ('ambassador',   'ambassador_tools',  true),
  ('ambassador',   'manage_permissions',false),
  ('ambassador',   'manage_projects',   false),
  ('ambassador',   'view_audit_log',    false),
  ('ambassador',   'manage_settings',   false),

  ('user',         'manage_users',      false),
  ('user',         'change_roles',      false),
  ('user',         'create_content',    false),
  ('user',         'moderate_reports',  false),
  ('user',         'ambassador_tools',  false),
  ('user',         'manage_permissions',false),
  ('user',         'manage_projects',   false),
  ('user',         'view_audit_log',    false),
  ('user',         'manage_settings',   false)
ON CONFLICT (role, permission) DO NOTHING;

-- ------------------------------------------------------------
-- 4. Project-level feature flags (spec §8)
-- ------------------------------------------------------------
INSERT INTO project_features (project_key, feature_key, enabled) VALUES
  ('notes',              'create_listing', true),
  ('academic_projects',  'create_listing', true),
  ('hardware_projects',  'create_listing', true),
  ('student_essentials', 'create_listing', true)
ON CONFLICT (project_key, feature_key) DO NOTHING;

-- ------------------------------------------------------------
-- 5. Global platform settings
-- ------------------------------------------------------------
INSERT INTO platform_settings (key, value) VALUES
  ('marketplace_enabled', 'true'),
  ('signups_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------
-- 6. Permission functions (SECURITY DEFINER)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_permission(p TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE
  v_role TEXT;
  v_status TEXT;
  v_enabled BOOLEAN;
BEGIN
  SELECT role, account_status INTO v_role, v_status
  FROM public.profiles WHERE user_id = auth.uid();

  IF v_role IS NULL OR v_status IS DISTINCT FROM 'active' THEN
    RETURN false;
  END IF;
  IF v_role = 'admin' THEN
    RETURN true;
  END IF;

  SELECT enabled INTO v_enabled
  FROM public.role_permissions WHERE role = v_role AND permission = p;

  RETURN COALESCE(v_enabled, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.project_feature_enabled(proj TEXT, feat TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT enabled FROM public.project_features
     WHERE project_key = proj AND feature_key = feat),
    true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.platform_setting_enabled(p_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE v TEXT;
BEGIN
  SELECT value INTO v FROM public.platform_settings WHERE key = p_key;
  RETURN COALESCE(v = 'true', true);
END;
$$;

-- ------------------------------------------------------------
-- 7. Admin RPC functions (privileged writes, fully authorized
--    inside the function so /rpc calls cannot be abused)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_set_role(p_user_id UUID, p_new_role TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_prev TEXT;
  v_target_email TEXT;
  v_actor_label TEXT;
  v_other_admins INT;
BEGIN
  IF v_actor IS NULL OR NOT public.has_permission('change_roles') THEN
    RAISE EXCEPTION 'Not authorized to change roles';
  END IF;
  IF p_user_id = v_actor THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;
  IF p_new_role NOT IN ('admin', 'creator', 'moderator', 'ambassador', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', p_new_role;
  END IF;

  SELECT role, email INTO v_prev, v_target_email
  FROM public.profiles WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_prev = 'admin' AND p_new_role <> 'admin' THEN
    SELECT COUNT(*) INTO v_other_admins
    FROM public.profiles
    WHERE role = 'admin' AND account_status = 'active' AND user_id <> p_user_id;
    IF v_other_admins = 0 THEN
      RAISE EXCEPTION 'Cannot demote the last active admin';
    END IF;
  END IF;

  SELECT COALESCE(full_name, email) INTO v_actor_label
  FROM public.profiles WHERE user_id = v_actor;

  UPDATE public.profiles
  SET role = p_new_role,
      is_admin = (p_new_role = 'admin'),
      updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.audit_logs
    (actor_id, actor_label, action, target_type, target_id, target_label, previous_value, new_value)
  VALUES
    (v_actor, v_actor_label, 'role_change', 'user', p_user_id::text, v_target_email, v_prev, p_new_role);

  RETURN jsonb_build_object('ok', true, 'previous_role', v_prev, 'new_role', p_new_role);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_account_status(p_user_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_prev TEXT;
  v_target_email TEXT;
  v_actor_label TEXT;
BEGIN
  IF v_actor IS NULL OR NOT public.has_permission('manage_users') THEN
    RAISE EXCEPTION 'Not authorized to manage accounts';
  END IF;
  IF p_user_id = v_actor THEN
    RAISE EXCEPTION 'You cannot change your own account status';
  END IF;
  IF p_status NOT IN ('active', 'suspended', 'disabled') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;

  SELECT account_status, email INTO v_prev, v_target_email
  FROM public.profiles WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  SELECT COALESCE(full_name, email) INTO v_actor_label
  FROM public.profiles WHERE user_id = v_actor;

  UPDATE public.profiles
  SET account_status = p_status, updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.audit_logs
    (actor_id, actor_label, action, target_type, target_id, target_label, previous_value, new_value)
  VALUES
    (v_actor, v_actor_label, 'account_status_change', 'user', p_user_id::text, v_target_email, v_prev, p_status);

  RETURN jsonb_build_object('ok', true, 'previous_status', v_prev, 'new_status', p_status);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_role_permission(
  p_role TEXT, p_permission TEXT, p_enabled BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_prev TEXT;
  v_actor_label TEXT;
BEGIN
  IF v_actor IS NULL OR NOT public.has_permission('manage_permissions') THEN
    RAISE EXCEPTION 'Not authorized to manage permissions';
  END IF;
  IF p_role NOT IN ('admin', 'creator', 'moderator', 'ambassador', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;
  IF p_permission NOT IN (
    'manage_users', 'change_roles', 'create_content', 'moderate_reports',
    'ambassador_tools', 'manage_permissions', 'manage_projects',
    'view_audit_log', 'manage_settings'
  ) THEN
    RAISE EXCEPTION 'Invalid permission: %', p_permission;
  END IF;

  SELECT COALESCE(enabled::text, 'unset') INTO v_prev
  FROM public.role_permissions
  WHERE role = p_role AND permission = p_permission;

  INSERT INTO public.role_permissions (role, permission, enabled, updated_at)
  VALUES (p_role, p_permission, p_enabled, now())
  ON CONFLICT (role, permission)
  DO UPDATE SET enabled = p_enabled, updated_at = now();

  SELECT COALESCE(full_name, email) INTO v_actor_label
  FROM public.profiles WHERE user_id = v_actor;

  INSERT INTO public.audit_logs
    (actor_id, actor_label, action, target_type, target_id, target_label, previous_value, new_value, details)
  VALUES
    (v_actor, v_actor_label, 'permission_change', 'role', p_role, p_permission,
     v_prev, p_enabled::text,
     jsonb_build_object('role', p_role, 'permission', p_permission, 'enabled', p_enabled));

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_project_feature(
  p_project TEXT, p_feature TEXT, p_enabled BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_prev TEXT;
  v_actor_label TEXT;
BEGIN
  IF v_actor IS NULL OR NOT public.has_permission('manage_projects') THEN
    RAISE EXCEPTION 'Not authorized to manage project features';
  END IF;
  IF p_project NOT IN ('notes', 'academic_projects', 'hardware_projects', 'student_essentials') THEN
    RAISE EXCEPTION 'Invalid project: %', p_project;
  END IF;
  IF p_feature <> 'create_listing' THEN
    RAISE EXCEPTION 'Invalid feature: %', p_feature;
  END IF;

  SELECT COALESCE(enabled::text, 'unset') INTO v_prev
  FROM public.project_features
  WHERE project_key = p_project AND feature_key = p_feature;

  INSERT INTO public.project_features (project_key, feature_key, enabled, updated_at)
  VALUES (p_project, p_feature, p_enabled, now())
  ON CONFLICT (project_key, feature_key)
  DO UPDATE SET enabled = p_enabled, updated_at = now();

  SELECT COALESCE(full_name, email) INTO v_actor_label
  FROM public.profiles WHERE user_id = v_actor;

  INSERT INTO public.audit_logs
    (actor_id, actor_label, action, target_type, target_id, target_label, previous_value, new_value, details)
  VALUES
    (v_actor, v_actor_label, 'feature_change', 'project', p_project, p_feature,
     v_prev, p_enabled::text,
     jsonb_build_object('project', p_project, 'feature', p_feature, 'enabled', p_enabled));

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_platform_setting(p_key TEXT, p_value TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_prev TEXT;
  v_actor_label TEXT;
BEGIN
  IF v_actor IS NULL OR NOT public.has_permission('manage_settings') THEN
    RAISE EXCEPTION 'Not authorized to manage platform settings';
  END IF;
  IF p_key NOT IN ('marketplace_enabled', 'signups_enabled') THEN
    RAISE EXCEPTION 'Invalid setting: %', p_key;
  END IF;
  IF p_value NOT IN ('true', 'false') THEN
    RAISE EXCEPTION 'Invalid value: %', p_value;
  END IF;

  SELECT value INTO v_prev FROM public.platform_settings WHERE key = p_key;

  INSERT INTO public.platform_settings (key, value, updated_at)
  VALUES (p_key, p_value, now())
  ON CONFLICT (key) DO UPDATE SET value = p_value, updated_at = now();

  SELECT COALESCE(full_name, email) INTO v_actor_label
  FROM public.profiles WHERE user_id = v_actor;

  INSERT INTO public.audit_logs
    (actor_id, actor_label, action, target_type, target_id, target_label, previous_value, new_value)
  VALUES
    (v_actor, v_actor_label, 'platform_setting_change', 'setting', p_key, p_key, v_prev, p_value);

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ------------------------------------------------------------
-- 8. RLS policies
-- ------------------------------------------------------------
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_notes ENABLE ROW LEVEL SECURITY;

-- Listings: create gated by role permission + project feature + global setting
DROP POLICY IF EXISTS "Sellers can insert own listings" ON listings;
CREATE POLICY "Sellers can insert own listings" ON listings
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id
    AND public.has_permission('create_content')
    AND public.project_feature_enabled(category, 'create_listing')
    AND public.platform_setting_enabled('marketplace_enabled')
  );

DROP POLICY IF EXISTS "Sellers can update own listings" ON listings;
CREATE POLICY "Sellers can update own listings" ON listings
  FOR UPDATE USING (
    auth.uid() = seller_id
    AND public.has_permission('create_content')
  );

-- Profiles: admins (manage_users) can update any row; users keep own-row policy
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (public.has_permission('manage_users'));

-- Reports: moderators + admins
DROP POLICY IF EXISTS "Admins can view all reports" ON user_reports;
DROP POLICY IF EXISTS "Moderators can view all reports" ON user_reports;
CREATE POLICY "Moderators can view all reports" ON user_reports
  FOR SELECT USING (public.has_permission('moderate_reports'));

DROP POLICY IF EXISTS "Moderators can update reports" ON user_reports;
CREATE POLICY "Moderators can update reports" ON user_reports
  FOR UPDATE USING (public.has_permission('moderate_reports'));

-- Report notes
CREATE POLICY "Moderators can view report notes" ON report_notes
  FOR SELECT USING (public.has_permission('moderate_reports'));
CREATE POLICY "Moderators can add report notes" ON report_notes
  FOR INSERT WITH CHECK (public.has_permission('moderate_reports') AND auth.uid() = author_id);

-- Audit log: readable with permission, append-only by actor
CREATE POLICY "Audit log readable with permission" ON audit_logs
  FOR SELECT USING (public.has_permission('view_audit_log'));
CREATE POLICY "Users insert own audit entries" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- Role permissions: config is public-readable, admin-writable
CREATE POLICY "Permissions are viewable" ON role_permissions
  FOR SELECT USING (true);
CREATE POLICY "Admins update permissions" ON role_permissions
  FOR UPDATE USING (public.has_permission('manage_permissions'));
CREATE POLICY "Admins insert permissions" ON role_permissions
  FOR INSERT WITH CHECK (public.has_permission('manage_permissions'));
CREATE POLICY "Admins delete permissions" ON role_permissions
  FOR DELETE USING (public.has_permission('manage_permissions'));

-- Project features: viewable, admin-writable
CREATE POLICY "Project features are viewable" ON project_features
  FOR SELECT USING (true);
CREATE POLICY "Admins update project features" ON project_features
  FOR UPDATE USING (public.has_permission('manage_projects'));
CREATE POLICY "Admins insert project features" ON project_features
  FOR INSERT WITH CHECK (public.has_permission('manage_projects'));

-- Platform settings: viewable, admin-writable
CREATE POLICY "Platform settings are viewable" ON platform_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins update platform settings" ON platform_settings
  FOR UPDATE USING (public.has_permission('manage_settings'));
CREATE POLICY "Admins insert platform settings" ON platform_settings
  FOR INSERT WITH CHECK (public.has_permission('manage_settings'));

-- ------------------------------------------------------------
-- 9. Column-level protection on profiles:
--    authenticated users may update their own profile columns
--    but NEVER role / account status / admin flags (privilege
--    escalation via devtools or crafted API calls is blocked).
--    Admin changes go through the SECURITY DEFINER functions.
-- ------------------------------------------------------------
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (
  full_name, avatar_url, college_id, branch, semester,
  year_of_study, phone, bio, skills, email,
  verification_status, onboarding_completed
) ON public.profiles TO authenticated;

-- One-time fix for the live database (idempotent — safe to re-run)
-- Run this whole file in Supabase SQL Editor, then continue with fix-trigger.sql
-- or simply run fix-trigger.sql in the same session afterwards.

-- ============================================================
-- 1. Seed the launch college (colleges table is currently empty)
-- ============================================================
INSERT INTO colleges (name, short_name, city, domain, student_count, is_active)
VALUES ('Vidyalankar Polytechnic', 'VPT', 'Mumbai', 'vpt.edu.in', 3800, true)
ON CONFLICT (domain) DO NOTHING;

INSERT INTO colleges (name, short_name, city, domain, student_count, is_active)
VALUES
  ('Vidyalankar Institute of Technology', 'VIT', 'Mumbai', 'vit.edu.in', 7500, true),
  ('Indian Institute of Technology Bombay', 'IIT Bombay', 'Mumbai', 'iitb.ac.in', 11500, true),
  ('BITS Pilani', 'BITS Pilani', 'Pilani & Goa', 'bits-pilani.ac.in', 14000, true),
  ('Delhi Technological University', 'DTU', 'New Delhi', 'dtu.ac.in', 12000, true),
  ('College of Engineering Guindy', 'CEG', 'Chennai', 'annauniv.edu', 14000, true),
  ('R.V. College of Engineering', 'RVCE', 'Bengaluru', 'rvce.edu.in', 7500, true)
ON CONFLICT (domain) DO NOTHING;

-- ============================================================
-- 2. Admin role (is_admin column is missing on live DB)
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings" ON listings
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update listings" ON listings;
CREATE POLICY "Admins can update listings" ON listings
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update tutor profiles" ON tutor_profiles;
CREATE POLICY "Admins can update tutor profiles" ON tutor_profiles
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all reports" ON user_reports;
CREATE POLICY "Admins can view all reports" ON user_reports
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all payouts" ON payouts;
CREATE POLICY "Admins can view all payouts" ON payouts
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all conversations" ON conversations;
CREATE POLICY "Admins can view all conversations" ON conversations
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (public.is_admin());

-- ============================================================
-- 3. Auto-create profile on signup (trigger is missing on live DB)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_domain TEXT;
  found_college_id UUID;
BEGIN
  user_domain := split_part(NEW.email, '@', 2);

  SELECT id INTO found_college_id
  FROM colleges
  WHERE domain = user_domain AND is_active = true
  LIMIT 1;

  INSERT INTO public.profiles (user_id, email, full_name, college_id, verification_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(found_college_id::text, user_domain),
    CASE WHEN found_college_id IS NOT NULL THEN 'verified' ELSE 'pending' END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user error for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. Make yourself admin
-- ============================================================
UPDATE profiles SET is_admin = true WHERE email = 'aryan.sonsurkar@vpt.edu.in';

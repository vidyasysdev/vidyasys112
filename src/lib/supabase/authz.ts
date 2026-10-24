import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDemoAuthContext, isDemoStoreActive } from "@/lib/demo-store";
import {
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSION_KEYS,
  ROLE_KEYS,
  type RoleKey,
  type PermissionKey,
} from "@/lib/rbac";

export interface AuthContext {
  userId: string;
  email: string;
  role: RoleKey;
  accountStatus: string;
  isLegacyAdmin: boolean;
}

export interface ProfileRow {
  user_id: string;
  email: string;
  full_name: string | null;
  role: RoleKey;
  account_status: string;
  is_admin: boolean;
  verification_status: string;
  onboarding_completed: boolean;
  [key: string]: unknown;
}

/** Fetch the current user's profile, or null. */
export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (data as ProfileRow) ?? null;
}

/** Fetch the current user + profile or redirect to login. */
export async function requireUser(): Promise<AuthContext> {
  // Local demo admin session (no Supabase required).
  const demo = await getDemoAuthContext();
  if (demo) {
    return {
      userId: demo.userId,
      email: demo.email,
      role: demo.role,
      accountStatus: "active",
      isLegacyAdmin: false,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status, is_admin, email")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/verify-college");
  if (profile.account_status !== "active") redirect("/suspended");

  const role: RoleKey = (ROLE_KEYS as readonly string[]).includes(profile.role)
    ? profile.role
    : "user";

  return {
    userId: user.id,
    email: profile.email || user.email || "",
    role,
    accountStatus: profile.account_status,
    isLegacyAdmin: !!profile.is_admin,
  };
}

/**
 * Guard for server actions / server components.
 * Admin always passes (matches has_permission() in the database).
 * Otherwise the role's enabled permissions are read from role_permissions.
 */
export async function requirePermission(permission: PermissionKey): Promise<AuthContext> {
  const ctx = await requireUser();

  if (ctx.role === "admin") return ctx;

  // Local demo store: no database to query — use the seeded defaults.
  if (isDemoStoreActive()) {
    if (!DEFAULT_ROLE_PERMISSIONS[ctx.role][permission]) redirect("/app");
    return ctx;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("enabled")
    .eq("role", ctx.role)
    .eq("permission", permission)
    .single();

  if (!data?.enabled) redirect("/app");

  return ctx;
}

/** Like requirePermission but returns a boolean instead of redirecting. */
export async function checkPermission(permission: PermissionKey): Promise<boolean> {
  const ctx = await requireUser();
  if (ctx.role === "admin") return true;
  if (isDemoStoreActive()) return DEFAULT_ROLE_PERMISSIONS[ctx.role][permission];

  const supabase = await createClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("enabled")
    .eq("role", ctx.role)
    .eq("permission", permission)
    .single();

  return !!data?.enabled;
}

/**
 * All permissions granted to a role (admin gets everything).
 * Returns a list of PermissionKey strings.
 */
export async function getRolePermissions(role: RoleKey): Promise<PermissionKey[]> {
  if (role === "admin") {
    return [...PERMISSION_KEYS];
  }

  // Local demo store: derive the list from the seeded defaults.
  if (isDemoStoreActive()) {
    return PERMISSION_KEYS.filter((p) => DEFAULT_ROLE_PERMISSIONS[role][p]);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("permission, enabled")
    .eq("role", role)
    .eq("enabled", true);

  return (data?.map((r) => r.permission as PermissionKey) ?? []) as PermissionKey[];
}

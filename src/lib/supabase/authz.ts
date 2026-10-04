import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RoleKey, PermissionKey } from "@/lib/rbac";
import { ROLE_KEYS } from "@/lib/rbac";

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
    const { PERMISSION_KEYS } = await import("@/lib/rbac");
    return [...PERMISSION_KEYS];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("permission, enabled")
    .eq("role", role)
    .eq("enabled", true);

  return (data?.map((r) => r.permission as PermissionKey) ?? []) as PermissionKey[];
}

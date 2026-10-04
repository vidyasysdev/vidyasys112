"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { requirePermission, requireUser } from "@/lib/supabase/authz";
import type { RoleKey, PermissionKey, AccountStatus, ProjectKey } from "@/lib/rbac";

export type ActionResult = { ok: boolean; error?: string };

const VALID_ROLES: RoleKey[] = ["admin", "creator", "moderator", "ambassador", "user"];
const VALID_STATUSES: AccountStatus[] = ["active", "suspended", "disabled"];
const REPORT_STATUSES = ["pending", "in_review", "resolved", "rejected"] as const;

async function logAction(entry: {
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  previousValue?: string;
  newValue?: string;
  details?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("user_id", user.id)
    .single();

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    actor_label: profile?.full_name || profile?.email || user.email || "Unknown",
    action: entry.action,
    target_type: entry.targetType,
    target_id: entry.targetId,
    target_label: entry.targetLabel,
    previous_value: entry.previousValue,
    new_value: entry.newValue,
    details: entry.details,
  });
}

export async function changeUserRole(userId: string, role: RoleKey): Promise<ActionResult> {
  try {
    await requirePermission("change_roles");
    if (!VALID_ROLES.includes(role)) return { ok: false, error: "Invalid role." };

    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_role", {
      p_user_id: userId,
      p_new_role: role,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function setAccountStatus(
  userId: string,
  status: AccountStatus
): Promise<ActionResult> {
  try {
    await requirePermission("manage_users");
    if (!VALID_STATUSES.includes(status)) return { ok: false, error: "Invalid status." };

    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_account_status", {
      p_user_id: userId,
      p_status: status,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function createUserAccount(input: {
  email: string;
  password: string;
  fullName: string;
  role: RoleKey;
}): Promise<ActionResult> {
  try {
    const ctx = await requirePermission("manage_users");

    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();
    if (!email || !email.includes("@")) return { ok: false, error: "Enter a valid email." };
    if (!fullName) return { ok: false, error: "Enter the full name." };
    if ((input.password || "").length < 8)
      return { ok: false, error: "Password must be at least 8 characters." };
    if (!VALID_ROLES.includes(input.role))
      return { ok: false, error: "Invalid role." };

    // Bare client: never shares auth state with the admin's session.
    const client = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await client.auth.signUp({
      email,
      password: input.password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        return { ok: false, error: "An account with this email already exists." };
      }
      return { ok: false, error: error.message };
    }

    const newUserId = data.user?.id;
    if (newUserId && input.role !== "user") {
      const supabase = await createClient();
      const { error: roleError } = await supabase.rpc("admin_set_role", {
        p_user_id: newUserId,
        p_new_role: input.role,
      });
      if (roleError && !roleError.message.includes("not found")) {
        return {
          ok: true,
          error: `Account created, but role could not be set: ${roleError.message}`,
        };
      }
    }

    await logAction({
      action: "user_created",
      targetType: "user",
      targetId: newUserId,
      targetLabel: email,
      newValue: input.role,
      details: { created_by: ctx.email, full_name: fullName },
    });

    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function setRolePermission(
  role: RoleKey,
  permission: PermissionKey,
  enabled: boolean
): Promise<ActionResult> {
  try {
    await requirePermission("manage_permissions");
    if (!VALID_ROLES.includes(role)) return { ok: false, error: "Invalid role." };

    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_role_permission", {
      p_role: role,
      p_permission: permission,
      p_enabled: enabled,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/roles");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function setProjectFeature(
  project: ProjectKey,
  feature: string,
  enabled: boolean
): Promise<ActionResult> {
  try {
    await requirePermission("manage_projects");

    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_project_feature", {
      p_project: project,
      p_feature: feature,
      p_enabled: enabled,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/projects");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function setPlatformSetting(
  key: string,
  value: "true" | "false"
): Promise<ActionResult> {
  try {
    await requirePermission("manage_settings");

    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_platform_setting", {
      p_key: key,
      p_value: value,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function assignReport(
  reportId: string,
  moderatorId: string | null
): Promise<ActionResult> {
  try {
    await requirePermission("moderate_reports");

    const supabase = await createClient();
    const { error } = await supabase
      .from("user_reports")
      .update({ assigned_to: moderatorId, updated_at: new Date().toISOString() })
      .eq("id", reportId);
    if (error) return { ok: false, error: error.message };

    await logAction({
      action: "report_assigned",
      targetType: "report",
      targetId: reportId,
      newValue: moderatorId ?? "unassigned",
    });

    revalidatePath("/admin/reports");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function setReportStatus(
  reportId: string,
  status: (typeof REPORT_STATUSES)[number]
): Promise<ActionResult> {
  try {
    await requirePermission("moderate_reports");
    if (!REPORT_STATUSES.includes(status)) return { ok: false, error: "Invalid status." };

    const supabase = await createClient();
    const { data: before } = await supabase
      .from("user_reports")
      .select("status")
      .eq("id", reportId)
      .single();

    const { error } = await supabase
      .from("user_reports")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", reportId);
    if (error) return { ok: false, error: error.message };

    await logAction({
      action: "report_status_change",
      targetType: "report",
      targetId: reportId,
      previousValue: before?.status,
      newValue: status,
    });

    revalidatePath("/admin/reports");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function addReportNote(reportId: string, note: string): Promise<ActionResult> {
  try {
    const ctx = await requirePermission("moderate_reports");
    const trimmed = note.trim();
    if (!trimmed) return { ok: false, error: "Note cannot be empty." };

    const supabase = await createClient();
    const { error } = await supabase.from("report_notes").insert({
      report_id: reportId,
      author_id: ctx.userId,
      author_label: ctx.email,
      note: trimmed,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/reports");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

export async function submitListingReport(input: {
  listingId: string;
  reason: string;
  description: string;
}): Promise<ActionResult> {
  try {
    const ctx = await requireUser();
    const reason = input.reason.trim();
    const description = input.description.trim();
    if (!reason || !description) return { ok: false, error: "Fill in all fields." };

    const supabase = await createClient();
    const { error } = await supabase.from("user_reports").insert({
      reporter_id: ctx.userId,
      listing_id: input.listingId,
      reason,
      description,
      status: "pending",
    });
    if (error) return { ok: false, error: error.message };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Action failed." };
  }
}

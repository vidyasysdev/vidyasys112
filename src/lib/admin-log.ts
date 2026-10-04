import { createClient } from "@/lib/supabase/server";

export interface AdminLogEntry {
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  previousValue?: string;
  newValue?: string;
  details?: Record<string, unknown>;
}

/**
 * Append an entry to the audit log using the current session.
 * Callers are responsible for permission checks (admin/moderator pages
 * and RLS policies on audit_logs enforce who may write).
 */
export async function logAdminAction(entry: AdminLogEntry): Promise<void> {
  try {
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
  } catch {
    // Audit logging must never break the primary action.
  }
}

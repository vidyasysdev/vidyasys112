import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { Lock, ShieldCheck, ShieldOff, UserX } from "lucide-react";
import {
  PERMISSION_KEYS,
  PERMISSION_LABELS,
  ROLE_LABELS,
  type RoleKey,
} from "@/lib/rbac";

export const metadata = { title: "Security" };

export default async function AdminSecurityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, suspendedRes, disabledRes, permsRes, statusLogsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("role, account_status")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("profiles")
        .select("email, full_name, account_status, updated_at")
        .eq("account_status", "suspended")
        .order("updated_at", { ascending: false })
        .limit(20),
      supabase
        .from("profiles")
        .select("email, full_name, account_status, updated_at")
        .eq("account_status", "disabled")
        .order("updated_at", { ascending: false })
        .limit(20),
      supabase.from("role_permissions").select("permission, enabled"),
      supabase
        .from("audit_logs")
        .select("*")
        .eq("action", "account_status_change")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const role: RoleKey = (profileRes.data?.role as RoleKey) || "admin";
  const granted = new Set(
    role === "admin"
      ? PERMISSION_KEYS
      : (permsRes.data || [])
          .filter((p) => p.enabled)
          .map((p) => p.permission)
  );

  const restricted = [
    suspendedRes.data || [],
    ...(disabledRes.data || []),
  ].flat();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Security</h1>
        <p className="text-sm text-ink-muted mt-1">
          Access control, account security, and permission verification
        </p>
      </div>

      {/* Permission verification for the current admin */}
      <div className="bg-panel rounded-xl border border-hairline p-5 space-y-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Your access ({ROLE_LABELS[role]})
        </h3>
        <div className="flex flex-wrap gap-2">
          {PERMISSION_KEYS.map((p) => (
            <span
              key={p}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                granted.has(p)
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-panel-2 border-hairline text-ink-muted"
              }`}
            >
              {PERMISSION_LABELS[p]}
            </span>
          ))}
        </div>
        <p className="text-xs text-ink-muted">
          Verified against the database on every request — hiding UI elements is never the only
          control.
        </p>
      </div>

      {/* Restricted accounts */}
      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="px-4 py-3 border-b border-hairline flex items-center gap-2">
          <UserX className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-bold text-ink">
            Restricted accounts ({restricted.length})
          </h3>
        </div>
        {restricted.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            No suspended or disabled accounts.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-panel-2 border-b border-hairline">
                  <th className="text-left px-4 py-2.5 font-semibold text-ink">Account</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink">Changed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {restricted.map((acc) => (
                  <tr key={acc.email}>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-ink">{acc.full_name || "—"}</div>
                      <div className="text-xs text-ink-muted">{acc.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700">
                        {acc.account_status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-ink-muted">
                      {acc.updated_at ? formatDateTime(acc.updated_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account status change log */}
      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="px-4 py-3 border-b border-hairline flex items-center gap-2">
          <ShieldOff className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-ink">Recent account status changes</h3>
        </div>
        {(statusLogsRes.data || []).length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">No status changes recorded yet.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {(statusLogsRes.data || []).map((log) => (
              <li key={log.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-semibold text-ink">
                    {log.target_label || log.target_id}
                  </span>
                  <span className="text-xs text-ink-muted ml-2">by {log.actor_label}</span>
                </div>
                <div className="text-xs">
                  <span className="text-red-600">{log.previous_value}</span>
                  <span className="text-ink-muted mx-1">→</span>
                  <span className="text-emerald-600 font-bold">{log.new_value}</span>
                  <span className="text-ink-muted ml-3">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-panel rounded-xl border border-hairline p-5 flex items-start gap-3 text-xs text-ink-muted">
        <Lock className="w-4 h-4 shrink-0 mt-0.5 text-ink-muted" />
        <p>
          <strong className="text-ink">Enforcement layers:</strong> route middleware →
          server-action permission checks → Postgres RLS policies → column-level grants
          (role/status columns are read-only for all user sessions) → SECURITY DEFINER admin
          functions that audit every change. Direct URLs, API calls, and devtools edits cannot
          escalate privileges.
        </p>
      </div>
    </div>
  );
}

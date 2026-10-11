import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { ScrollText } from "lucide-react";

export const metadata = { title: "Activity Logs" };

const ACTION_LABELS: Record<string, string> = {
  role_change: "Role Change",
  account_status_change: "Account Status Change",
  permission_change: "Permission Change",
  feature_change: "Project Feature Change",
  platform_setting_change: "Platform Setting Change",
  user_created: "User Created",
  report_assigned: "Report Assigned",
  report_status_change: "Report Status Change",
  moderation_action: "Moderation Action",
};

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  const params = await searchParams;
  const actionFilter = params.action || "";

  const supabase = await createClient();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (actionFilter) query = query.eq("action", actionFilter);

  const { data: logs } = await query;

  const actionTypes = [...new Set((logs || []).map((l) => l.action))];

  const buildHref = (next: string) =>
    next ? `/admin/activity?action=${encodeURIComponent(next)}` : "/admin/activity";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Activity Logs</h1>
        <p className="text-sm text-ink-muted mt-1">
          Complete history of administrative actions — who, what, when, previous and new values
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            !actionFilter
              ? "bg-royal text-white"
              : "bg-panel border border-hairline text-ink-muted hover:text-ink"
          }`}
        >
          All Actions
        </Link>
        {Object.entries(ACTION_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={buildHref(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              actionFilter === key
                ? "bg-royal text-white"
                : "bg-panel border border-hairline text-ink-muted hover:text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {logs && logs.length > 0 ? (
        <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="bg-panel-2 border-b border-hairline">
                  <th className="text-left px-4 py-3 font-semibold text-ink">When</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Who</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Target</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Previous → New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-panel-2/60">
                    <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{log.actor_label || "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-panel-2 text-[11px] font-bold text-ink">
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      <div className="capitalize">{(log.target_type || "").replace(/_/g, " ")}</div>
                      <div className="text-xs truncate max-w-[200px]">
                        {log.target_label || log.target_id || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {log.previous_value || log.new_value ? (
                        <span>
                          <span className="text-red-600">{log.previous_value || "—"}</span>
                          <span className="text-ink-muted mx-1.5">→</span>
                          <span className="text-emerald-600 font-semibold">
                            {log.new_value || "—"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-panel rounded-xl border border-hairline p-12 text-center">
          <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">No activity yet</h3>
          <p className="text-sm text-ink-muted">
            Role changes, permission changes, moderation actions and account status changes will
            appear here.
          </p>
        </div>
      )}

      <p className="text-xs text-ink-muted">
        Showing latest {logs?.length ?? 0} entries
        {actionTypes.length > 0 && ` of ${actionTypes.length} action types`}. Logs are
        append-only — they cannot be edited or deleted from the app.
      </p>
    </div>
  );
}

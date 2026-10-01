import { createClient } from "@/lib/supabase/server";
import { AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("user_reports")
    .select("*")
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    investigating: "bg-blue-50 text-blue-700",
    resolved: "bg-emerald-50 text-emerald-700",
    dismissed: "bg-panel-2 text-ink-muted",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-ink tracking-tight">Reports</h1>

      {reports && reports.length > 0 ? (
        <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-panel-2 border-b border-hairline">
                  <th className="text-left px-4 py-3 font-semibold text-ink">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-panel-2">
                    <td className="px-4 py-3 font-semibold text-ink capitalize">{report.reason.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-ink-muted max-w-[300px] truncate">{report.description}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${statusColors[report.status] || ""}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted">{formatDateTime(report.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-panel rounded-xl border border-hairline p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">No reports</h3>
          <p className="text-sm text-ink-muted">User reports will appear here.</p>
        </div>
      )}
    </div>
  );
}

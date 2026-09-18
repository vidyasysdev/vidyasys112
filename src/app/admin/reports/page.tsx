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
    dismissed: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports</h1>

      {reports && reports.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900 capitalize">{report.reason.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[300px] truncate">{report.description}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${statusColors[report.status] || ""}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(report.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No reports</h3>
          <p className="text-sm text-slate-500">User reports will appear here.</p>
        </div>
      )}
    </div>
  );
}

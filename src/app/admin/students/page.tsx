import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, ShieldOff, Search } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink tracking-tight">Students</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 rounded-lg bg-panel border border-hairline text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-panel-2 border-b border-hairline">
                <th className="text-left px-4 py-3 font-semibold text-ink">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">College</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Branch</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {students?.map((student) => (
                <tr key={student.id} className="hover:bg-panel-2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                        {student.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{student.full_name}</div>
                        <div className="text-xs text-ink-muted">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{student.college_id}</td>
                  <td className="px-4 py-3 text-ink-muted">{student.branch}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      student.verification_status === "verified"
                        ? "bg-emerald-50 text-emerald-700"
                        : student.verification_status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {student.verification_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {formatDateTime(student.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

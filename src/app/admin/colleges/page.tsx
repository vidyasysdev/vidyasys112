import { createClient } from "@/lib/supabase/server";
import { Building2 } from "lucide-react";

export default async function AdminCollegesPage() {
  const supabase = await createClient();

  const { data: colleges } = await supabase
    .from("colleges")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-ink tracking-tight">Colleges</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges?.map((college) => (
          <div key={college.id} className="bg-panel rounded-xl border border-hairline p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm">{college.name}</h3>
                <p className="text-xs text-ink-muted">{college.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="font-mono">{college.domain}</span>
              <span>•</span>
              <span>{college.student_count} students</span>
            </div>
            <div className="mt-3">
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${college.is_active ? "bg-emerald-50 text-emerald-700" : "bg-panel-2 text-ink-muted"}`}>
                {college.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

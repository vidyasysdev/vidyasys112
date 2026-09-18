import { createClient } from "@/lib/supabase/server";
import { Wrench } from "lucide-react";

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const { data: inventory } = await supabase
    .from("inventory")
    .select("*, listing:listings(title)")
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    available: "bg-emerald-50 text-emerald-700",
    reserved: "bg-amber-50 text-amber-700",
    ready_for_pickup: "bg-purple-50 text-purple-700",
    picked_up: "bg-blue-50 text-blue-700",
    borrowed: "bg-blue-50 text-blue-700",
    return_pending: "bg-orange-50 text-orange-700",
    returned: "bg-slate-100 text-slate-600",
    inspection: "bg-amber-50 text-amber-700",
    damaged: "bg-red-50 text-red-700",
    unavailable: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory</h1>

      {inventory && inventory.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Item Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Listing</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Condition</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.item_code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.listing?.title || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{item.condition}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${statusColors[item.status] || ""}`}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.rental_due_date || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No inventory items</h3>
          <p className="text-sm text-slate-500">Physical items will appear here once orders are placed.</p>
        </div>
      )}
    </div>
  );
}

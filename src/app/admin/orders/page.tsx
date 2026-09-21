import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDateTime } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, listing:listing_id(title), buyer:buyer_id(full_name), seller:seller_id(full_name)")
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    ready_for_pickup: "bg-purple-50 text-purple-700",
    picked_up: "bg-emerald-50 text-emerald-700",
    active: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
    returned: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-50 text-red-700",
    refunded: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Buyer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{order.order_number}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px] truncate">
                    {order.listing?.title || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{order.buyer?.full_name || "—"}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${statusColors[order.status] || ""}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

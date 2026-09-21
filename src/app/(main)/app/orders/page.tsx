import { createClient } from "@/lib/supabase/server";
import { ShoppingCart, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, listing:listing_id(title, category)")
    .eq("buyer_id", user?.id || "")
    .order("created_at", { ascending: false });

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 text-amber-500" />,
    confirmed: <CheckCircle className="w-4 h-4 text-blue-500" />,
    ready_for_pickup: <Package className="w-4 h-4 text-purple-500" />,
    picked_up: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    active: <Clock className="w-4 h-4 text-blue-500" />,
    completed: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    returned: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    cancelled: <XCircle className="w-4 h-4 text-red-500" />,
    refunded: <XCircle className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">My Orders</h1>
        <p className="text-sm text-slate-600 mt-1">Track your purchases and rentals</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {statusIcons[order.status] || <Clock className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {order.listing?.title || "Order"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{order.order_number}</span>
                    <span>•</span>
                    <span>{formatDateTime(order.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-black text-slate-900">{formatPrice(order.amount)}</div>
                <div className="text-xs text-slate-500 capitalize">{order.status.replace("_", " ")}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-sm text-slate-500">Your orders will appear here once you make a purchase.</p>
        </div>
      )}
    </div>
  );
}

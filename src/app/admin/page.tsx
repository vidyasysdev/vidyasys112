import { createClient } from "@/lib/supabase/server";
import { Users, Package, ShoppingCart, Calendar, AlertTriangle, TrendingUp } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: studentsCount },
    { count: listingsCount },
    { count: ordersCount },
    { count: bookingsCount },
    { count: reportsCount },
    { count: pendingListings },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("user_reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const stats = [
    { label: "Total Students", value: studentsCount || 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Listings", value: listingsCount || 0, icon: Package, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Orders", value: ordersCount || 0, icon: ShoppingCart, color: "bg-purple-50 text-purple-600" },
    { label: "Total Bookings", value: bookingsCount || 0, icon: Calendar, color: "bg-amber-50 text-amber-600" },
    { label: "Pending Listings", value: pendingListings || 0, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
    { label: "Open Reports", value: reportsCount || 0, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-600">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { BarChart3 } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [
    { count: totalStudents },
    { count: totalListings },
    { count: totalOrders },
    { count: totalBookings },
    { count: approvedListings },
    { count: pendingListings },
    { count: completedOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  const conversionRate = totalListings && totalListings > 0
    ? ((completedOrders || 0) / totalListings * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalStudents || 0 },
          { label: "Total Listings", value: totalListings || 0 },
          { label: "Approved Listings", value: approvedListings || 0 },
          { label: "Pending Listings", value: pendingListings || 0 },
          { label: "Total Orders", value: totalOrders || 0 },
          { label: "Completed Orders", value: completedOrders || 0 },
          { label: "Total Bookings", value: totalBookings || 0 },
          { label: "Conversion Rate", value: `${conversionRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="text-xs text-slate-500 font-medium mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Charts Coming Soon</h3>
        <p className="text-sm text-slate-500">Detailed analytics charts and trends will be available here.</p>
      </div>
    </div>
  );
}

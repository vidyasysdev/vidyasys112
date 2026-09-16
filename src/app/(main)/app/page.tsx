import { createClient } from "@/lib/supabase/server";
import { BookOpen, Cpu, Users, ShoppingCart, ArrowRight, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Student";

  const [{ count: listingsCount }, { count: ordersCount }] = await Promise.all([
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("buyer_id", user?.id || ""),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
          Welcome back, {displayName.split(" ")[0]}
        </h1>
        <p className="text-slate-600">
          What would you like to explore today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Listings Available", value: listingsCount || 0, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
          { label: "Your Orders", value: ordersCount || 0, icon: ShoppingCart, color: "bg-emerald-50 text-emerald-600" },
          { label: "Tutors Online", value: "—", icon: Users, color: "bg-purple-50 text-purple-600" },
          { label: "Trending", value: "—", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Browse Notes", description: "Find topper notes for your subjects", href: "/app/explore", color: "from-blue-500 to-blue-600" },
          { title: "Find Tutors", description: "Book 1-on-1 sessions with seniors", href: "/app/explore", color: "from-purple-500 to-purple-600" },
          { title: "My Orders", description: "Track your purchases and rentals", href: "/app/orders", color: "from-emerald-500 to-emerald-600" },
          { title: "My Bookings", description: "View upcoming tutoring sessions", href: "/app/bookings", color: "from-amber-500 to-amber-600" },
        ].map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-200 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3`}>
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{action.title}</h3>
            <p className="text-xs text-slate-500">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Featured Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Get Started</h2>
            <p className="text-sm text-slate-500">Complete your profile to start buying and selling</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Complete Profile", done: !!profile?.bio },
            { step: "2", title: "Browse Listings", done: false },
            { step: "3", title: "Make First Purchase", done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                {item.done ? "✓" : item.step}
              </div>
              <span className="text-sm font-semibold text-slate-700">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

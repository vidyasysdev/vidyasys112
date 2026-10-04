import { createClient } from "@/lib/supabase/server";
import { BookOpen, Cpu, Users, ShoppingCart, ArrowRight, Star, TrendingUp, Gavel, Handshake, Shield } from "lucide-react";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  creator: "Creator",
  moderator: "Moderator",
  ambassador: "Brand Ambassador",
  user: "Student",
};

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Student";
  const role = profile?.role === "admin" || profile?.is_admin === true ? "admin" : profile?.role || "user";

  const roleLinks: { href: string; label: string; icon: typeof Gavel; color: string }[] = [
    ...(role === "admin" || role === "moderator"
      ? [{ href: "/app/moderation", label: "Moderation Queue", icon: Gavel, color: "from-amber-500 to-amber-600" }]
      : []),
    ...(role === "ambassador"
      ? [{ href: "/app/ambassador", label: "Ambassador Tools", icon: Handshake, color: "from-rose-500 to-rose-600" }]
      : []),
    ...(role === "admin"
      ? [{ href: "/admin", label: "Admin Panel", icon: Shield, color: "from-slate-600 to-slate-700" }]
      : []),
  ];

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
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Welcome back, {displayName.split(" ")[0]}
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold">
            {ROLE_LABELS[role] || role}
          </span>
        </div>
        <p className="text-ink-muted">
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
          <div key={stat.label} className="bg-panel rounded-xl border border-hairline p-4 space-y-2">
            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-ink">{stat.value}</div>
            <div className="text-xs text-ink-muted font-medium">{stat.label}</div>
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
            className="group bg-panel rounded-xl border border-hairline p-5 hover:shadow-md hover:border-brand-200 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3`}>
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ink mb-1">{action.title}</h3>
            <p className="text-xs text-ink-muted">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Role tools */}
      {roleLinks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roleLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-panel rounded-xl border border-hairline p-5 hover:shadow-md hover:border-brand-200 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-3`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-ink">{item.label}</h3>
            </Link>
          ))}
        </div>
      )}

      {/* Featured Section */}
      <div className="bg-panel rounded-2xl border border-hairline p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Get Started</h2>
            <p className="text-sm text-ink-muted">Complete your profile to start buying and selling</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Complete Profile", done: !!profile?.bio },
            { step: "2", title: "Browse Listings", done: false },
            { step: "3", title: "Make First Purchase", done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 p-3 rounded-lg bg-panel-2 border border-hairline">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-panel-2 text-ink-muted"}`}>
                {item.done ? "✓" : item.step}
              </div>
              <span className="text-sm font-semibold text-ink">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

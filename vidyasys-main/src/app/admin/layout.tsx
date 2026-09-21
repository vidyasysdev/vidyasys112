import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, Users, Building2, Shield, Package, ShoppingCart, Calendar, Wrench, CreditCard, AlertTriangle, BarChart3, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard",
};

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/colleges", label: "Colleges", icon: Building2 },
  { href: "/admin/verifications", label: "Verifications", icon: Shield },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/inventory", label: "Inventory", icon: Wrench },
  { href: "/admin/payouts", label: "Payouts", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-brand-950 text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to App</span>
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-sm">Vidyasys Admin</span>
            </div>
          </div>
          <div className="text-xs text-blue-200">
            {user.email}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="hidden lg:block w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-56px)] sticky top-14">
          <nav className="p-3 space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-56px)] min-w-0">
          {/* Mobile admin nav */}
          <nav className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3 mb-4 border-b border-slate-200 overflow-x-auto">
            <div className="flex items-center gap-2 w-max">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 whitespace-nowrap hover:border-brand-300 transition"
                >
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}

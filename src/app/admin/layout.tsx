import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GraduationCap,
  Users,
  Building2,
  Shield,
  Package,
  ShoppingCart,
  Calendar,
  Wrench,
  CreditCard,
  AlertTriangle,
  BarChart3,
  ArrowLeft,
  KeyRound,
  PenTool,
  Gavel,
  Handshake,
  FolderKanban,
  ScrollText,
  Lock,
  LineChart,
  Settings,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { PERMISSION_KEYS, type PermissionKey } from "@/lib/rbac";

export const metadata = {
  title: "Admin Dashboard",
};

interface NavItem {
  href: string;
  label: string;
  icon: typeof BarChart3;
  perm?: PermissionKey;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const adminNavSections: NavSection[] = [
  {
    section: "Administration",
    items: [
      { href: "/admin", label: "Dashboard", icon: BarChart3 },
      { href: "/admin/users", label: "Users", icon: Users, perm: "manage_users" },
      { href: "/admin/roles", label: "Roles & Permissions", icon: KeyRound, perm: "manage_permissions" },
      { href: "/admin/creators", label: "Creators", icon: PenTool, perm: "manage_users" },
      { href: "/admin/moderators", label: "Moderators", icon: Gavel, perm: "manage_users" },
      { href: "/admin/ambassadors", label: "Brand Ambassadors", icon: Handshake, perm: "manage_users" },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban, perm: "manage_projects" },
      { href: "/admin/reports", label: "Reports", icon: AlertTriangle, perm: "moderate_reports" },
      { href: "/admin/activity", label: "Activity Logs", icon: ScrollText, perm: "view_audit_log" },
      { href: "/admin/security", label: "Security", icon: Lock, perm: "manage_users" },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
      { href: "/admin/settings", label: "Platform Settings", icon: Settings, perm: "manage_settings" },
    ],
  },
  {
    section: "Marketplace Operations",
    items: [
      { href: "/admin/colleges", label: "Colleges", icon: Building2 },
      { href: "/admin/verifications", label: "Verifications", icon: Shield },
      { href: "/admin/listings", label: "Listings", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/bookings", label: "Bookings", icon: Calendar },
      { href: "/admin/inventory", label: "Inventory", icon: Wrench },
      { href: "/admin/payouts", label: "Payouts", icon: CreditCard },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status, is_admin")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/verify-college");
  }

  if (profile.account_status !== "active") {
    redirect("/suspended");
  }

  const isAdmin = profile.role === "admin" || !!profile.is_admin;
  if (!isAdmin) {
    redirect("/app");
  }

  // Permission-filtered nav (admins see everything; matches DB has_permission()).
  let granted: string[] = [...PERMISSION_KEYS];
  if (profile.role !== "admin" && !profile.is_admin) {
    const { data: perms } = await supabase
      .from("role_permissions")
      .select("permission")
      .eq("role", profile.role)
      .eq("enabled", true);
    granted = perms?.map((p) => p.permission) ?? [];
  }

  const visibleSections = adminNavSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => !item.perm || granted.includes(item.perm)),
    }))
    .filter((sec) => sec.items.length > 0);

  const flatNav = visibleSections.flatMap((sec) => sec.items);

  return (
    <div className="min-h-screen bg-panel-2">
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
          <div className="flex items-center gap-3">
            <div className="text-xs text-blue-200 hidden sm:block">
              {user.email}
            </div>
            <div className="p-1.5 rounded-lg hover:bg-white/10 transition [&_button]:text-blue-200 [&_button:hover]:text-white">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="hidden lg:block w-56 bg-panel border-r border-hairline min-h-[calc(100vh-56px)] sticky top-14">
          <nav className="p-3 space-y-5">
            {visibleSections.map((sec) => (
              <div key={sec.section}>
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  {sec.section}
                </div>
                <div className="space-y-1">
                  {sec.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-ink-muted hover:bg-panel-2 hover:text-ink transition"
                    >
                      <item.icon className="w-4 h-4 text-ink-muted" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-56px)] min-w-0">
          {/* Mobile admin nav */}
          <nav className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3 mb-4 border-b border-hairline overflow-x-auto">
            <div className="flex items-center gap-2 w-max">
              {flatNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-muted bg-panel border border-hairline whitespace-nowrap hover:border-brand-300 transition"
                >
                  <item.icon className="w-3.5 h-3.5 text-ink-muted" />
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

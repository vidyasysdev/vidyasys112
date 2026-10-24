import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  demoAuditLog,
  demoListUsers,
  isDemoStoreActive,
} from "@/lib/demo-store";
import { formatDateTime } from "@/lib/utils";
import {
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  UserX,
  PenTool,
  Gavel,
  Handshake,
  ScrollText,
  CheckCircle2,
  Clock,
  Settings,
} from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
}

interface StatGroup {
  title: string;
  stats: StatItem[];
}

interface ActivityRow {
  id: string;
  actor_label: string | null;
  action: string;
  target_label: string | null;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
}

const QUICK_ACTIONS = [
  { href: "/admin/users", label: "Manage users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
  { href: "/admin/activity", label: "Activity log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminOverviewPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let statGroups: StatGroup[];
  let activity: ActivityRow[];

  if (isDemoStoreActive()) {
    // Local demo store: read the JSON files directly instead of waiting on
    // Supabase round-trips that cannot succeed in this mode.
    const [users, audit] = await Promise.all([demoListUsers(), demoAuditLog()]);
    const count = (fn: (u: (typeof users)[number]) => boolean) =>
      users.filter(fn).length;

    statGroups = [
      {
        title: "Users",
        stats: [
          { label: "Total Users", value: users.length, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "New (7 days)", value: count((u) => u.created_at >= sevenDaysAgo), icon: UserCheck, color: "bg-indigo-50 text-indigo-600" },
          { label: "Active", value: count((u) => u.account_status === "active"), icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
          { label: "Suspended", value: count((u) => u.account_status === "suspended"), icon: UserX, color: "bg-red-50 text-red-600" },
        ],
      },
      {
        title: "Roles",
        stats: [
          { label: "Creators", value: count((u) => u.role === "creator"), icon: PenTool, color: "bg-blue-50 text-blue-600" },
          { label: "Moderators", value: count((u) => u.role === "moderator"), icon: Gavel, color: "bg-amber-50 text-amber-600" },
          { label: "Brand Ambassadors", value: count((u) => u.role === "ambassador"), icon: Handshake, color: "bg-rose-50 text-rose-600" },
        ],
      },
    ];
    activity = audit;
  } else {
    const supabase = await createClient();
    const [
      { count: totalUsers },
      { count: newUsers },
      { count: activeUsers },
      { count: suspendedUsers },
      { count: creatorCount },
      { count: moderatorCount },
      { count: ambassadorCount },
      { count: listingCount },
      { count: pendingListings },
      { count: rejectedListings },
      { count: reportPending },
      { count: reportReview },
      { count: reportResolved },
      { count: reportRejected },
      activityRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "active"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "suspended"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "creator"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "moderator"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "ambassador"),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected"),
      supabase
        .from("user_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("user_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_review"),
      supabase
        .from("user_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved"),
      supabase
        .from("user_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected"),
      supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    statGroups = [
      {
        title: "Users",
        stats: [
          { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "New (7 days)", value: newUsers ?? 0, icon: UserCheck, color: "bg-indigo-50 text-indigo-600" },
          { label: "Active", value: activeUsers ?? 0, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
          { label: "Suspended", value: suspendedUsers ?? 0, icon: UserX, color: "bg-red-50 text-red-600" },
        ],
      },
      {
        title: "Roles",
        stats: [
          { label: "Creators", value: creatorCount ?? 0, icon: PenTool, color: "bg-blue-50 text-blue-600" },
          { label: "Moderators", value: moderatorCount ?? 0, icon: Gavel, color: "bg-amber-50 text-amber-600" },
          { label: "Brand Ambassadors", value: ambassadorCount ?? 0, icon: Handshake, color: "bg-rose-50 text-rose-600" },
        ],
      },
      {
        title: "Projects & Content",
        stats: [
          { label: "Listings", value: listingCount ?? 0, icon: Package, color: "bg-purple-50 text-purple-600" },
          { label: "Pending Approval", value: pendingListings ?? 0, icon: Clock, color: "bg-orange-50 text-orange-600" },
          { label: "Removed Content", value: rejectedListings ?? 0, icon: UserX, color: "bg-red-50 text-red-600" },
        ],
      },
      {
        title: "Reports",
        stats: [
          { label: "Pending", value: reportPending ?? 0, icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
          { label: "In Review", value: reportReview ?? 0, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
          { label: "Resolved", value: reportResolved ?? 0, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
          { label: "Rejected", value: reportRejected ?? 0, icon: ScrollText, color: "bg-panel-2 text-ink-muted" },
        ],
      },
    ];
    activity = (activityRes.data ?? []) as ActivityRow[];
  }

  const actionLabels: Record<string, string> = {
    role_change: "Role change",
    account_status_change: "Account status change",
    permission_change: "Permission change",
    feature_change: "Project feature change",
    platform_setting_change: "Platform setting change",
    user_created: "User created",
    report_assigned: "Report assigned",
    report_status_change: "Report status change",
    moderation_action: "Moderation action",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Platform overview &amp; recent activity</p>
        </div>
        <Link
          href="/admin/activity"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          <ScrollText className="w-4 h-4" />
          Full activity log →
        </Link>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline bg-panel text-xs font-bold text-ink-muted hover:border-brand-300 hover:text-ink transition"
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Stats */}
        <div className="lg:col-span-2 space-y-6">
          {statGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {group.stats.map((stat) => (
                  <div key={stat.label} className="bg-panel rounded-xl border border-hairline p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-ink-muted">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-black text-ink">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <aside className="bg-panel rounded-xl border border-hairline overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Recent activity
            </h3>
            <Link
              href="/admin/activity"
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
            >
              View all
            </Link>
          </div>
          {activity.length === 0 ? (
            <div className="p-4 text-sm text-ink-muted">
              No administrative activity recorded yet. Role changes, permission
              changes, and moderation actions will appear here.
            </div>
          ) : (
            <ul className="divide-y divide-hairline max-h-[28rem] overflow-y-auto">
              {activity.map((log) => (
                <li key={log.id} className="px-4 py-3 space-y-1 text-sm">
                  <div className="min-w-0">
                    <span className="font-semibold text-ink">{log.actor_label || "System"}</span>
                    <span className="text-ink-muted"> — {actionLabels[log.action] || log.action}</span>
                    {log.target_label && (
                      <span className="text-ink-muted"> · {log.target_label}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {log.previous_value && log.new_value && (
                      <>
                        <span className="text-red-600">{log.previous_value}</span>
                        <span className="text-ink-muted">→</span>
                        <span className="text-emerald-600 font-bold">{log.new_value}</span>
                      </>
                    )}
                    <span className="text-ink-muted ml-auto whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

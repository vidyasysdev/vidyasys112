import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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
} from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

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

  const statGroups = [
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

  const activity = activityRes.data || [];

  return (
    <div className="space-y-8">
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

      {statGroups.map((group) => (
        <div key={group.title} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            {group.title}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Recent administrative activity
        </h3>
        {activity.length === 0 ? (
          <div className="bg-panel rounded-xl border border-hairline p-6 text-sm text-ink-muted">
            No administrative activity recorded yet. Role changes, permission changes, and
            moderation actions will appear here.
          </div>
        ) : (
          <div className="bg-panel rounded-xl border border-hairline divide-y divide-hairline">
            {activity.map((log) => (
              <div
                key={log.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-ink">{log.actor_label || "System"}</span>
                  <span className="text-ink-muted"> — {actionLabels[log.action] || log.action}</span>
                  {log.target_label && (
                    <span className="text-ink-muted"> · {log.target_label}</span>
                  )}
                </div>
                <div className="text-xs whitespace-nowrap">
                  {log.previous_value && log.new_value && (
                    <>
                      <span className="text-red-600">{log.previous_value}</span>
                      <span className="text-ink-muted mx-1">→</span>
                      <span className="text-emerald-600 font-bold">{log.new_value}</span>
                      <span className="text-ink-muted mx-2">·</span>
                    </>
                  )}
                  <span className="text-ink-muted">{formatDateTime(log.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Ban,
  Gavel,
  Handshake,
  PenTool,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import {
  RoleUsersTable,
  type AdminUserProfile,
} from "@/components/admin/RoleUsersTable";
import {
  ROLE_LABELS,
  ROLE_KEYS,
  ROLE_BADGE_CLASSES,
  ACCOUNT_STATUS_LABELS,
  type RoleKey,
} from "@/lib/rbac";
import {
  DEMO_ADMIN_USER_ID,
  demoListUsers,
  isDemoStoreActive,
} from "@/lib/demo-store";

export const metadata = { title: "Users" };

const STATUS_TABS = [
  { key: "", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "disabled", label: "Disabled" },
];

const ROLE_TABS = [
  { key: "", label: "All Roles" },
  ...ROLE_KEYS.map((r) => ({ key: r, label: ROLE_LABELS[r] })),
];

const ROLE_ICONS: Record<RoleKey, typeof Users> = {
  admin: Shield,
  creator: PenTool,
  moderator: Gavel,
  ambassador: Handshake,
  user: User,
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; role?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const role = params.role || "";

  let allUsers: AdminUserProfile[] = [];
  let currentUserId = "";
  const demoActive = isDemoStoreActive();

  if (demoActive) {
    // Local demo store — works without Supabase.
    allUsers = await demoListUsers();
    currentUserId = DEMO_ADMIN_USER_ID;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    allUsers = (data as unknown as AdminUserProfile[]) || [];
    currentUserId = user.id;
  }

  const users = allUsers.filter(
    (u) => (!status || u.account_status === status) && (!role || u.role === role)
  );

  // ---- Stats (computed from the full, unfiltered list) ----
  const byRole = Object.fromEntries(ROLE_KEYS.map((r) => [r, 0])) as Record<
    RoleKey,
    number
  >;
  let active = 0;
  let suspended = 0;
  let disabled = 0;
  let verified = 0;
  for (const u of allUsers) {
    if (byRole[u.role] !== undefined) byRole[u.role]++;
    if (u.account_status === "active") active++;
    else if (u.account_status === "suspended") suspended++;
    else if (u.account_status === "disabled") disabled++;
    if (u.verification_status === "verified") verified++;
  }

  const accountStats = [
    {
      label: "Total Accounts",
      value: allUsers.length,
      icon: Users,
      tone: "text-royal bg-royal/10",
    },
    {
      label: "Active",
      value: active,
      icon: UserCheck,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Suspended",
      value: suspended,
      icon: UserX,
      tone: "text-red-600 bg-red-50",
    },
    {
      label: "Disabled",
      value: disabled,
      icon: Ban,
      tone: "text-ink-muted bg-panel-2",
    },
    {
      label: "Verified",
      value: verified,
      icon: ShieldCheck,
      tone: "text-blue-600 bg-blue-50",
    },
  ];

  const buildHref = (nextStatus: string, nextRole: string) => {
    const sp = new URLSearchParams();
    if (nextStatus) sp.set("status", nextStatus);
    if (nextRole) sp.set("role", nextRole);
    const qs = sp.toString();
    return qs ? `/admin/users?${qs}` : "/admin/users";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Users</h1>
          <p className="text-sm text-ink-muted mt-1">
            {allUsers.length} registered accounts — platform stats, role changes and
            one-click Brand Ambassador promotions
          </p>
        </div>
        <CreateUserForm />
      </div>

      {/* ------------------------------ Stats ------------------------------ */}
      <section className="space-y-3" aria-label="Account statistics">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Account health
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {accountStats.map((s) => (
            <div
              key={s.label}
              className="bg-panel rounded-xl border border-hairline p-4 flex items-center gap-3"
            >
              <span
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.tone}`}
              >
                <s.icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xl font-black text-ink leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-ink-muted mt-1 truncate">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted pt-1">
          By role — click a card to filter
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ROLE_KEYS.map((r) => {
            const Icon = ROLE_ICONS[r];
            const isActive = role === r;
            return (
              <Link
                key={r}
                href={buildHref(status, isActive ? "" : r)}
                className={`bg-panel rounded-xl border p-4 flex items-center gap-3 transition ${
                  isActive
                    ? "border-royal/50 ring-2 ring-royal/25"
                    : "border-hairline hover:border-royal/30"
                }`}
                title={`Show ${ROLE_LABELS[r]} accounts`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ROLE_BADGE_CLASSES[r]}`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-xl font-black text-ink leading-none">
                    {byRole[r]}
                  </div>
                  <div className="text-xs text-ink-muted mt-1 truncate">
                    {ROLE_LABELS[r]}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ------------------------------ Filters ------------------------------ */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.key}
              href={buildHref(tab.key, role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                status === tab.key
                  ? "bg-royal text-white"
                  : "bg-panel border border-hairline text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => (
            <Link
              key={tab.key}
              href={buildHref(status, tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                role === tab.key
                  ? "bg-royal text-white"
                  : "bg-panel border border-hairline text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <RoleUsersTable users={users} currentUserId={currentUserId} />

      {users.length !== allUsers.length && (
        <div className="text-xs text-ink-muted">
          Showing {users.length} of {allUsers.length} accounts — clear the filters
          above to see everyone.
        </div>
      )}

      <div className="text-xs text-ink-muted">
        {demoActive ? (
          <>
            Demo mode: accounts are stored locally in{" "}
            <code className="px-1 py-0.5 rounded bg-panel-2 border border-hairline">
              .vidyasys-demo/
            </code>{" "}
            — role changes, statuses and new accounts persist between reloads. Configure real
            Supabase credentials to switch to live data.
          </>
        ) : (
          <>
            Role and account-status changes are applied through database functions with full
            audit logging — direct API or devtools edits are blocked at the column level.
          </>
        )}
        {status && (
          <>
            {" "}
            Filtered by status: {ACCOUNT_STATUS_LABELS[status as keyof typeof ACCOUNT_STATUS_LABELS] || status}.
          </>
        )}
      </div>
    </div>
  );
}

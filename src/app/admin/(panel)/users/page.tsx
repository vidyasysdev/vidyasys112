import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import {
  RoleUsersTable,
  type AdminUserProfile,
} from "@/components/admin/RoleUsersTable";
import { ROLE_LABELS, ROLE_KEYS, ACCOUNT_STATUS_LABELS } from "@/lib/rbac";
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; role?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const role = params.role || "";

  let users: AdminUserProfile[] = [];
  let total = 0;
  let currentUserId = "";
  const demoActive = isDemoStoreActive();

  if (demoActive) {
    // Local demo store — works without Supabase.
    users = await demoListUsers({ status, role });
    total = users.length;
    currentUserId = DEMO_ADMIN_USER_ID;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("account_status", status);
    if (role) query = query.eq("role", role);

    const { data } = await query;
    users = (data as unknown as AdminUserProfile[]) || [];

    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    total = count ?? users.length;
    currentUserId = user.id;
  }

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
            {total ?? users?.length ?? 0} registered accounts — create accounts, change roles,
            suspend or reactivate
          </p>
        </div>
        <CreateUserForm />
      </div>

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

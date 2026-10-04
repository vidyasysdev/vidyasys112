import { formatDateTime } from "@/lib/utils";
import { RoleSelect, StatusControl } from "@/components/admin/UserControls";
import { ROLE_LABELS, ROLE_BADGE_CLASSES, type RoleKey, type AccountStatus } from "@/lib/rbac";

export interface AdminUserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  branch: string | null;
  role: RoleKey;
  account_status: AccountStatus;
  verification_status: string;
  created_at: string;
}

export function RoleUsersTable({
  users,
  currentUserId,
}: {
  users: AdminUserProfile[];
  currentUserId: string;
}) {
  if (users.length === 0) {
    return (
      <div className="bg-panel rounded-xl border border-hairline p-12 text-center">
        <p className="text-sm text-ink-muted">No users match this filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="bg-panel-2 border-b border-hairline">
              <th className="text-left px-4 py-3 font-semibold text-ink">User</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Branch</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Verification</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Account</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Status Actions</th>
              <th className="text-left px-4 py-3 font-semibold text-ink">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {users.map((u) => {
              const isSelf = u.user_id === currentUserId;
              const roleCls = ROLE_BADGE_CLASSES[u.role] || ROLE_BADGE_CLASSES.user;
              return (
                <tr key={u.user_id} className="hover:bg-panel-2/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {(u.full_name || u.email || "?")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-ink flex items-center gap-2">
                          {u.full_name || "—"}
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${roleCls}`}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </div>
                        <div className="text-xs text-ink-muted truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{u.branch || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        u.verification_status === "verified"
                          ? "bg-emerald-50 text-emerald-700"
                          : u.verification_status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {u.verification_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        u.account_status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : u.account_status === "suspended"
                          ? "bg-red-50 text-red-700"
                          : "bg-panel-2 text-ink-muted"
                      }`}
                    >
                      {u.account_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={u.user_id} role={u.role} disabled={isSelf} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusControl userId={u.user_id} status={u.account_status} allowSelf={isSelf} />
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {formatDateTime(u.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

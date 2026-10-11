import { createClient } from "@/lib/supabase/server";
import { PermissionMatrix, type PermissionMatrixData } from "@/components/admin/PermissionMatrix";
import {
  ROLE_KEYS,
  PERMISSION_KEYS,
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSION_LABELS,
} from "@/lib/rbac";

export const metadata = { title: "Roles & Permissions" };

export default async function AdminRolesPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("role_permissions")
    .select("role, permission, enabled");

  const matrix = {} as PermissionMatrixData;
  for (const role of ROLE_KEYS) {
    matrix[role] = {} as PermissionMatrixData[typeof role];
    for (const permission of PERMISSION_KEYS) {
      const row = rows?.find((r) => r.role === role && r.permission === permission);
      matrix[role][permission] = row
        ? row.enabled
        : DEFAULT_ROLE_PERMISSIONS[role][permission];
    }
  }

  const summary = [
    { role: "Admin", count: `${PERMISSION_KEYS.length}/${PERMISSION_KEYS.length}`, note: "Full access, always enforced" },
    { role: "Creator", count: String(PERMISSION_KEYS.filter((p) => DEFAULT_ROLE_PERMISSIONS.creator[p]).length), note: "Can create content/projects" },
    { role: "Moderator", count: String(PERMISSION_KEYS.filter((p) => DEFAULT_ROLE_PERMISSIONS.moderator[p]).length), note: "Can moderate reports" },
    { role: "Brand Ambassador", count: String(PERMISSION_KEYS.filter((p) => DEFAULT_ROLE_PERMISSIONS.ambassador[p]).length), note: "Ambassador tools only" },
    { role: "Regular User", count: String(PERMISSION_KEYS.filter((p) => DEFAULT_ROLE_PERMISSIONS.user[p]).length), note: "Own account only" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Roles &amp; Permissions</h1>
        <p className="text-sm text-ink-muted mt-1">
          Toggle what each role can do — enforced in the backend, API, and database
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {summary.map((s) => (
          <div key={s.role} className="bg-panel rounded-xl border border-hairline p-4">
            <div className="text-sm font-bold text-ink">{s.role}</div>
            <div className="text-xl font-black text-royal mt-1">{s.count}</div>
            <div className="text-[11px] text-ink-muted mt-1">{s.note}</div>
          </div>
        ))}
      </div>

      <PermissionMatrix initial={matrix} />

      <div className="bg-panel rounded-xl border border-hairline p-5 space-y-2 text-xs text-ink-muted">
        <h3 className="text-sm font-bold text-ink">Permission reference</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {PERMISSION_KEYS.map((p) => (
            <li key={p}>
              <span className="font-semibold text-ink">{PERMISSION_LABELS[p]}</span> —{" "}
              <code className="text-[11px]">{p}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

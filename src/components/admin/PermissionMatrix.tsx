"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { setRolePermission } from "@/app/admin/actions";
import {
  ROLE_KEYS,
  ROLE_LABELS,
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  type RoleKey,
  type PermissionKey,
} from "@/lib/rbac";

export type PermissionMatrixData = Record<RoleKey, Record<PermissionKey, boolean>>;

export function PermissionMatrix({ initial }: { initial: PermissionMatrixData }) {
  const router = useRouter();
  const [matrix, setMatrix] = useState<PermissionMatrixData>(initial);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (role: RoleKey, permission: PermissionKey) => {
    if (role === "admin") return; // Admin is always fully permitted (DB-enforced)
    const next = !matrix[role][permission];
    const key = `${role}:${permission}`;

    setPendingKey(key);
    setError(null);
    setMatrix((m) => ({ ...m, [role]: { ...m[role], [permission]: next } }));

    startTransition(async () => {
      const res = await setRolePermission(role, permission, next);
      if (!res.ok) {
        setError(res.error || "Failed to update permission.");
        setMatrix((m) => ({ ...m, [role]: { ...m[role], [permission]: !next } }));
      } else {
        router.refresh();
      }
      setPendingKey(null);
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-panel-2 border-b border-hairline">
                <th className="text-left px-4 py-3 font-semibold text-ink sticky left-0 bg-panel-2">
                  Permission
                </th>
                {ROLE_KEYS.map((role) => (
                  <th
                    key={role}
                    className="px-3 py-3 text-center font-semibold text-ink whitespace-nowrap"
                  >
                    {ROLE_LABELS[role]}
                    {role === "admin" && (
                      <span className="block text-[10px] font-normal text-ink-muted">always on</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {PERMISSION_GROUPS.map((group) => (
                <Fragment key={group.title}>
                  <tr className="bg-panel-2/50">
                    <td
                      colSpan={ROLE_KEYS.length + 1}
                      className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted sticky left-0"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.permissions.map((permission) => (
                    <tr key={permission} className="hover:bg-panel-2/40">
                      <td className="px-4 py-3 font-semibold text-ink sticky left-0 bg-panel">
                        {PERMISSION_LABELS[permission]}
                      </td>
                      {ROLE_KEYS.map((role) => {
                        const enabled = matrix[role][permission];
                        const key = `${role}:${permission}`;
                        const busy = pendingKey === key;
                        const locked = role === "admin";
                        return (
                          <td key={role} className="px-3 py-3 text-center">
                            <button
                              type="button"
                              disabled={locked || busy}
                              onClick={() => toggle(role, permission)}
                              aria-label={`Toggle ${permission} for ${ROLE_LABELS[role]}`}
                              className={`w-8 h-8 rounded-lg border inline-flex items-center justify-center transition ${
                                enabled
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-panel-2 border-hairline text-ink-muted"
                              } ${locked ? "opacity-70 cursor-not-allowed" : "hover:border-royal/40"}`}
                            >
                              {busy ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : enabled ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Permissions are enforced in the database (RLS + server checks), not just hidden in the
        UI. Changes take effect immediately for all users of that role.
      </p>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { changeUserRole, setAccountStatus } from "@/app/admin/actions";
import {
  ROLE_KEYS,
  ROLE_LABELS,
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_LABELS,
  type RoleKey,
  type AccountStatus,
} from "@/lib/rbac";

export function RoleSelect({
  userId,
  role,
  disabled = false,
}: {
  userId: string;
  role: RoleKey;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: RoleKey) => {
    if (next === role) return;
    setError(null);
    startTransition(async () => {
      const res = await changeUserRole(userId, next);
      if (!res.ok) setError(res.error || "Failed to change role.");
      else router.refresh();
    });
  };

  return (
    <div className="space-y-1">
      <select
        value={role}
        disabled={disabled || pending}
        onChange={(e) => handleChange(e.target.value as RoleKey)}
        className="px-2 py-1.5 rounded-lg bg-panel border border-hairline text-xs font-semibold text-ink outline-none focus:border-royal/50 disabled:opacity-50"
      >
        {ROLE_KEYS.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {error && <div className="text-[11px] text-red-600 max-w-[180px]">{error}</div>}
      {pending && <Loader2 className="w-3 h-3 animate-spin text-ink-muted" />}
    </div>
  );
}

export function StatusControl({
  userId,
  status,
  allowSelf = false,
}: {
  userId: string;
  status: AccountStatus;
  allowSelf?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setStatus = (next: AccountStatus) => {
    if (next === status) return;
    setError(null);
    startTransition(async () => {
      const res = await setAccountStatus(userId, next);
      if (!res.ok) setError(res.error || "Failed to update status.");
      else router.refresh();
    });
  };

  if (allowSelf) {
    return <span className="text-[11px] text-ink-muted">You</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {ACCOUNT_STATUSES.filter((s) => s !== "active").map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending || status === s}
            onClick={() => setStatus(s)}
            className="px-2 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold hover:bg-red-100 transition disabled:opacity-40"
            title={`Set account to ${ACCOUNT_STATUS_LABELS[s]}`}
          >
            {s === "suspended" ? "Suspend" : "Disable"}
          </button>
        ))}
        {status !== "active" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("active")}
            className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition disabled:opacity-40"
          >
            Reactivate
          </button>
        )}
        {pending && <Loader2 className="w-3 h-3 animate-spin text-ink-muted" />}
      </div>
      {error && <div className="text-[11px] text-red-600 max-w-[180px]">{error}</div>}
    </div>
  );
}

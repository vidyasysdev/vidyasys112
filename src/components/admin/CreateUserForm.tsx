"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, X } from "lucide-react";
import { createUserAccount } from "@/app/admin/actions";
import { ROLE_KEYS, ROLE_LABELS, type RoleKey } from "@/lib/rbac";

export function CreateUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleKey>("user");

  const reset = () => {
    setEmail("");
    setFullName("");
    setPassword("");
    setRole("user");
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await createUserAccount({ email, password, fullName, role });
      if (!res.ok) {
        setError(res.error || "Failed to create account.");
      } else {
        setSuccess(
          res.error
            ? res.error
            : `Account created for ${email.trim().toLowerCase()}. They can sign in with the password you set.`
        );
        reset();
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <div>
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {!open ? (
        <button
          onClick={() => { setSuccess(null); setOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="bg-panel rounded-xl border border-hairline p-4 sm:p-5 space-y-4 max-w-lg"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Create user account</h3>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="p-1 rounded-lg text-ink-muted hover:bg-panel-2"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="cu-email" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              College Email
            </label>
            <input
              id="cu-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@vpt.edu.in"
              className="w-full px-3 py-2 rounded-lg bg-panel border border-slate-300 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cu-name" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Full Name
            </label>
            <input
              id="cu-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-panel border border-slate-300 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="cu-pass" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Temporary Password
              </label>
              <input
                id="cu-pass"
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-3 py-2 rounded-lg bg-panel border border-slate-300 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cu-role" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Role
              </label>
              <select
                id="cu-role"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleKey)}
                className="w-full px-3 py-2 rounded-lg bg-panel border border-slate-300 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ROLE_KEYS.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}

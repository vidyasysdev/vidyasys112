"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setProjectFeature, setPlatformSetting } from "@/app/admin/actions";
import { PROJECT_KEYS, PROJECT_LABELS, type ProjectKey } from "@/lib/rbac";

export function ProjectFeatureToggles({
  features,
}: {
  features: Record<ProjectKey, Record<string, boolean>>;
}) {
  const router = useRouter();
  const [state, setState] = useState(features);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (project: ProjectKey, feature: string) => {
    const next = !state[project][feature];
    const key = `${project}:${feature}`;
    setPendingKey(key);
    setError(null);
    setState((s) => ({ ...s, [project]: { ...s[project], [feature]: next } }));

    startTransition(async () => {
      const res = await setProjectFeature(project, feature, next);
      if (!res.ok) {
        setError(res.error || "Failed to update feature.");
        setState((s) => ({ ...s, [project]: { ...s[project], [feature]: !next } }));
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_KEYS.map((project) => {
          const enabled = state[project]["create_listing"];
          const busy = pendingKey === `${project}:create_listing`;
          return (
            <div key={project} className="bg-panel rounded-xl border border-hairline p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">{PROJECT_LABELS[project]}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    <code className="px-1 py-0.5 rounded bg-panel-2">{project}</code>
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                    enabled ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {enabled ? "ON" : "OFF"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-panel-2 border border-hairline">
                <div>
                  <div className="text-sm font-semibold text-ink">Create Listing</div>
                  <div className="text-xs text-ink-muted">
                    Allow roles with Create Content permission to list in this project
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => toggle(project, "create_listing")}
                  className={`relative w-12 h-6 rounded-full transition disabled:opacity-50 ${
                    enabled ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`Create Listing for ${PROJECT_LABELS[project]}`}
                >
                  {busy ? (
                    <Loader2 className="absolute inset-0 m-auto w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                      style={{ left: enabled ? "1.625rem" : "0.125rem" }}
                    />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-muted">
        Turning a project feature OFF blocks listing creation for that project at the database
        level (RLS), for every role including admins&apos; users — no code change required.
      </p>
    </div>
  );
}

export function PlatformSettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [state, setState] = useState(settings);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rows: { key: string; label: string; description: string }[] = [
    {
      key: "marketplace_enabled",
      label: "Marketplace Enabled",
      description: "Global kill-switch for creating listings in every project",
    },
    {
      key: "signups_enabled",
      label: "Signups Enabled",
      description: "Allow new student registrations (enforced in middleware)",
    },
  ];

  const toggle = (key: string) => {
    const prev = state[key];
    const next = prev === "true" ? "false" : "true";
    setPendingKey(key);
    setError(null);
    setState((s) => ({ ...s, [key]: next }));

    startTransition(async () => {
      const res = await setPlatformSetting(key, next as "true" | "false");
      if (!res.ok) {
        setError(res.error || "Failed to update setting.");
        setState((s) => ({ ...s, [key]: prev }));
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

      <div className="bg-panel rounded-xl border border-hairline divide-y divide-hairline">
        {rows.map((row) => {
          const on = state[row.key] === "true";
          const busy = pendingKey === row.key;
          return (
            <div key={row.key} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-ink">{row.label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{row.description}</div>
                <code className="text-[10px] text-ink-muted">{row.key}</code>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => toggle(row.key)}
                className={`relative w-12 h-6 rounded-full transition shrink-0 disabled:opacity-50 ${
                  on ? "bg-emerald-500" : "bg-slate-300"
                }`}
                role="switch"
                aria-checked={on}
                aria-label={row.label}
              >
                {busy ? (
                  <Loader2 className="absolute inset-0 m-auto w-4 h-4 animate-spin text-white" />
                ) : (
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: on ? "1.625rem" : "0.125rem" }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

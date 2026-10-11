import { createClient } from "@/lib/supabase/server";
import { PlatformSettingsForm } from "@/components/admin/SettingsControls";
import { ROLE_LABELS, ROLE_KEYS } from "@/lib/rbac";
import Link from "next/link";

export const metadata = { title: "Platform Settings" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("platform_settings")
    .select("key, value");

  const settings: Record<string, string> = {
    marketplace_enabled: "true",
    signups_enabled: "true",
  };
  for (const row of rows || []) settings[row.key] = row.value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Platform Settings</h1>
        <p className="text-sm text-ink-muted mt-1">
          Global switches and shortcuts to role, permission, and project configuration
        </p>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
          Global Settings
        </h3>
        <PlatformSettingsForm settings={settings} />
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
          Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/roles"
            className="bg-panel rounded-xl border border-hairline p-5 hover:border-royal/40 transition"
          >
            <div className="text-sm font-bold text-ink">Role Settings</div>
            <div className="text-xs text-ink-muted mt-1">
              {ROLE_KEYS.map((r) => ROLE_LABELS[r]).join(", ")}
            </div>
            <div className="text-xs font-semibold text-brand-600 mt-2">Manage roles →</div>
          </Link>
          <Link
            href="/admin/roles"
            className="bg-panel rounded-xl border border-hairline p-5 hover:border-royal/40 transition"
          >
            <div className="text-sm font-bold text-ink">Permission Settings</div>
            <div className="text-xs text-ink-muted mt-1">
              The full role × permission matrix
            </div>
            <div className="text-xs font-semibold text-brand-600 mt-2">Manage permissions →</div>
          </Link>
          <Link
            href="/admin/projects"
            className="bg-panel rounded-xl border border-hairline p-5 hover:border-royal/40 transition"
          >
            <div className="text-sm font-bold text-ink">Project Settings</div>
            <div className="text-xs text-ink-muted mt-1">
              Per-module feature controls (Create Listing, …)
            </div>
            <div className="text-xs font-semibold text-brand-600 mt-2">Manage projects →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

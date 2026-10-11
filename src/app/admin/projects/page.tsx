import { createClient } from "@/lib/supabase/server";
import { ProjectFeatureToggles } from "@/components/admin/SettingsControls";
import { PROJECT_KEYS, type ProjectKey } from "@/lib/rbac";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("project_features")
    .select("project_key, feature_key, enabled");

  const features = {} as Record<ProjectKey, Record<string, boolean>>;
  for (const project of PROJECT_KEYS) {
    features[project] = {};
    for (const row of rows || []) {
      if (row.project_key === project) features[project][row.feature_key] = row.enabled;
    }
    if (features[project]["create_listing"] === undefined) {
      features[project]["create_listing"] = true;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Projects</h1>
        <p className="text-sm text-ink-muted mt-1">
          Configure features per project/module — no code change required
        </p>
      </div>

      <ProjectFeatureToggles features={features} />

      <div className="bg-panel rounded-xl border border-hairline p-5 text-xs text-ink-muted space-y-2">
        <h3 className="text-sm font-bold text-ink">How this is enforced</h3>
        <p>
          Each toggle writes to the <code className="px-1 py-0.5 rounded bg-panel-2">project_features</code>{" "}
          table. Listing creation in the database checks both the project feature flag{" "}
          <em>and</em> the role&apos;s Create Content permission on every insert (RLS), so
          turning a feature OFF cannot be bypassed via direct API calls.
        </p>
      </div>
    </div>
  );
}

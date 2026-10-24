import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  demoListUsers,
  getDemoAuthContext,
  isDemoStoreActive,
} from "@/lib/demo-store";
import { demoHomeForRole } from "@/lib/demo-admin";
import { Handshake, Users, Copy } from "lucide-react";

export const metadata = { title: "Ambassador Tools" };

interface AmbassadorViewProps {
  collegeCount: number;
  inviteCode: string;
}

function AmbassadorView({ collegeCount, inviteCode }: AmbassadorViewProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Ambassador Tools</h1>
        <p className="text-sm text-ink-muted mt-1">
          Campus growth toolkit for Brand Ambassadors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-panel rounded-xl border border-hairline p-5">
          <div className="flex items-center gap-2 mb-2">
            <Handshake className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-semibold text-ink-muted">Your Role</span>
          </div>
          <div className="text-xl font-black text-ink">Brand Ambassador</div>
        </div>
        <div className="bg-panel rounded-xl border border-hairline p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-ink-muted">College Members</span>
          </div>
          <div className="text-xl font-black text-ink">{collegeCount}</div>
        </div>
        <div className="bg-panel rounded-xl border border-hairline p-5">
          <div className="flex items-center gap-2 mb-2">
            <Copy className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-ink-muted">Invite Code</span>
          </div>
          <div className="text-xl font-black font-mono text-ink">{inviteCode}</div>
        </div>
      </div>

      <div className="bg-panel rounded-xl border border-hairline p-6 space-y-3 text-sm text-ink-muted">
        <h3 className="text-sm font-bold text-ink">What you can do</h3>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Share your invite code with classmates to grow the campus network</li>
          <li>Track how many students have joined from your college</li>
          <li>Represent Vidyasys at campus events and orientation weeks</li>
        </ul>
      </div>
    </div>
  );
}

function inviteCodeFor(name: string): string {
  return `VIDYA-${name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase()}`;
}

export default async function AmbassadorPage() {
  // Local demo session (e.g. yash@vidyasys.in) — no Supabase required.
  if (isDemoStoreActive()) {
    const demo = await getDemoAuthContext();
    if (!demo) redirect("/login");
    if (demo.role !== "ambassador" && demo.role !== "admin") {
      redirect(demoHomeForRole(demo.role));
    }

    const users = await demoListUsers();
    const me = users.find((u) => u.user_id === demo.userId);
    const collegeCount = users.filter((u) =>
      u.email.toLowerCase().endsWith("@vpt.edu.in")
    ).length;
    const fullName = me?.full_name ?? demo.email.split("@")[0];

    return (
      <AmbassadorView
        collegeCount={collegeCount}
        inviteCode={inviteCodeFor(fullName)}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_admin")
    .eq("user_id", user.id)
    .single();

  const isAmbassador =
    profile?.role === "ambassador" || profile?.is_admin === true;
  if (!isAmbassador) redirect("/app");

  const { count: collegeCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("college_id", "vpt.edu.in");

  return (
    <AmbassadorView
      collegeCount={collegeCount ?? 0}
      inviteCode={inviteCodeFor(profile?.full_name || "AMB")}
    />
  );
}

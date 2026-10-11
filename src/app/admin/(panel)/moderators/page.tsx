import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoleUsersTable, type AdminUserProfile } from "@/components/admin/RoleUsersTable";
import {
  DEMO_ADMIN_USER_ID,
  demoListUsers,
  isDemoStoreActive,
} from "@/lib/demo-store";
import { Gavel } from "lucide-react";

export const metadata = { title: "Moderators" };

export default async function AdminModeratorsPage() {
  let list: AdminUserProfile[] = [];
  let currentUserId = "";
  let assignedCount = 0;

  if (isDemoStoreActive()) {
    // Local demo store — works without Supabase.
    list = await demoListUsers({ role: "moderator" });
    currentUserId = DEMO_ADMIN_USER_ID;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const [{ data: users }, { count }] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "moderator")
        .order("created_at", { ascending: false }),
      supabase
        .from("user_reports")
        .select("*", { count: "exact", head: true })
        .not("assigned_to", "is", null),
    ]);

    list = (users as unknown as AdminUserProfile[]) || [];
    assignedCount = count ?? 0;
    currentUserId = user.id;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Moderators</h1>
        <p className="text-sm text-ink-muted mt-1">
          {list.length} moderator account{list.length === 1 ? "" : "s"} · {assignedCount ?? 0}{" "}
          report{assignedCount === 1 ? "" : "s"} currently assigned
        </p>
      </div>

      {list.length === 0 && (
        <div className="bg-panel rounded-xl border border-hairline p-10 text-center">
          <Gavel className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-ink-muted">
            No moderators yet. Promote a user to <strong>Moderator</strong> from the Users page
            to grant Moderate Reports permission.
          </p>
        </div>
      )}

      {list.length > 0 && <RoleUsersTable users={list} currentUserId={currentUserId} />}
    </div>
  );
}

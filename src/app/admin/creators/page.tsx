import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoleUsersTable, type AdminUserProfile } from "@/components/admin/RoleUsersTable";
import { PenTool } from "lucide-react";

export const metadata = { title: "Creators" };

export default async function AdminCreatorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "creator")
    .order("created_at", { ascending: false });

  const list = (users as unknown as AdminUserProfile[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Creators</h1>
        <p className="text-sm text-ink-muted mt-1">
          {list.length} creator account{list.length === 1 ? "" : "s"} — users with permission to
          create content, notes, and project listings
        </p>
      </div>

      {list.length === 0 && (
        <div className="bg-panel rounded-xl border border-hairline p-10 text-center">
          <PenTool className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-ink-muted">
            No creators yet. Promote a user to <strong>Creator</strong> from the Users page to
            grant Create Content permission.
          </p>
        </div>
      )}

      {list.length > 0 && (
        <RoleUsersTable users={list} currentUserId={user.id} />
      )}
    </div>
  );
}

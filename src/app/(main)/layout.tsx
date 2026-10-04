import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { DEFAULT_ROLE_PERMISSIONS, type RoleKey } from "@/lib/rbac";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let role: RoleKey = "user";

  const { data: rbacProfile, error: rbacError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!rbacError && rbacProfile?.role) {
    role = rbacProfile.role as RoleKey;
  } else {
    const { data: adminFlag } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();
    if (adminFlag?.is_admin === true) role = "admin";
  }

  const isAdmin = role === "admin";

  const { data: permRows } = isAdmin
    ? { data: null }
    : await supabase
        .from("role_permissions")
        .select("permission, enabled")
        .eq("role", role);

  const canCreate = isAdmin
    ? true
    : permRows
      ? permRows.some((p) => p.permission === "create_content" && p.enabled)
      : DEFAULT_ROLE_PERMISSIONS[role].create_content;

  const canModerate = isAdmin
    ? true
    : permRows
      ? permRows.some((p) => p.permission === "moderate_reports" && p.enabled)
      : DEFAULT_ROLE_PERMISSIONS[role].moderate_reports;

  return (
    <div className="min-h-screen bg-panel-2 flex">
      <AppSidebar user={user} role={role} canModerate={canModerate} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <AppTopbar user={user} canCreate={canCreate} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

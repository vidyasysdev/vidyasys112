import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "@/lib/utils";
import { logAdminAction } from "@/lib/admin-log";

export default async function AdminVerificationsPage() {
  const supabase = await createClient();

  const { data: pendingProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  const { data: pendingTutors } = await supabase
    .from("tutor_profiles")
    .select("*, profiles!user_id(full_name, email, college_id)")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  async function approveProfile(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const supabase = await createClient();
    await supabase.from("profiles").update({ verification_status: "verified" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "profile",
      targetId: id,
      targetLabel: label || id,
      previousValue: "pending",
      newValue: "verified",
    });
    revalidatePath("/admin/verifications");
  }

  async function rejectProfile(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const supabase = await createClient();
    await supabase.from("profiles").update({ verification_status: "rejected" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "profile",
      targetId: id,
      targetLabel: label || id,
      previousValue: "pending",
      newValue: "rejected",
    });
    revalidatePath("/admin/verifications");
  }

  async function approveTutor(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const supabase = await createClient();
    await supabase.from("tutor_profiles").update({ verification_status: "verified" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "tutor_profile",
      targetId: id,
      targetLabel: label || id,
      previousValue: "pending",
      newValue: "verified",
    });
    revalidatePath("/admin/verifications");
  }

  async function rejectTutor(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const supabase = await createClient();
    await supabase.from("tutor_profiles").update({ verification_status: "rejected" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "tutor_profile",
      targetId: id,
      targetLabel: label || id,
      previousValue: "pending",
      newValue: "rejected",
    });
    revalidatePath("/admin/verifications");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-ink tracking-tight">Verifications</h1>

      {/* Student Verifications */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-3">Student Verifications</h2>
        {pendingProfiles && pendingProfiles.length > 0 ? (
          <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-panel-2 border-b border-hairline">
                    <th className="text-left px-4 py-3 font-semibold text-ink">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink">College</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink">Applied</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {pendingProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-panel-2">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-ink">{profile.full_name}</div>
                        <div className="text-xs text-ink-muted">{profile.email}</div>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{profile.college_id}</td>
                      <td className="px-4 py-3 text-xs text-ink-muted">{formatDateTime(profile.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <form action={approveProfile}>
                            <input type="hidden" name="id" value={profile.id} />
                            <input type="hidden" name="label" value={profile.full_name || profile.email} />
                            <button type="submit" className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition">
                              Approve
                            </button>
                          </form>
                          <form action={rejectProfile}>
                            <input type="hidden" name="id" value={profile.id} />
                            <input type="hidden" name="label" value={profile.full_name || profile.email} />
                            <button type="submit" className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition">
                              Reject
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-panel rounded-xl border border-hairline p-8 text-center text-sm text-ink-muted">
            No pending student verifications
          </div>
        )}
      </div>

      {/* Tutor Verifications */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-3">Tutor Verifications</h2>
        {pendingTutors && pendingTutors.length > 0 ? (
          <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-panel-2 border-b border-hairline">
                    <th className="text-left px-4 py-3 font-semibold text-ink">Tutor</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink">Subjects</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {pendingTutors.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-panel-2">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-ink">{tutor.profiles?.full_name}</div>
                        <div className="text-xs text-ink-muted">{tutor.profiles?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-muted">{tutor.subjects?.join(", ")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <form action={approveTutor}>
                            <input type="hidden" name="id" value={tutor.id} />
                            <input type="hidden" name="label" value={tutor.profiles?.full_name || tutor.profiles?.email || ""} />
                            <button type="submit" className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition">
                              Approve
                            </button>
                          </form>
                          <form action={rejectTutor}>
                            <input type="hidden" name="id" value={tutor.id} />
                            <input type="hidden" name="label" value={tutor.profiles?.full_name || tutor.profiles?.email || ""} />
                            <button type="submit" className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition">
                              Reject
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-panel rounded-xl border border-hairline p-8 text-center text-sm text-ink-muted">
            No pending tutor verifications
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User, Shield, Pencil, Save, X, Loader2, CheckCircle2 } from "lucide-react";
import { VP_BRANCHES, SEMESTERS } from "@/lib/academics";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState(1);
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setBranch(profile.branch || "");
        setSemester(profile.semester || 1);
        setYearOfStudy(profile.year_of_study || 1);
        setPhone(profile.phone || "");
        setBio(profile.bio || "");
        setSkills(Array.isArray(profile.skills) ? profile.skills.join(", ") : "");
        setVerified(profile.verification_status === "verified");
      } else {
        setFullName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
      setInitializing(false);
    };

    loadProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      setSaving(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        branch,
        semester,
        year_of_study: yearOfStudy,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      })
      .eq("user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(false);
    setSaved(true);
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-royal" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">Manage your account</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Profile updated successfully.
        </div>
      )}

      <div className="bg-panel rounded-2xl border border-hairline divide-y divide-hairline">
        {!editing ? (
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-ink-muted" />
              <div>
                <h3 className="text-sm font-bold text-ink">Edit Profile</h3>
                <p className="text-xs text-ink-muted">Update your name, bio, and skills</p>
              </div>
            </div>
            <button
              onClick={() => { setSaved(false); setEditing(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-ink-muted" />
                <h3 className="text-sm font-bold text-ink">Edit Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => { setEditing(false); setError(null); }}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-panel-2 transition"
                aria-label="Cancel editing"
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
              <label htmlFor="settingsName" className="text-sm font-semibold text-ink">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="settingsName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="settingsBranch" className="text-sm font-semibold text-ink">
                  Branch
                </label>
                <select
                  id="settingsBranch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select</option>
                  {VP_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>{b.code} — {b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settingsSemester" className="text-sm font-semibold text-ink">
                  Semester
                </label>
                <select
                  id="settingsSemester"
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settingsYear" className="text-sm font-semibold text-ink">
                  Year of Study
                </label>
                <select
                  id="settingsYear"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                >
                  {[1, 2, 3].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settingsPhone" className="text-sm font-semibold text-ink">
                Phone <span className="text-ink-muted font-normal">(optional)</span>
              </label>
              <input
                id="settingsPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settingsBio" className="text-sm font-semibold text-ink">
                Bio <span className="text-ink-muted font-normal">(optional)</span>
              </label>
              <textarea
                id="settingsBio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settingsSkills" className="text-sm font-semibold text-ink">
                Skills <span className="text-ink-muted font-normal">(comma-separated)</span>
              </label>
              <input
                id="settingsSkills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="JavaScript, PCB Design, AutoCAD"
                className="w-full px-4 py-2.5 rounded-lg bg-panel border border-slate-300 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-ink-muted" />
            <div>
              <h3 className="text-sm font-bold text-ink">Verification Status</h3>
              <p className="text-xs text-ink-muted">
                {verified ? "College email verified" : "Not verified yet"}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              verified
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {verified ? "Verified" : "Pending"}
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}

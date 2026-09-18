"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User, BookOpen, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Other",
];

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState(1);
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
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
        setFullName(profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "");
        setBranch(profile.branch || "");
        setSemester(profile.semester || 1);
        setYearOfStudy(profile.year_of_study || 1);
        setPhone(profile.phone || "");
        setBio(profile.bio || "");
      } else {
        setFullName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
      setLoading(false);
    };

    loadProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      setSaving(false);
      return;
    }

    if (!branch) {
      setError("Please select your branch.");
      setSaving(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in.");
      setSaving(false);
      return;
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const profileData = {
      full_name: fullName.trim(),
      branch,
      semester,
      year_of_study: yearOfStudy,
      phone: phone.trim() || null,
      bio: bio.trim() || null,
      onboarding_completed: true,
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("user_id", user.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          email: user.email || "",
          ...profileData,
          college_id: "",
          verification_status: "verified",
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setDone(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">You&apos;re all set!</h1>
          <p className="text-sm text-slate-600">
            Your profile is complete. Welcome to Vidyasys!
          </p>
          <button
            onClick={() => window.location.href = "/app"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <Image src="/images/logo.png" alt="Vidyasys" width={48} height={48} className="h-10 w-auto mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Complete your profile</h1>
          <p className="text-sm text-slate-600">
            Tell us about yourself so others can find you on campus
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aryan Sonsurkar"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="branch" className="text-sm font-semibold text-slate-700">
                Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="semester" className="text-sm font-semibold text-slate-700">
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="yearOfStudy" className="text-sm font-semibold text-slate-700">
              Year of Study
            </label>
            <select
              id="yearOfStudy"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white"
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
              Phone <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-sm font-semibold text-slate-700">
              Bio <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Complete Setup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

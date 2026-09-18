"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, KeyRound, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { APPROVED_DOMAINS } from "@/lib/utils";

type Step = "email" | "otp" | "done";

export default function VerifyCollegePage() {
  const [step, setStep] = useState<Step>("email");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const getCollegeFromEmail = (email: string): string | null => {
    const domain = email.split("@")[1];
    if (!domain) return null;
    if (APPROVED_DOMAINS.includes(domain)) return domain;
    return null;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const domain = getCollegeFromEmail(collegeEmail);
    if (!domain) {
      setError("Please use your college email from an approved domain.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: collegeEmail,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: collegeEmail,
      token: otp,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const domain = getCollegeFromEmail(collegeEmail);
    const userId = data.user?.id;

    if (userId) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        await supabase
          .from("profiles")
          .update({
            email: collegeEmail,
            college_id: domain || "",
            verification_status: "verified",
          })
          .eq("user_id", userId);
      } else {
        await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            email: collegeEmail,
            full_name: data.user?.user_metadata?.full_name || collegeEmail.split("@")[0],
            college_id: domain || "",
            branch: "",
            semester: 1,
            year_of_study: 1,
            verification_status: "verified",
          });
      }
    }

    setStep("done");
    setLoading(false);
  };

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">College verified!</h1>
          <p className="text-sm text-slate-600">
            Your college email <strong>{collegeEmail}</strong> has been verified. You now have full access to Vidyasys.
          </p>
          <button
            onClick={() => window.location.href = "/onboarding"}
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <Image src="/images/logo.png" alt="Vidyasys" width={48} height={48} className="h-10 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Verify your college</h1>
          <p className="text-sm text-slate-600">
            Enter your college email to get verified as a student
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-50 border border-brand-100">
            <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
            <p className="text-xs text-brand-700">
              Enter your <strong>college email</strong> and verify with the OTP sent to it.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="collegeEmail" className="text-sm font-semibold text-slate-700">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="collegeEmail"
                    type="email"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    placeholder="you@vpt.edu.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  We&apos;ll send a one-time code to verify you&apos;re a student.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                Code sent to <strong>{collegeEmail}</strong>. Check your inbox.
              </div>

              <div className="space-y-1.5">
                <label htmlFor="otp" className="text-sm font-semibold text-slate-700">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the code from your email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(null); }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
              >
                Change email address
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-600">
          Want to use email/password instead?{" "}
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/signup"; }}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Sign up with college email
          </button>
        </p>
        <p className="text-center text-xs text-slate-400">
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}
            className="hover:text-slate-600"
          >
            Sign out and use a different account
          </button>
        </p>
      </div>
    </div>
  );
}

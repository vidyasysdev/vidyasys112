"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signInAsDemoAdmin } from "@/app/admin/login/actions";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

const PANEL_PERKS = [
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: "Live analytics",
    body: "Orders, listings, bookings and growth in real time.",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    title: "Moderation queue",
    body: "Review reports, verifications and suspended accounts.",
  },
  {
    icon: <KeyRound className="w-4 h-4" />,
    title: "Role-based access",
    body: "Grant exactly the permissions each teammate needs.",
  },
];

export function AdminLoginForm() {
  const [email, setEmail] = useState("rajbhosale@vidyasys.in");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // 1) Real Supabase account, when auth is configured.
    let supabaseError: string | null = null;
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured");
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (!signInError && data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, is_admin")
          .eq("user_id", data.user.id)
          .maybeSingle();

        const isAdmin = profile?.role === "admin" || profile?.is_admin === true;

        if (isAdmin) {
          router.push("/admin");
          router.refresh();
          return;
        }

        await supabase.auth.signOut();
        setError("This account does not have administrator access.");
        setLoading(false);
        return;
      }

      supabaseError = signInError?.message ?? null;
    } catch {
      supabaseError = null;
    }

    // 2) Local bootstrap admin (works without Supabase configured).
    const result = await signInAsDemoAdmin(email, password);
    if (result.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }

    setError(
      result.code === "disabled"
        ? (supabaseError ?? "Incorrect email or password.")
        : result.error
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas">
      {/* ----------------------------- Brand panel ----------------------------- */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10 text-white bg-gradient-to-br from-brand-950 via-[#0d1b45] to-[#26125e]">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 30% 30%, #000 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 30% 30%, #000 20%, transparent 75%)",
          }}
        />
        <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-royal/40 blur-[110px] animate-aurora-a" />
        <div className="absolute -bottom-28 -right-10 w-96 h-96 rounded-full bg-fuchsia-500/30 blur-[110px] animate-aurora-b" />

        <Link href="/" className="relative group inline-flex items-center gap-3 w-fit">
          <span className="relative">
            <span className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-royal via-violet-500 to-fuchsia-500 opacity-60 blur-md transition-opacity group-hover:opacity-100" />
            <Image
              src="/images/logo.jpeg"
              alt="Vidyasys"
              width={44}
              height={44}
              className="relative h-10 w-auto rounded-xl"
              priority
            />
          </span>
          <span className="flex items-baseline text-xl font-black tracking-tight">
            <span>Vidya</span>
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              sys
            </span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200/80 self-center">
              Admin
            </span>
          </span>
        </Link>

        <div className="relative space-y-6 max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Restricted area
          </span>

          <h1 className="text-4xl font-black leading-[1.1] tracking-tight">
            Run the campus.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              Watch it grow.
            </span>
          </h1>

          <p className="text-sm text-blue-100/75 leading-relaxed">
            One console for users, content, orders and payments across every
            campus on Vidyasys.
          </p>

          <ul className="space-y-3 pt-2">
            {PANEL_PERKS.map((perk) => (
              <li
                key={perk.title}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="mt-0.5 w-8 h-8 shrink-0 rounded-xl bg-white/10 grid place-items-center text-indigo-200">
                  {perk.icon}
                </span>
                <span>
                  <span className="block text-sm font-bold">{perk.title}</span>
                  <span className="block text-xs text-blue-100/70 leading-relaxed">
                    {perk.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-blue-100/60">
          Authorised personnel only · All actions are audit-logged
        </p>
      </aside>

      {/* ------------------------------- Form --------------------------------- */}
      <main className="relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-24 right-0 w-80 h-80 bg-royal/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-sm space-y-7">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-royal transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to website
          </Link>

          <div className="space-y-1.5">
            <div className="lg:hidden inline-flex items-center gap-2 mb-2">
              <Image src="/images/logo.jpeg" alt="" width={32} height={32} className="h-8 w-auto rounded-lg" />
              <span className="text-lg font-black tracking-tight text-ink">
                Vidya<span className="text-royal">sys</span>
                <span className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted">
                  Admin
                </span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Administrator sign in
            </h2>
            <p className="text-sm text-ink-muted">
              Use your admin credentials to open the control panel.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-6 space-y-4 shadow-xl shadow-brand-950/5"
          >
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-semibold text-red-600 dark:text-red-300"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  suppressHydrationWarning
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vidyasys.in"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel border border-hairline text-sm font-semibold text-ink placeholder:text-ink-muted focus:border-royal/60 focus:ring-2 focus:ring-royal/20 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  suppressHydrationWarning
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-panel border border-hairline text-sm font-semibold text-ink placeholder:text-ink-muted focus:border-royal/60 focus:ring-2 focus:ring-royal/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-ink-muted hover:text-royal hover:bg-panel-2 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-royal to-violet-600 hover:from-royal-strong hover:to-violet-700 text-white text-sm font-bold transition shadow-lg shadow-royal/25 btn-shine disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Enter the panel
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <p className="text-[11px] text-ink-muted leading-relaxed text-center">
              Sessions are secured with Supabase auth. Non-admin accounts are
              rejected automatically.
            </p>
          </form>

          <div className="text-center text-sm text-ink-muted">
            Student instead?{" "}
            <Link href="/login" className="font-bold text-royal hover:underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

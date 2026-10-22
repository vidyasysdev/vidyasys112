import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Handshake,
  ShieldCheck,
  ChevronRight,
  Lock,
  Sparkles,
  Users,
  Zap,
  Wrench,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { AcademicSelector } from "@/components/academics/AcademicSelector";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";

export const dynamic = "force-static";

const PILLARS = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Notes",
    description:
      "Semester-wise academic notes for Vidyalankar Polytechnic — every file verified before it goes live.",
    href: "/notes",
    status: "Coming Soon",
    statusTone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    icon: <FolderKanban className="w-6 h-6" />,
    title: "Projects & Hardware",
    description:
      "Academic project kits and hardware resources, reserved and managed right on campus.",
    href: "/projects",
    status: null,
    statusTone: "",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Peer Tutors",
    description:
      "Book 1-on-1 or group sessions with verified senior students who already cleared that semester.",
    href: "/tutors",
    status: null,
    statusTone: "",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Partnerships",
    description:
      "College partnerships that expand what students can access — and earn from — on campus.",
    href: "/partnerships",
    status: null,
    statusTone: "",
    accent: "from-rose-500 to-orange-500",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Join with College Email",
    description:
      "Sign up with your college email. We verify your campus and connect you with your student community.",
    icon: <BadgeCheck className="w-5 h-5" />,
  },
  {
    step: "2",
    title: "Explore Your Ecosystem",
    description:
      "Find notes, projects, tutors and campus resources — everything academic in one place.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    step: "3",
    title: "Learn, Share & Earn",
    description:
      "Use what you need. Then share your own notes, mentor juniors, or list your projects.",
    icon: <Zap className="w-5 h-5" />,
  },
];

const STATS = [
  { value: 6, suffix: "", label: "Semesters covered" },
  { value: 4, suffix: "", label: "Branches supported" },
  { value: 4, suffix: "", label: "Resource pillars" },
  { value: 100, suffix: "%", label: "Campus verified" },
];

const MARQUEE_ITEMS = [
  "Engineering Mathematics",
  "Applied Science",
  "Computer Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Mini Projects",
  "Lab Manuals",
  "Peer Tutoring",
  "Question Banks",
  "Drawing Sheets",
  "Viva Prep",
];

const PROMISES = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    title: "Campus Verified",
    description:
      "Every member verifies through their college email. No outsiders, no fake accounts.",
  },
  {
    icon: <Lock className="w-5 h-5 text-blue-300" />,
    title: "Verified Resources",
    description:
      "Only reviewed and approved academic content becomes visible. Nothing is published unchecked.",
  },
  {
    icon: <Handshake className="w-5 h-5 text-purple-300" />,
    title: "Campus-First",
    description:
      "Physical items move through the Vidyasys room on campus. No courier, no risk.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden noise">
        {/* backdrop */}
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-40 -left-24 w-[34rem] h-[34rem] rounded-full bg-royal/20 dark:bg-royal/25 blur-[110px] animate-aurora-a pointer-events-none" />
        <div className="absolute top-24 -right-32 w-[30rem] h-[30rem] rounded-full bg-fuchsia-500/15 dark:bg-violet-500/20 blur-[110px] animate-aurora-b pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[46rem] h-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20">
          {/* floating context cards (desktop) */}
          <div className="hidden lg:block absolute inset-0 max-w-7xl mx-auto pointer-events-none">
            <div className="absolute left-2 top-28 w-56 animate-float">
              <div className="glass rounded-2xl p-3.5 shadow-xl shadow-royal/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <BookOpen className="w-[18px] h-[18px]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-ink">Notes verified</p>
                  <p className="text-[11px] text-ink-muted">Sem 4 · Computer Eng</p>
                </div>
              </div>
            </div>

            <div className="absolute right-2 top-16 w-52 animate-float-slow">
              <div className="glass rounded-2xl p-3.5 shadow-xl shadow-royal/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Users className="w-[18px] h-[18px]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-ink">Peer Tutor sessions</p>
                  <p className="text-[11px] text-ink-muted">Book on campus</p>
                </div>
              </div>
            </div>

            <div className="absolute right-10 bottom-8 w-56 animate-float" style={{ animationDelay: "1.4s" }}>
              <div className="glass rounded-2xl p-3.5 shadow-xl shadow-royal/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/15 text-violet-500 flex items-center justify-center">
                  <Wrench className="w-[18px] h-[18px]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-ink">Project kit reserved</p>
                  <p className="text-[11px] text-ink-muted">Pickup · Vidyasys room</p>
                </div>
              </div>
            </div>

            <div className="absolute left-6 bottom-10 w-48 animate-float-slow" style={{ animationDelay: "0.7s" }}>
              <div className="glass rounded-2xl p-3.5 shadow-xl shadow-royal/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-royal/15 text-royal flex items-center justify-center">
                  <BadgeCheck className="w-[18px] h-[18px]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-ink">College email</p>
                  <p className="text-[11px] text-ink-muted">Verified instantly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-semibold text-ink shadow-sm">
                <Image src="/images/logo.jpeg" alt="" width={20} height={20} className="h-4 w-auto rounded" />
                Launching with Vidyalankar Polytechnic
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-ink">
                Your Polytechnic.
                <br />
                <span className="text-gradient">Your Resources.</span>
                <br />
                Your Ecosystem.
              </h1>
            </Reveal>

            <Reveal delay={170}>
              <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
                Academic notes, project kits, peer tutors and student services —
                woven into one campus-native platform. Built by students, verified
                for students.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-royal hover:bg-royal-strong text-white font-bold text-sm transition shadow-xl shadow-royal/30 btn-shine"
                >
                  Explore Resources
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/notes"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-ink font-bold text-sm hover:border-royal/40 hover:shadow-lg hover:shadow-royal/10 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Notes Coming Soon
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm font-semibold text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" /> College email verified
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Moderated content
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-500" /> Campus pickup only
                </span>
              </div>
            </Reveal>
          </div>

          {/* stats */}
          <div className="relative mt-14 sm:mt-20 max-w-5xl mx-auto">
            <Reveal delay={120} className="glass rounded-3xl px-4 sm:px-8 py-6 shadow-xl shadow-brand-950/5">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-hairline">
                {STATS.map((stat) => (
                  <div key={stat.label} className="px-2 sm:px-4 py-3 text-center">
                    <div className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* marquee band */}
        <div className="relative border-y border-hairline bg-panel-2/70 py-4">
          <Marquee speed={44}>
            {MARQUEE_ITEMS.map((item) => (
              <span key={item} className="mx-4 sm:mx-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-muted whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-royal/70" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ===================== ACADEMIC SELECTOR ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal from="left" className="space-y-5">
            <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
              Personalised Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight leading-tight">
              Find resources for{" "}
              <span className="accent-underline is-visible text-royal">your semester</span>
            </h2>
            <p className="text-ink-muted leading-relaxed">
              Pick your semester and branch once — Vidyasys remembers it and surfaces
              the notes, labs and projects that actually apply to you. Subject-wise
              content unlocks the moment it clears verification.
            </p>
            <ul className="space-y-2.5 text-sm font-semibold text-ink">
              {[
                "Semester + branch filters that stick",
                "Verified uploads only — no junk files",
                "Project kits reserved from your campus",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="tick mt-0.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-royal/15 via-violet-500/10 to-fuchsia-500/10 blur-xl" />
              <AcademicSelector />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================= PLATFORM PILLARS ======================= */}
      <section className="relative overflow-hidden border-y border-hairline bg-panel-2/50">
        <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
              Platform Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              One Connected Student Ecosystem
            </h2>
            <p className="text-ink-muted">
              Not a collection of pages — a single platform built for polytechnic
              students, where every pillar feeds the next.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 90} from="scale">
                <Link
                  href={pillar.href}
                  className="group card-glow glass rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1.5 hover:border-royal/40 hover:shadow-2xl hover:shadow-royal/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.accent} text-white flex items-center justify-center shadow-lg shadow-royal/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-black text-ink-muted tabular-nums">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-ink">{pillar.title}</h3>
                    {pillar.status && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${pillar.statusTone}`}
                      >
                        {pillar.status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-ink-muted leading-relaxed flex-1">
                    {pillar.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-sm font-bold text-royal">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= HOW IT WORKS ========================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            How Vidyasys Works
          </h2>
          <p className="text-ink-muted">Three steps from signup to your first resource.</p>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* connecting line */}
          <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px bg-gradient-to-r from-royal/40 via-violet-400/40 to-fuchsia-400/40" />

          {STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 130} className="relative">
              <div className="group glass rounded-3xl p-8 text-center space-y-4 h-full card-glow hover:-translate-y-1 hover:shadow-xl hover:shadow-royal/10 transition-all duration-300">
                <div className="relative mx-auto w-14 h-14">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-royal to-violet-600 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="relative w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-royal/30">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-canvas border border-hairline text-[11px] font-black text-ink flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ TRUST ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal from="scale">
          <div className="relative rounded-[2rem] p-8 sm:p-14 bg-gradient-to-br from-brand-950 via-[#0d1b45] to-[#1b1150] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 20%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 20%, transparent 75%)",
              }}
            />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/30 rounded-full blur-3xl animate-aurora-a" />
            <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-aurora-b" />

            <div className="relative max-w-4xl mx-auto space-y-10">
              <Reveal className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Built by Students, for Students
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PROMISES.map((item, i) => (
                  <Reveal key={item.title} delay={i * 110}>
                    <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <h4 className="text-lg font-bold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-blue-100/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-blue-100/90">
                  Your polytechnic, your resources, your ecosystem.
                </p>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-brand-950 text-sm font-bold hover:bg-blue-50 transition"
                >
                  Join Vidyasys
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================== FINAL CTA =========================== */}
      <section className="relative overflow-hidden border-t border-hairline">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-24 left-1/3 w-[30rem] h-[30rem] bg-royal/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center space-y-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-royal">
              <Sparkles className="w-4 h-4" /> Ready when you are
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-3xl sm:text-5xl font-black text-ink tracking-tight leading-[1.1]">
              Make campus feel like an{" "}
              <span className="text-gradient">advantage.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg text-ink-muted max-w-xl mx-auto">
              Join your college network today and get early access to notes,
              projects, tutors and everything else happening on campus.
            </p>
          </Reveal>
          <Reveal delay={230}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-royal hover:bg-royal-strong text-white font-bold text-sm transition shadow-xl shadow-royal/30 btn-shine"
              >
                Create free account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-ink font-bold text-sm hover:border-royal/40 transition"
              >
                See how it works
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Handshake,
  ShieldCheck,
  ChevronRight,
  Lock,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { AcademicSelector } from "@/components/academics/AcademicSelector";

export const dynamic = "force-static";

const PILLARS = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Notes",
    description: "Semester-wise academic notes for Vidyalankar Polytechnic — verified before publish.",
    href: "/notes",
    status: "Coming Soon",
    statusTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    icon: <FolderKanban className="w-6 h-6" />,
    title: "Projects & Hardware",
    description: "Academic project kits and hardware resources managed on campus.",
    href: "/projects",
    status: null,
    statusTone: "",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Peer Tutors",
    description: "Book 1-on-1 or group sessions with verified senior students.",
    href: "/tutors",
    status: null,
    statusTone: "",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Partnerships",
    description: "College partnerships that expand what students can access on campus.",
    href: "/partnerships",
    status: null,
    statusTone: "",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Join with College Email",
    description:
      "Sign up with your college email. We verify your campus and connect you with your student community.",
  },
  {
    step: "2",
    title: "Explore Your Ecosystem",
    description:
      "Find notes, projects, tutors, and campus resources — everything academic in one place.",
  },
  {
    step: "3",
    title: "Learn, Share & Earn",
    description:
      "Use what you need. Then share your own notes, mentor juniors, or list your projects.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-royal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-semibold text-ink">
              <Image src="/images/logo.jpeg" alt="" width={20} height={20} className="h-4 w-auto" />
              Launching with Vidyalankar Polytechnic
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-ink">
              Your Polytechnic.{" "}
              <span className="text-royal">Your Resources.</span>{" "}
              Your Ecosystem.
            </h1>

            <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Vidyasys brings academic resources, projects, peer learning and student
              services together in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal hover:bg-royal-strong text-white font-bold text-sm transition shadow-lg shadow-royal/25"
              >
                Explore Resources
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-ink font-bold text-sm hover:border-royal/40 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                Notes Coming Soon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <AcademicSelector />
      </section>

      {/* Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Platform Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            One Connected Student Ecosystem
          </h2>
          <p className="text-ink-muted">
            Not a collection of pages — a single platform built for polytechnic students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group glass rounded-2xl p-6 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/5 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-royal/10 text-royal flex items-center justify-center group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                {pillar.status && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${pillar.statusTone}`}>
                    {pillar.status}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{pillar.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{pillar.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-royal">
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-hairline bg-panel-2/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              How Vidyasys Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((item) => (
              <div key={item.step} className="glass rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-royal text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-royal/25">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-brand-950 via-[#0d1b45] to-[#12265e] text-white overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/20 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Built by Students, for Students
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-bold">Campus Verified</h4>
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed">
                  Every member verifies through their college email. No outsiders,
                  no fake accounts.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-300" />
                  <h4 className="text-lg font-bold">Verified Resources</h4>
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed">
                  Only reviewed and approved academic content becomes visible.
                  Nothing is published unchecked.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Handshake className="w-5 h-5 text-purple-300" />
                  <h4 className="text-lg font-bold">Campus-First</h4>
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed">
                  Physical items are managed through the Vidyasys room on campus.
                  No courier, no risk.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-blue-100/90">
                Your polytechnic, your resources, your ecosystem.
              </p>
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded-xl bg-white text-brand-950 text-sm font-bold hover:bg-blue-50 transition"
              >
                Join Vidyasys
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

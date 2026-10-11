import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-static";

export const metadata = {
  title: "Explore Marketplace",
  description:
    "Browse verified academic notes, projects, hardware kits, and student essentials on Vidyasys.",
};

const CATEGORIES = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Notes",
    body: "Semester-wise, subject-wise study material from toppers.",
    accent: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <FolderKanban className="w-5 h-5" />,
    title: "Projects",
    body: "Ready academic projects with documentation and support.",
    accent: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: <PackageSearch className="w-5 h-5" />,
    title: "Hardware Kits",
    body: "Rent lab equipment, calculators and project kits on campus.",
    accent: "text-emerald-500 bg-emerald-500/10",
  },
];

export default function ExplorePage() {
  return (
    <PublicShell>
      <PageHeader
        title="Explore the Marketplace"
        subtitle="Browse verified listings from students at your college — notes, projects, hardware and more."
        breadcrumb="Explore"
        eyebrow={
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Campus marketplace
          </span>
        }
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {CATEGORIES.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} from="scale">
              <div className="glass rounded-3xl p-6 h-full hover:-translate-y-1 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/10 transition-all duration-300">
                <div className={`w-11 h-11 rounded-2xl grid place-items-center mb-4 ${item.accent}`}>
                  {item.icon}
                </div>
                <h2 className="font-bold text-ink mb-1.5">{item.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} from="scale">
          <div className="relative glass rounded-[2rem] p-8 sm:p-12 text-center space-y-5 overflow-hidden card-glow border border-royal/20">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white grid place-items-center shadow-xl shadow-violet-500/25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="relative space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                Sign in to see your college marketplace
              </h2>
              <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                Every listing is reviewed before it goes live, so what you see is
                exactly what you get.
              </p>
            </div>
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal hover:bg-royal-strong text-white text-sm font-bold transition shadow-lg shadow-royal/25 btn-shine"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}

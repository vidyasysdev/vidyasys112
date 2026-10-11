import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Handshake,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-static";

export const metadata = {
  title: "About",
  description:
    "Learn about Vidyasys — a college-only student ecosystem and marketplace built for students, by students.",
};

const CARDS = [
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: "Our Mission",
    body: "Vidyasys exists to make academic resources accessible, affordable, and trustworthy within college campuses. Every student deserves quality study material and peer support — without overpaying or taking risks on unverified sources.",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "College-Only by Design",
    body: "Your college email domain is verified automatically on signup. That means every buyer, seller, tutor and reviewer is a real student at a real college — no anonymous accounts, no external sellers, no trust issues.",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

const OFFERS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Notes Marketplace",
    body: "Buy or rent verified academic notes from toppers.",
    accent: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Projects & Hardware",
    body: "Purchase academic projects or rent hardware kits.",
    accent: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Peer Tutoring",
    body: "Book 1-on-1 or group sessions with verified seniors.",
    accent: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Student Essentials",
    body: "Buy or rent calculators, lab equipment and more.",
    accent: "text-amber-500 bg-amber-500/10",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHeader
        title="About Vidyasys"
        subtitle="A college-only student ecosystem where learning meets opportunity — built by students, for students."
        breadcrumb="About"
        eyebrow={
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Students First
          </span>
        }
      />

      {/* Story cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 100} from={i ? "right" : "left"}>
              <div className="group glass rounded-3xl p-7 h-full card-glow hover:-translate-y-1 hover:border-royal/40 hover:shadow-xl hover:shadow-royal/10 transition-all duration-300">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} text-white grid place-items-center shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {card.icon}
                </div>
                <h2 className="text-xl font-black text-ink mb-2">{card.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What we offer */}
      <section className="border-y border-hairline bg-panel-2/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-10">
          <Reveal className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
              Everything campus, one platform
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OFFERS.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} from="scale">
                <div className="glass rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/10 transition-all duration-300">
                  <div
                    className={`w-11 h-11 rounded-2xl grid place-items-center mb-4 ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-ink mb-1.5">{item.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
        <Reveal className="grid sm:grid-cols-3 gap-5">
          {[
            { label: "Verified campuses", note: "College email required" },
            { label: "Reviewed content", note: "Nothing unchecked" },
            { label: "Campus handover", note: "No courier, no risk" },
          ].map((value) => (
            <div
              key={value.label}
              className="rounded-2xl border border-hairline bg-panel p-5 text-center hover:border-royal/40 transition"
            >
              <div className="font-black text-ink">{value.label}</div>
              <div className="text-xs text-ink-muted mt-1">{value.note}</div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={120} className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Come build your ecosystem with us
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal hover:bg-royal-strong text-white text-sm font-bold transition shadow-lg shadow-royal/25 btn-shine"
            >
              Join Vidyasys
              <Handshake className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-hairline text-ink text-sm font-bold hover:border-royal/40 transition"
            >
              See how it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}

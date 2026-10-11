import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck, Star, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-static";

export const metadata = {
  title: "Find Peer Tutors",
  description:
    "Book verified peer tutors at your college for 1-on-1 or group tutoring sessions on Vidyasys.",
};

const PERKS = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verified seniors",
    body: "Every tutor is a checked student from your own campus.",
    accent: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: <CalendarCheck className="w-5 h-5" />,
    title: "Flexible sessions",
    body: "Book one-on-one help or join a small group batch.",
    accent: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Reviewed results",
    body: "Ratings from real sessions keep quality honest.",
    accent: "text-amber-500 bg-amber-500/10",
  },
];

export default function TutorsPage() {
  return (
    <PublicShell>
      <PageHeader
        title="Peer Tutoring"
        subtitle="Connect with verified senior students who excelled in your subjects — and book a session in minutes."
        breadcrumb="Tutors"
        eyebrow={
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Learn from seniors
          </span>
        }
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {PERKS.map((perk, i) => (
            <Reveal key={perk.title} delay={i * 90} from="scale">
              <div className="glass rounded-3xl p-6 h-full hover:-translate-y-1 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/10 transition-all duration-300">
                <div className={`w-11 h-11 rounded-2xl grid place-items-center mb-4 ${perk.accent}`}>
                  {perk.icon}
                </div>
                <h2 className="font-bold text-ink mb-1.5">{perk.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{perk.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} from="scale">
          <div className="relative glass rounded-[2rem] p-8 sm:p-12 text-center space-y-5 overflow-hidden card-glow border border-royal/20">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-royal/10 rounded-full blur-3xl" />
            <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-royal to-violet-600 text-white grid place-items-center shadow-xl shadow-royal/25">
              <Users className="w-8 h-8" />
            </div>
            <div className="relative space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                Tutors are matching now
              </h2>
              <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                Sign in to discover tutors at your college, compare ratings and book
                your first session.
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

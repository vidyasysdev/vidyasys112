import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Package, CreditCard, CheckCircle } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

export const dynamic = "force-static";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how Vidyasys works — join with your college email, browse verified listings, and transact safely on campus.",
};

const STEPS = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    step: "1",
    title: "Sign Up with Your College Email",
    description:
      "Create your account using your college email address. We automatically detect your college and verify your student status. No manual approval needed for existing college domains.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Search className="w-6 h-6" />,
    step: "2",
    title: "Browse Verified Listings",
    description:
      "Explore notes, projects, hardware kits, and tutors — all from your own campus. Every listing is reviewed by our team before going live.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    step: "3",
    title: "Pay Securely",
    description:
      "Complete your purchase or rental through our secure payment system. Digital content is unlocked instantly. Physical items are reserved for campus pickup.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: <Package className="w-6 h-6" />,
    step: "4",
    title: "Pick Up on Campus",
    description:
      "For physical items, visit the Vidyasys room on campus to collect your order. Our team verifies and hands over the item.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    step: "5",
    title: "Confirm & Review",
    description:
      "After using the product or completing a tutoring session, confirm the transaction and leave a review to help other students.",
    color: "from-rose-500 to-pink-500",
  },
];

const FAQ = [
  {
    question: "Who can join Vidyasys?",
    answer:
      "Only verified college students. Sign up with your college email domain and your student status is confirmed automatically — that keeps every buyer, seller, tutor and reviewer a real student from a real campus.",
  },
  {
    question: "Is my content checked before it goes live?",
    answer:
      "Yes. Every note, project listing and tutor profile is reviewed by the campus team before it becomes visible. Nothing unverified is published to the platform.",
  },
  {
    question: "How do I get physical items like project kits?",
    answer:
      "Physical items are reserved in the app and handed over at the Vidyasys room on campus. There is no courier and no risk of damage or loss in transit.",
  },
  {
    question: "Do I need to pay to browse?",
    answer:
      "No. Browsing notes, projects, tutors and campus resources is free. You only pay when you choose to rent, buy or book something.",
  },
  {
    question: "Can I earn on Vidyasys?",
    answer:
      "Absolutely. Share your own verified notes, mentor juniors as a peer tutor, or list your academic projects — the platform is built so students can learn and earn at the same time.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <PageHeader
        title="How Vidyasys Works"
        subtitle="A simple, trustworthy process designed for college students — from signup to pickup, in five clear steps."
        breadcrumb="How It Works"
        eyebrow={
          <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            Simple Process
          </span>
        }
      />

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="relative space-y-8 sm:space-y-10">
          <div className="hidden sm:block absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-royal/50 via-violet-400/40 to-fuchsia-400/40" />

          {STEPS.map((item, index) => (
            <Reveal key={item.step} delay={index * 70} from={index % 2 ? "right" : "left"}>
              <div className="group relative flex gap-5 sm:gap-6 items-start">
                <div
                  className={`relative w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${item.color} text-white grid place-items-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                >
                  {item.icon}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-canvas border border-hairline text-[10px] font-black text-ink grid place-items-center">
                    {item.step}
                  </span>
                </div>

                <div className="glass rounded-2xl p-5 sm:p-6 flex-1 card-glow hover:border-royal/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-royal/10 transition-all duration-300">
                  <span className="text-[11px] font-black text-royal uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-ink mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-hairline bg-panel-2/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
          <Reveal className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
              Questions students actually ask
            </h2>
            <p className="text-ink-muted text-sm">
              Can&apos;t find what you need?{" "}
              <Link href="/contact" className="text-royal font-semibold hover:underline">
                Talk to the campus team
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={90}>
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <Reveal from="scale" className="glass rounded-[2rem] p-8 sm:p-12 space-y-5 card-glow">
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Ready to join your campus network?
          </h2>
          <p className="text-ink-muted text-sm max-w-lg mx-auto">
            Create an account with your college email and get early access to notes,
            projects, tutors and everything else on campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal hover:bg-royal-strong text-white text-sm font-bold transition shadow-lg shadow-royal/25 btn-shine"
            >
              Create free account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-hairline text-ink text-sm font-bold hover:border-royal/40 transition"
            >
              Ask a question
            </Link>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}

import { ShieldCheck, MailCheck, Eye, Lock, Flag, BadgeCheck } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Trust & Safety",
  description:
    "How Vidyasys keeps its campus ecosystem verified, fair, and safe for every student.",
};

const PILLARS = [
  {
    icon: <MailCheck className="w-5 h-5" />,
    title: "College Email Verification",
    description:
      "Every account verifies through an approved college email domain. One person, one verified student identity — no outsiders.",
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: "Reviewed Content",
    description:
      "Notes, projects, and listings are checked by admin moderators before they become visible. Nothing is published unchecked.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Transparent Records",
    description:
      "Orders, bookings, and payouts are recorded on-platform. Disputes and reports are reviewed with full history.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Secure Access",
    description:
      "Published resources open only through the secure reader with your verified session. Content is watermark-tracked.",
  },
  {
    icon: <Flag className="w-5 h-5" />,
    title: "Report & Moderation",
    description:
      "Students can report listings, users, or content. Admins investigate and act — removals are logged.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Campus-First Handling",
    description:
      "Physical items move through the Vidyasys room on campus. No couriers, no strangers, no shipping risk.",
  },
];

export default function TrustSafetyPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Trust & Safety
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            A Verified Campus Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Trust is the product. Here is how Vidyasys keeps every student,
            resource, and transaction accountable.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="glass rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="text-sm font-bold text-ink">{pillar.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-3xl p-8 text-center space-y-3">
          <h2 className="text-lg font-black text-ink">See a problem?</h2>
          <p className="text-sm text-ink-muted max-w-md mx-auto">
            Report anything suspicious from any listing or profile, or contact us
            directly. Every report is reviewed.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal hover:bg-royal-strong text-white text-sm font-bold transition"
          >
            Contact the Team
          </a>
        </div>
      </section>
    </PublicShell>
  );
}

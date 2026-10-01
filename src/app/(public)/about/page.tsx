import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "About",
  description:
    "Learn about Vidyasys — a college-only student ecosystem and marketplace built for students, by students.",
};

export default function AboutPage() {
  return (
    <PublicShell>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              About Vidyasys
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto">
              A college-only student ecosystem where learning meets opportunity.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <div className="glass rounded-2xl border border-hairline p-8 space-y-4">
              <h2 className="text-2xl font-bold text-ink">Our Mission</h2>
              <p className="text-ink-muted leading-relaxed">
                Vidyasys exists to make academic resources accessible, affordable, and trustworthy
                within college campuses. We believe every student deserves access to quality study
                materials and peer support — without overpaying or taking risks on unverified sources.
              </p>
            </div>

            <div className="glass rounded-2xl border border-hairline p-8 space-y-4">
              <h2 className="text-2xl font-bold text-ink">College-Only by Design</h2>
              <p className="text-ink-muted leading-relaxed">
                Vidyasys is strictly for verified college students. When you sign up, your college
                email domain is verified automatically. This means every buyer, seller, tutor, and
                reviewer on the platform is a real student at a real college. No anonymous accounts,
                no external sellers, no trust issues.
              </p>
            </div>

            <div className="glass rounded-2xl border border-hairline p-8 space-y-4">
              <h2 className="text-2xl font-bold text-ink">What We Offer</h2>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Notes Marketplace</strong> — Buy or rent verified academic notes from toppers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Projects &amp; Hardware</strong> — Purchase academic projects or rent hardware kits.</span>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Peer Tutoring</strong> — Book 1-on-1 or group sessions with verified senior students.</span>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Student Essentials</strong> — Buy or rent calculators, lab equipment, and more.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </PublicShell>
  );
}

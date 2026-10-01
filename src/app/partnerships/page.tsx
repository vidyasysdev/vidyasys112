import { Handshake, Lock, Building2, GraduationCap, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Partnerships",
  description:
    "Vidyasys college partnerships — expanding what students can access on campus.",
};

export default function PartnershipsPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            <Handshake className="w-3 h-3" />
            Growing Together
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            College Partnerships
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Vidyasys partners with institutions to bring verified academic resources,
            peer learning, and campus services to students.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Building2 className="w-5 h-5" />, title: "Institutions", desc: "Partner colleges get a verified, closed campus ecosystem." },
            { icon: <GraduationCap className="w-5 h-5" />, title: "Academics", desc: "Shared focus on authentic, reviewed academic material." },
            { icon: <Users className="w-5 h-5" />, title: "Students", desc: "Every partner-campus student joins a trusted community." },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-royal/10 text-royal flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-dashed border-hairline">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink">
            🔒 Partnership Program Coming Soon
          </h2>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            We are onboarding our launch institution first. Details for additional
            college partnerships will be published here.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal hover:bg-royal-strong text-white text-sm font-bold transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </PublicShell>
  );
}

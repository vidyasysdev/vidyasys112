import { PublicShell } from "@/components/layout/PublicShell";
import { Mail, MapPin } from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the Vidyasys team for support, partnerships, or inquiries.",
};

export default function ContactPage() {
  return (
    <PublicShell>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Contact Us
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto">
              Have questions? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl border border-hairline p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Email</h3>
                  <p className="text-sm text-ink-muted">help@vidyasys.com</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl border border-hairline p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Campus</h3>
                  <p className="text-sm text-ink-muted">Vidyalankar Educational Campus, Wadala, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PublicShell>
  );
}

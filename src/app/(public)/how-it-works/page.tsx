import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { Search, ShieldCheck, Package, CreditCard, CheckCircle } from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "How It Works",
  description: "Learn how Vidyasys works — join with your college email, browse verified listings, and transact safely on campus.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-brand-950 tracking-tight">
              How Vidyasys Works
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A simple, trustworthy process designed for college students.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                step: "1",
                title: "Sign Up with Your College Email",
                description: "Create your account using your college email address. We automatically detect your college and verify your student status. No manual approval needed for existing college domains.",
                color: "bg-brand-50 text-brand-600",
              },
              {
                icon: <Search className="w-6 h-6" />,
                step: "2",
                title: "Browse Verified Listings",
                description: "Explore notes, projects, hardware kits, and tutors — all from your own campus. Every listing is reviewed by our team before going live.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                step: "3",
                title: "Pay Securely",
                description: "Complete your purchase or rental through our secure payment system. Digital content is unlocked instantly. Physical items are reserved for campus pickup.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: <Package className="w-6 h-6" />,
                step: "4",
                title: "Pick Up on Campus",
                description: "For physical items, visit the Vidyasys room on campus to collect your order. Our team verifies and hands over the item.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                step: "5",
                title: "Confirm & Review",
                description: "After using the product or completing a tutoring session, confirm the transaction and leave a review to help other students.",
                color: "bg-blue-50 text-blue-600",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Cpu, Users, Star, ShieldCheck, ChevronRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white border-b border-blue-100/80">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-200/90 shadow-sm">
                <Image src="/images/logo.png" alt="" width={20} height={20} className="h-4 w-auto" />
                <span className="text-sm font-semibold text-brand-900">
                  College-Only Student Ecosystem
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-950 tracking-tight leading-[1.1]">
                Learn, Share, Build{" "}
                <span className="text-brand-600">&amp; Grow</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Buy/rent academic notes, purchase project kits, book peer tutors,
                and access campus resources — all verified within your college.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-sm"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Platform Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-950 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-600">
              One platform built specifically for college students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Notes Marketplace",
                description: "Rent or buy handwritten notes from toppers at your college.",
                color: "bg-blue-50 text-blue-600",
                href: "/explore",
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "Projects & Hardware",
                description: "Buy academic projects or rent hardware kits for your next submission.",
                color: "bg-emerald-50 text-emerald-600",
                href: "/explore",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Peer Tutoring",
                description: "Book 1-on-1 or group sessions with verified senior students.",
                color: "bg-purple-50 text-purple-600",
                href: "/tutors",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Campus Verified",
                description: "Every student, seller, and tutor is verified through your college.",
                color: "bg-amber-50 text-amber-600",
                href: "/about",
              },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-brand-200 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-bold text-brand-600">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-950 tracking-tight">
                How Vidyasys Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Join with College Email",
                  description:
                    "Sign up with your college email. We auto-verify your campus and connect you with your student community.",
                },
                {
                  step: "2",
                  title: "Browse & Transact",
                  description:
                    "Find notes, projects, tutors, or essentials. Buy, rent, or book sessions — all within your campus.",
                },
                {
                  step: "3",
                  title: "Learn & Earn",
                  description:
                    "Use what you need. Then sell your own notes, become a tutor, or list your projects to earn back.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-black text-lg flex items-center justify-center mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="bg-brand-950 rounded-3xl p-10 sm:p-14 text-white">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Built by Students, for Students
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <h4 className="text-lg font-bold">Verified Community</h4>
                  </div>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    Every member is a verified student at an approved college.
                    No outsiders, no fake accounts.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-blue-300" />
                    <h4 className="text-lg font-bold">Secure Payments</h4>
                  </div>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    All transactions are recorded and protected. Commission-based
                    model keeps the platform sustainable.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-300" />
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
                  Join thousands of students already learning and earning on Vidyasys.
                </p>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

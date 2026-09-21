import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-static";

export const metadata = {
  title: "Explore Marketplace",
  description: "Browse verified academic notes, projects, hardware kits, and student essentials on Vidyasys.",
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-brand-950 tracking-tight">
              Explore the Marketplace
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse verified listings from students at your college.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-sm">
              Sign in to browse the full marketplace with listings from your college.
            </p>
            <a
              href="/signup"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

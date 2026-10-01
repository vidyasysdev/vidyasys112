import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Explore Marketplace",
  description: "Browse verified academic notes, projects, hardware kits, and student essentials on Vidyasys.",
};

export default function ExplorePage() {
  return (
    <PublicShell>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Explore the Marketplace
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto">
              Browse verified listings from students at your college.
            </p>
          </div>

          <div className="glass rounded-2xl border border-hairline p-12 text-center">
            <p className="text-ink-muted text-sm">
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
      </PublicShell>
  );
}

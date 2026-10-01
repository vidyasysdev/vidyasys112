import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Find Peer Tutors",
  description: "Book verified peer tutors at your college for 1-on-1 or group tutoring sessions on Vidyasys.",
};

export default function TutorsPage() {
  return (
    <PublicShell>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Peer Tutoring
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto">
              Connect with verified senior students who excelled in your subjects.
            </p>
          </div>

          <div className="glass rounded-2xl border border-hairline p-12 text-center">
            <p className="text-ink-muted text-sm">
              Sign in to discover tutors at your college and book sessions.
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

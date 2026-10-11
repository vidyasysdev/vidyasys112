import { FolderKanban, Lock, Cpu, Wrench, Boxes } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Projects & Hardware",
  description:
    "Academic project kits and hardware resources for polytechnic students — managed on campus through Vidyasys.",
};

export default function ProjectsPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            <FolderKanban className="w-3 h-3" />
            Campus Resources
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            Projects & Hardware
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Academic project kits and hardware resources — explored, reserved, and
            collected on campus through the Vidyasys room.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <FolderKanban className="w-5 h-5" />, title: "Academic Projects", desc: "Ready-to-submit project kits for diploma submissions." },
            { icon: <Cpu className="w-5 h-5" />, title: "Hardware Kits", desc: "Rent development boards, sensors, and lab equipment." },
            { icon: <Wrench className="w-5 h-5" />, title: "Components", desc: "Electronic components and consumables for your builds." },
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
            🔒 Listings Coming Soon
          </h2>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            The project and hardware catalog opens after launch with verified
            listings only. No fake inventory — real resources, reviewed before publish.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-panel-2 border border-hairline text-xs font-bold text-ink">
            <Boxes className="w-3.5 h-3.5 text-royal" />
            Browse the marketplace in the meantime
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

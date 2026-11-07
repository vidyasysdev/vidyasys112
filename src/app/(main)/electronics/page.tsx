import { Activity, Cpu, GitBranch, Zap } from "lucide-react";

export const metadata = {
  title: "Electronics Lab",
  description:
    "Vidyasys Electronics Lab — design, connect, code, simulate and build electronic circuits in the browser.",
};

/**
 * Electronics Lab landing page.
 *
 * Phase 1 (core simulation environment) is under active construction. This
 * page deliberately ships WITHOUT any buttons or features that do not work
 * yet — the spec forbids fake/placeholder functionality. Every item below is
 * either live today or explicitly marked with its phase.
 */

const BUILD_NOW = [
  "Component library with board-accurate pinouts (Arduino Uno R3, ESP32 DevKit V1, ESP32-C3 Super Mini)",
  "Drag-and-drop schematic workspace with wiring, rotate, zoom, undo/redo and autosave",
  "Real circuit solver (Modified Nodal Analysis with iterative LED/diode models)",
  "Arduino Uno GPIO simulation driven by a real C interpreter (setup/loop, digitalWrite, Serial)",
  "Live diagnostics: overcurrent, GPIO conflicts, floating inputs, missing ground",
];

const ROADMAP = [
  { phase: "Phase 2", item: "ESP32 runtimes, sensor models, UART/I2C/SPI, serial plotter" },
  { phase: "Phase 3", item: "Motors, drivers, OLED/LCD displays, relays, power monitoring" },
  { phase: "Phase 4", item: "Transient analog solver, oscilloscope, logic analyzer, MicroPython" },
  { phase: "Phase 5", item: "Cloud projects, sharing, templates gallery, admin component manager" },
];

export default function ElectronicsLandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070b16] -m-4 sm:-m-6 lg:-m-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-12">
        {/* Hero */}
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1c2740] bg-[#0e1526] text-[#38bdf8] text-xs font-bold tracking-wide uppercase">
            <Cpu className="w-3.5 h-3.5" />
            Vidyasys Electronics Lab
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#e2e8f0] tracking-tight leading-[1.1]">
            Design. Connect. Code.{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Simulate. Build.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#8494b4] max-w-2xl leading-relaxed">
            A browser-based electronics and embedded systems laboratory for
            students and makers — real circuit simulation, real component
            pinouts and real program execution. Not a drawing tool.
          </p>
        </div>

        {/* Honest status */}
        <div className="rounded-2xl border border-[#1c2740] bg-[#0e1526] overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-[#1c2740] bg-[#0a1020]">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-[#e2e8f0]">
              Build status — Phase 1 under active development
            </h2>
            <span className="ml-auto text-[11px] font-mono text-[#8494b4]">
              feature/electronics-lab
            </span>
          </div>
          <div className="p-5 sm:p-6 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                Landing with this phase
              </p>
              <ul className="space-y-2">
                {BUILD_NOW.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#c7d2e5]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8494b4] mb-3">
                Planned next (not yet available)
              </p>
              <ul className="space-y-2">
                {ROADMAP.map((entry) => (
                  <li key={entry.phase} className="flex items-start gap-2.5 text-sm text-[#8494b4]">
                    <GitBranch className="w-4 h-4 mt-0.5 shrink-0 text-[#3b4b6b]" />
                    <span>
                      <span className="font-semibold text-[#a9b8d4]">{entry.phase}</span> —{" "}
                      {entry.item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="flex items-center gap-2 text-xs text-[#5b6b8c]">
          <Zap className="w-3.5 h-3.5" />
          The workspace, simulator and code editor open here as soon as Phase 1
          lands — this page will be replaced by the real project dashboard, not
          a mock-up.
        </p>
      </div>
    </div>
  );
}

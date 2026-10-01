"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  BookOpen,
  Cpu,
  Zap,
  MonitorSmartphone,
  ChevronDown,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { NoteCard } from "@/components/notes/NoteCard";
import { NotePreviewModal } from "@/components/notes/NotePreviewModal";
import type { NoteCardData } from "@/components/notes/NoteCard";
import {
  LAUNCH_COLLEGE,
  SEMESTERS,
  VP_BRANCHES,
  RESOURCE_TYPES,
  type BranchCode,
} from "@/lib/academics";

const BRANCH_ICONS: Record<BranchCode, React.ReactNode> = {
  CO: <MonitorSmartphone className="w-5 h-5" />,
  IF: <Cpu className="w-5 h-5" />,
  TE: <Zap className="w-5 h-5" />,
};

function NotesContent() {
  const params = useSearchParams();
  const initialSem = Number(params.get("semester"));
  const initialBranch = params.get("branch") as BranchCode | null;

  const [semester, setSemester] = useState<number | null>(
    SEMESTERS.includes(initialSem as 1) ? initialSem : null
  );
  const [branch, setBranch] = useState<BranchCode | null>(
    initialBranch && VP_BRANCHES.some((b) => b.code === initialBranch)
      ? initialBranch
      : null
  );
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState<NoteCardData | null>(null);

  return (
    <PublicShell>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            Coming Soon
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            {LAUNCH_COLLEGE} Notes
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Semester-wise and subject-wise academic resources for {LAUNCH_COLLEGE}{" "}
            students.
          </p>
        </div>
      </section>

      {/* Coming Soon Hero Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-royal/20 shadow-xl shadow-royal/5 relative overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-royal/10 rounded-full blur-3xl" />
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-royal/10 text-royal flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="relative space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              📚 Notes Are Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
              We are preparing and verifying academic resources for{" "}
              {LAUNCH_COLLEGE} students.
            </p>
          </div>
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-panel-2 border border-hairline text-sm font-bold text-ink">
            <Lock className="w-4 h-4 text-amber-500" />
            🔒 Content Under Preparation
          </div>
          <p className="relative text-xs font-semibold text-royal uppercase tracking-wider">
            Coming Soon — Stay Tuned!
          </p>
        </div>
      </section>

      {/* Available Branches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-ink">
            Branches at Launch
          </h2>
          <p className="text-sm text-ink-muted">
            Notes will be available for these {LAUNCH_COLLEGE} branches only.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VP_BRANCHES.map((b) => (
            <div
              key={b.code}
              className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-royal/40 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-royal/10 text-royal flex items-center justify-center shrink-0">
                {BRANCH_ICONS[b.code]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-ink">{b.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-royal/10 text-royal text-[10px] font-black">
                    {b.code}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">Coming Soon 🔒</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semester Structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-ink">
            Semester Structure
          </h2>
          <p className="text-sm text-ink-muted">
            Each semester unlocks as verified content is published.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SEMESTERS.map((sem) => (
            <div
              key={sem}
              className="glass rounded-2xl p-4 text-center space-y-2 border border-dashed border-hairline"
            >
              <div className="text-sm font-black text-ink">Semester {sem}</div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <Lock className="w-3 h-3" />
                Coming Soon 🔒
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter System */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        <div className="glass rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-ink">Find a Resource</h2>
            <p className="text-xs text-ink-muted">
              Filters are ready — results appear once content launches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* College — fixed */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                College
              </label>
              <div className="px-3 py-2.5 rounded-xl bg-panel-2 border border-hairline text-sm font-semibold text-ink flex items-center justify-between">
                {LAUNCH_COLLEGE}
                <Lock className="w-3.5 h-3.5 text-ink-muted" />
              </div>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Semester
              </label>
              <div className="relative">
                <select
                  value={semester ?? ""}
                  onChange={(e) =>
                    setSemester(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full appearance-none px-3 py-2.5 rounded-xl bg-panel border border-hairline text-sm font-semibold text-ink outline-none focus:border-royal/50 transition"
                >
                  <option value="">All Semesters</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Branch
              </label>
              <div className="relative">
                <select
                  value={branch ?? ""}
                  onChange={(e) =>
                    setBranch((e.target.value || null) as BranchCode | null)
                  }
                  className="w-full appearance-none px-3 py-2.5 rounded-xl bg-panel border border-hairline text-sm font-semibold text-ink outline-none focus:border-royal/50 transition"
                >
                  <option value="">All Branches</option>
                  {VP_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={semester && branch ? "Search subjects..." : "Select sem + branch"}
                disabled={!semester || !branch}
                className="w-full px-3 py-2.5 rounded-xl bg-panel border border-hairline text-sm font-semibold text-ink placeholder:text-ink-muted/70 outline-none focus:border-royal/50 transition disabled:opacity-60"
              />
            </div>
          </div>

          {/* Resource type chips */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Resource Type
            </div>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_TYPES.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1.5 rounded-lg bg-panel-2 border border-hairline text-xs font-semibold text-ink-muted"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Results — honest empty state */}
          <div className="pt-4 border-t border-hairline">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <NoteCard key={i} />
              ))}
            </div>
            <p className="mt-5 text-center text-sm text-ink-muted">
              No resources available yet. Only verified content will be listed here.
            </p>
          </div>
        </div>
      </section>

      <NotePreviewModal note={preview} onClose={() => setPreview(null)} />
    </PublicShell>
  );
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesContent />
    </Suspense>
  );
}

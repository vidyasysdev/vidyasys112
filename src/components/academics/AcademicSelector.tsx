"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { SEMESTERS, VP_BRANCHES, type BranchCode } from "@/lib/academics";

export function AcademicSelector() {
  const [semester, setSemester] = useState<number | null>(null);
  const [branch, setBranch] = useState<BranchCode | null>(null);
  const router = useRouter();

  const explore = () => {
    const params = new URLSearchParams();
    if (semester) params.set("semester", String(semester));
    if (branch) params.set("branch", branch);
    router.push(`/notes${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto text-left space-y-6 shadow-lg shadow-brand-950/5">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-ink">Find resources for your semester</h3>
        <p className="text-sm text-ink-muted">
          Select your semester and branch — subject-wise content unlocks as it is verified.
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Semester</div>
        <div className="flex flex-wrap gap-2">
          {SEMESTERS.map((sem) => (
            <button
              key={sem}
              onClick={() => setSemester(sem === semester ? null : sem)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                semester === sem
                  ? "bg-royal text-white border-royal shadow-md shadow-royal/25"
                  : "border-hairline text-ink-muted hover:text-ink hover:border-royal/40"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Branch</div>
        <div className="flex flex-wrap gap-2">
          {VP_BRANCHES.map((b) => (
            <button
              key={b.code}
              onClick={() => setBranch(branch === b.code ? null : b.code)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                branch === b.code
                  ? "bg-royal text-white border-royal shadow-md shadow-royal/25"
                  : "border-hairline text-ink-muted hover:text-ink hover:border-royal/40"
              }`}
            >
              {b.code}
              <span className="ml-2 font-medium opacity-70">{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={explore}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal hover:bg-royal-strong text-white font-bold text-sm transition shadow-lg shadow-royal/25"
      >
        <BookOpen className="w-4 h-4" />
        Explore Notes
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

"use client";

import { Lock, BookOpen, BadgeCheck } from "lucide-react";

export type NoteCardData = {
  subject: string;
  semester: number;
  branch: string;
  college: string;
  resourceType: string;
  verification: "unverified" | "reviewing" | "verified";
  availability: "coming_soon" | "available";
  accessPeriod?: string;
};

export function NoteCard({
  note,
  onOpen,
}: {
  note?: Partial<NoteCardData>;
  onOpen?: () => void;
}) {
  const comingSoon = !note || note.availability !== "available";

  if (comingSoon) {
    return (
      <div className="glass rounded-2xl p-6 border border-dashed border-hairline flex flex-col items-center justify-center text-center gap-3 min-h-[180px]">
        <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-ink">🔒 Coming Soon</p>
          <p className="text-xs text-ink-muted">
            {note?.subject ?? "Subject resources"} — content under preparation
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="glass rounded-2xl p-6 text-left hover:border-royal/40 hover:shadow-lg hover:shadow-royal/5 transition-all w-full"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-royal/10 text-royal flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        {note.verification === "verified" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </span>
        )}
      </div>
      <h3 className="text-sm font-bold text-ink mb-1">{note.subject}</h3>
      <p className="text-xs text-ink-muted">
        Sem {note.semester} · {note.branch} · {note.college}
      </p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted">
        <span className="px-2 py-0.5 rounded-md bg-panel-2 font-semibold">
          {note.resourceType}
        </span>
        {note.accessPeriod && (
          <span className="px-2 py-0.5 rounded-md bg-panel-2 font-semibold">
            {note.accessPeriod}
          </span>
        )}
      </div>
    </button>
  );
}

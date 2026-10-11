"use client";

import { X, Lock, BookOpen, ShieldCheck } from "lucide-react";
import type { NoteCardData } from "./NoteCard";

export function NotePreviewModal({
  note,
  onClose,
}: {
  note: NoteCardData | null;
  onClose: () => void;
}) {
  if (!note) return null;

  const unavailable = note.availability !== "available";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl glass rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal/10 text-royal flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">{note.subject}</h3>
              <p className="text-xs text-ink-muted">
                Sem {note.semester} · {note.branch} · {note.college}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 rounded-lg text-ink-muted hover:bg-panel-2 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {unavailable ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-ink">🔒 Content Under Preparation</p>
            <p className="text-xs text-ink-muted max-w-sm mx-auto leading-relaxed">
              This resource has not been published yet. The secure reader, table of
              contents, and page navigation open only for verified, published content.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="px-2 py-0.5 rounded-md bg-panel-2 font-semibold">
                {note.resourceType}
              </span>
              {note.accessPeriod && (
                <span className="px-2 py-0.5 rounded-md bg-panel-2 font-semibold">
                  Access: {note.accessPeriod}
                </span>
              )}
              {note.verification === "verified" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            {/* Secure reader mounts here when real content launches */}
            <div className="rounded-xl border border-dashed border-hairline p-8 text-center text-sm text-ink-muted">
              Secure in-browser reader — opens published content only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

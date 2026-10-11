"use client";

import { useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import { submitListingReport } from "@/app/admin/actions";

const REASONS = [
  "Prohibited item",
  "Misleading listing",
  "Scam or fraud",
  "Inappropriate content",
  "Other",
];

export function ReportButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const res = await submitListingReport({ listingId, reason, description });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      setOpen(false);
      setDescription("");
    } else {
      setError(res.error || "Failed to submit report.");
    }
  };

  if (done) {
    return (
      <p className="text-xs text-ink-muted flex items-center gap-1.5">
        <Flag className="w-3.5 h-3.5" />
        Report submitted — our moderation team will review it.
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 rounded-xl border border-hairline bg-panel-2 hover:bg-panel text-ink-muted hover:text-red-600 font-bold text-xs transition inline-flex items-center justify-center gap-1.5"
      >
        <Flag className="w-3.5 h-3.5" />
        Report this listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-panel rounded-2xl border border-hairline p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">Report listing</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-ink-muted hover:bg-panel-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-panel-2 border border-hairline text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted">Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What's wrong with this listing?"
                className="w-full px-3 py-2 rounded-lg bg-panel-2 border border-hairline text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting || !description.trim()}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold transition inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}

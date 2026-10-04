"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  UserCheck,
  XCircle,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { assignReport, setReportStatus, addReportNote } from "@/app/admin/actions";

interface ReportRow {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  listing_id: string | null;
  reason: string;
  description: string;
  status: "pending" | "in_review" | "resolved" | "rejected";
  assigned_to: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ProfileLite {
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface ReportNote {
  id: string;
  author_label: string | null;
  note: string;
  created_at: string;
}

const STATUS_META: Record<ReportRow["status"], { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700" },
  in_review: { label: "In Review", cls: "bg-blue-50 text-blue-700" },
  resolved: { label: "Resolved", cls: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", cls: "bg-panel-2 text-ink-muted" },
};

const STATUS_ACTIONS: { status: ReportRow["status"]; label: string; icon: typeof CheckCircle2 }[] = [
  { status: "pending", label: "Mark Pending", icon: AlertTriangle },
  { status: "in_review", label: "Start Review", icon: Search },
  { status: "resolved", label: "Resolve", icon: CheckCircle2 },
  { status: "rejected", label: "Reject", icon: XCircle },
];

export function ReportManager() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterReason, setFilterReason] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<ReportNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionOk, setActionOk] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const [reportsRes, profilesRes] = await Promise.all([
        supabase.from("user_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, full_name, email, role"),
      ]);

      if (reportsRes.error) throw new Error(reportsRes.error.message);
      setReports((reportsRes.data as ReportRow[]) || []);
      setProfiles((profilesRes.data as ProfileLite[]) || []);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openReport = async (id: string) => {
    setSelectedId(id);
    setNotes([]);
    setNoteText("");
    setActionError(null);
    setActionOk(null);
    setNotesLoading(true);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("report_notes")
      .select("*")
      .eq("report_id", id)
      .order("created_at", { ascending: true });
    setNotes((data as ReportNote[]) || []);
    setNotesLoading(false);
  };

  const profileLabel = (userId: string | null) => {
    if (!userId) return null;
    const p = profiles.find((x) => x.user_id === userId);
    return p ? p.full_name || p.email : userId.slice(0, 8);
  };

  const runAction = (fn: () => Promise<{ ok: boolean; error?: string }>, successMsg?: string) => {
    setActionError(null);
    setActionOk(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setActionError(res.error || "Action failed.");
      else {
        setActionOk(successMsg || "Updated.");
        await load();
        if (selectedId) await openReport(selectedId);
      }
    });
  };

  const moderators = profiles.filter((p) => p.role === "moderator" || p.role === "admin");

  const reasons = [...new Set(reports.map((r) => r.reason))];
  const filtered = reports.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterReason && r.reason !== filterReason) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = `${r.reason} ${r.description} ${r.listing_id || ""} ${r.reporter_id}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const selected = reports.find((r) => r.id === selectedId) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-royal" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  if (selected) {
    const meta = STATUS_META[selected.status];
    return (
      <div className="space-y-4 max-w-3xl">
        <button
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to reports
        </button>

        <div className="bg-panel rounded-xl border border-hairline p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-ink capitalize">
                {selected.reason.replace(/_/g, " ")}
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Filed {formatDateTime(selected.created_at)}
                {selected.updated_at && ` · Last updated ${formatDateTime(selected.updated_at)}`}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${meta.cls}`}>
              {meta.label}
            </span>
          </div>

          <p className="text-sm text-ink whitespace-pre-wrap">{selected.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-panel-2 border border-hairline">
              <div className="font-bold text-ink-muted uppercase tracking-wider mb-1">Reporter</div>
              <div className="text-ink">{profileLabel(selected.reporter_id) || "Unknown"}</div>
            </div>
            <div className="p-3 rounded-lg bg-panel-2 border border-hairline">
              <div className="font-bold text-ink-muted uppercase tracking-wider mb-1">Handled By</div>
              <div className="text-ink">
                {profileLabel(selected.assigned_to) || "Unassigned"}
              </div>
            </div>
            {selected.listing_id && (
              <div className="p-3 rounded-lg bg-panel-2 border border-hairline sm:col-span-2">
                <div className="font-bold text-ink-muted uppercase tracking-wider mb-1">Listing</div>
                <Link
                  href={`/app/listings/${selected.listing_id}`}
                  className="text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Open reported listing →
                </Link>
              </div>
            )}
          </div>

          {/* Assign */}
          <div className="space-y-1.5">
            <label htmlFor="assign-moderator" className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Assign to Moderator
            </label>
            <select
              id="assign-moderator"
              value={selected.assigned_to || ""}
              onChange={(e) =>
                runAction(
                  () => assignReport(selected.id, e.target.value || null),
                  "Assignment updated."
                )
              }
              className="w-full sm:w-72 px-3 py-2 rounded-lg bg-panel border border-hairline text-sm text-ink outline-none focus:border-royal/50"
            >
              <option value="">Unassigned</option>
              {moderators.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.full_name || m.email}
                </option>
              ))}
            </select>
          </div>

          {/* Status actions */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Status
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map((action) => (
                <button
                  key={action.status}
                  type="button"
                  disabled={selected.status === action.status}
                  onClick={() =>
                    runAction(
                      () => setReportStatus(selected.id, action.status),
                      `Report marked ${STATUS_META[action.status].label}.`
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition disabled:opacity-40 ${
                    selected.status === action.status
                      ? "border-royal bg-royal/10 text-royal"
                      : "border-hairline text-ink-muted hover:border-royal/40 hover:text-ink"
                  }`}
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {actionError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {actionError}
            </div>
          )}
          {actionOk && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              {actionOk}
            </div>
          )}
        </div>

        {/* Notes / history */}
        <div className="bg-panel rounded-xl border border-hairline p-5 space-y-4">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-ink-muted" />
            Notes &amp; History
          </h3>

          {notesLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
          ) : notes.length === 0 ? (
            <p className="text-xs text-ink-muted">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-panel-2 border border-hairline">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-ink">
                      {n.author_label || "Unknown"}
                    </span>
                    <span className="text-[11px] text-ink-muted">{formatDateTime(n.created_at)}</span>
                  </div>
                  <p className="text-sm text-ink whitespace-pre-wrap">{n.note}</p>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = noteText.trim();
              if (!text) return;
              runAction(() => addReportNote(selected.id, text), "Note added.");
              setNoteText("");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add an internal note..."
              className="flex-1 px-3 py-2 rounded-lg bg-panel border border-hairline text-sm text-ink outline-none focus:border-royal/50"
            />
            <button
              type="submit"
              disabled={!noteText.trim()}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reporter, reason, listing..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-panel border border-hairline text-sm text-ink outline-none focus:border-royal/50"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-panel border border-hairline text-sm font-semibold text-ink outline-none focus:border-royal/50"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
          className="px-3 py-2 rounded-lg bg-panel border border-hairline text-sm font-semibold text-ink outline-none focus:border-royal/50"
        >
          <option value="">All Types</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <button
          onClick={load}
          className="p-2 rounded-lg border border-hairline text-ink-muted hover:text-ink transition"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <span className="text-xs text-ink-muted ml-auto">
          {filtered.length} of {reports.length} reports
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-panel rounded-xl border border-hairline p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">No reports</h3>
          <p className="text-sm text-ink-muted">User reports will appear here.</p>
        </div>
      ) : (
        <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-panel-2 border-b border-hairline">
                  <th className="text-left px-4 py-3 font-semibold text-ink">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Assigned</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filtered.map((report) => {
                  const meta = STATUS_META[report.status];
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-panel-2 cursor-pointer"
                      onClick={() => openReport(report.id)}
                    >
                      <td className="px-4 py-3 font-semibold text-ink capitalize">
                        {report.reason.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-ink-muted max-w-[260px] truncate">
                        {report.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${meta.cls}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {profileLabel(report.assigned_to) || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-muted">
                        {formatDateTime(report.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                          <UserCheck className="w-3.5 h-3.5" />
                          Open
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

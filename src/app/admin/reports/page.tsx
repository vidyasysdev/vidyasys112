import { ReportManager } from "@/components/admin/ReportManager";

export const metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Reports</h1>
        <p className="text-sm text-ink-muted mt-1">
          Centralized report management — filter, assign to moderators, update status, add notes,
          and track full history
        </p>
      </div>

      <ReportManager />
    </div>
  );
}

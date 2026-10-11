import { ReportManager } from "@/components/admin/ReportManager";

export const metadata = { title: "Moderation" };

export default function ModerationPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Moderation</h1>
        <p className="text-sm text-ink-muted mt-1">
          Handle reported users and listings — assign, review, resolve
        </p>
      </div>

      <ReportManager />
    </div>
  );
}

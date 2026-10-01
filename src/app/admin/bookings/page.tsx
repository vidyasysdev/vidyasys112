import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, tutor:profiles!tutor_id(full_name), student:profiles!student_id(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-ink tracking-tight">Bookings</h1>

      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-panel-2 border-b border-hairline">
                <th className="text-left px-4 py-3 font-semibold text-ink">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Tutor</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-panel-2">
                  <td className="px-4 py-3 text-ink font-semibold">{booking.student?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{booking.tutor?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{booking.subject}</td>
                  <td className="px-4 py-3 font-bold text-ink">₹{booking.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${
                      booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                      booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                      "bg-panel-2 text-ink-muted"
                    }`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{formatDateTime(booking.scheduled_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bookings</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Tutor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900 font-semibold">{booking.student?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{booking.tutor?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{booking.subject}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">₹{booking.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${
                      booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                      booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(booking.scheduled_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

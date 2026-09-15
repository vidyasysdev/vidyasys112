import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "My Bookings",
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, tutor:profiles!tutor_id(full_name, avatar_url)")
    .eq("student_id", user?.id || "")
    .order("scheduled_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">My Bookings</h1>
        <p className="text-sm text-slate-600 mt-1">View your tutoring sessions</p>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {booking.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      with {booking.tutor?.full_name || "Tutor"}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(booking.scheduled_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        {booking.session_mode === "online" ? (
                          <Video className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                        {booking.session_mode}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${
                  booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                  booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {booking.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings yet</h3>
          <p className="text-sm text-slate-500">Book a tutoring session to get started.</p>
        </div>
      )}
    </div>
  );
}

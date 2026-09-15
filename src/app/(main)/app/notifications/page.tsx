import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">Notifications</h1>
        <p className="text-sm text-slate-600 mt-1">Stay updated on orders, bookings, and more</p>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 ${
                !notif.is_read ? "border-l-4 border-l-brand-500" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatDateTime(notif.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications</h3>
          <p className="text-sm text-slate-500">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { CreditCard } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";

export default async function AdminPayoutsPage() {
  const supabase = await createClient();

  const { data: payouts } = await supabase
    .from("payouts")
    .select("*, profiles!user_id(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-ink tracking-tight">Payouts</h1>

      {payouts && payouts.length > 0 ? (
        <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-panel-2 border-b border-hairline">
                  <th className="text-left px-4 py-3 font-semibold text-ink">Recipient</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Commission</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Net</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-panel-2">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{payout.profiles?.full_name}</div>
                      <div className="text-xs text-ink-muted">{payout.profiles?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">{formatPrice(payout.amount)}</td>
                    <td className="px-4 py-3 text-red-600">{formatPrice(payout.commission_deducted)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatPrice(payout.amount - payout.commission_deducted)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${
                        payout.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                        payout.status === "processing" ? "bg-blue-50 text-blue-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted">{formatDateTime(payout.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-panel rounded-xl border border-hairline p-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">No payouts yet</h3>
          <p className="text-sm text-ink-muted">Payouts will appear here once sellers/tutors earn commissions.</p>
        </div>
      )}
    </div>
  );
}

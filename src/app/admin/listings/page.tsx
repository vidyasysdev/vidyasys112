import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Building2, CheckCircle, XCircle } from "lucide-react";
import { logAdminAction } from "@/lib/admin-log";

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!seller_id(full_name, email)")
    .order("created_at", { ascending: false });

  async function approveListing(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const supabase = await createClient();
    await supabase.from("listings").update({ status: "approved" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "listing",
      targetId: id,
      targetLabel: title || id,
      previousValue: "pending",
      newValue: "approved",
    });
    revalidatePath("/admin/listings");
  }

  async function rejectListing(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const supabase = await createClient();
    await supabase.from("listings").update({ status: "rejected" }).eq("id", id);
    await logAdminAction({
      action: "moderation_action",
      targetType: "listing",
      targetId: id,
      targetLabel: title || id,
      previousValue: "pending",
      newValue: "rejected",
    });
    revalidatePath("/admin/listings");
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    sold_out: "bg-panel-2 text-ink-muted",
    archived: "bg-panel-2 text-ink-muted",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-ink tracking-tight">Listings Management</h1>

      <div className="bg-panel rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-panel-2 border-b border-hairline">
                <th className="text-left px-4 py-3 font-semibold text-ink">Listing</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Seller</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {listings?.map((listing) => (
                <tr key={listing.id} className="hover:bg-panel-2">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink max-w-[200px] truncate">{listing.title}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{listing.profiles?.full_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-ink-muted capitalize">
                      {listing.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">₹{listing.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${statusColors[listing.status] || ""}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {listing.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <form action={approveListing}>
                          <input type="hidden" name="id" value={listing.id} />
                          <input type="hidden" name="title" value={listing.title} />
                          <button type="submit" title="Approve" className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </form>
                        <form action={rejectListing}>
                          <input type="hidden" name="id" value={listing.id} />
                          <input type="hidden" name="title" value={listing.title} />
                          <button type="submit" title="Reject" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

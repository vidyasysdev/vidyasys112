import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Building2, CheckCircle, XCircle } from "lucide-react";

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!seller_id(full_name, email)")
    .order("created_at", { ascending: false });

  async function approveListing(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await supabase.from("listings").update({ status: "approved" }).eq("id", id);
    revalidatePath("/admin/listings");
  }

  async function rejectListing(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await supabase.from("listings").update({ status: "rejected" }).eq("id", id);
    revalidatePath("/admin/listings");
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    sold_out: "bg-slate-100 text-slate-600",
    archived: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Listings Management</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Listing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Seller</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings?.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 max-w-[200px] truncate">{listing.title}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{listing.profiles?.full_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-600 capitalize">
                      {listing.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">₹{listing.price}</td>
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
                          <button type="submit" title="Approve" className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </form>
                        <form action={rejectListing}>
                          <input type="hidden" name="id" value={listing.id} />
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

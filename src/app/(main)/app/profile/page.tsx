import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldCheck, MapPin, BookOpen, Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: listings }, { data: reviews }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("listings")
      .select("id, title, price, status")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("reviews")
      .select("rating, comment, created_at")
      .eq("reviewee_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const displayName = profile?.full_name || user.user_metadata?.full_name || "Student";
  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-black">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{displayName}</h1>
              {profile?.verification_status === "verified" && (
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <p className="text-sm text-slate-600">{user.email}</p>
            {profile && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {profile.branch} • Sem {profile.semester}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {avgRating}
                  </span>
                )}
              </div>
            )}
            {profile?.bio && (
              <p className="text-sm text-slate-600 mt-2">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Listings", value: listings?.length || 0 },
          { label: "Reviews", value: reviews?.length || 0 },
          { label: "Rating", value: avgRating || "—" },
          { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).getFullYear() : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="text-xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(profile.skills as string[]).map((skill: string) => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* My Listings */}
      {listings && listings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-3">My Listings</h3>
          <div className="space-y-2">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{listing.title}</h4>
                  <span className="text-xs text-slate-500 capitalize">{listing.status}</span>
                </div>
                <span className="text-sm font-black text-slate-900">₹{listing.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

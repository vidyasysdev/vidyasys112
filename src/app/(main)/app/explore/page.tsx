import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Search, Filter, BookOpen, Cpu, Wrench, Package } from "lucide-react";

export const metadata = {
  title: "Explore Marketplace",
};

export default async function ExplorePage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*, listing_images(*), profiles!seller_id(full_name, avatar_url, verification_status)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  const categories = [
    { id: "notes", label: "Notes", icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: "academic_projects", label: "Academic Projects", icon: Cpu, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { id: "hardware_projects", label: "Hardware Projects", icon: Wrench, color: "bg-amber-50 text-amber-600 border-amber-200" },
    { id: "student_essentials", label: "Student Essentials", icon: Package, color: "bg-purple-50 text-purple-600 border-purple-200" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">Explore Marketplace</h1>
        <p className="text-sm text-slate-600 mt-1">Browse verified listings from your college</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, title, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold whitespace-nowrap transition hover:shadow-sm ${cat.color}`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <a
              key={listing.id}
              href={`/app/listings/${listing.id}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group"
            >
              {listing.listing_images?.[0] && (
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <Image
                    src={listing.listing_images[0].image_url}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                    {listing.category.replace("_", " ")}
                  </span>
                  {listing.is_digital && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Digital
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-brand-600 transition">
                  {listing.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{listing.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-lg font-black text-slate-900">₹{listing.price}</span>
                  <span className="text-xs text-slate-500">Sem {listing.semester}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No listings yet</h3>
          <p className="text-sm text-slate-500">Be the first to list something on the marketplace!</p>
        </div>
      )}
    </div>
  );
}

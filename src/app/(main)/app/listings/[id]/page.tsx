import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Clock, ShieldCheck, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ReportButton } from "@/components/marketplace/ReportButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, listing_images(*), profiles!seller_id(full_name, avatar_url, verification_status, branch, semester)")
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/app/explore"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      <div className="bg-panel rounded-2xl border border-hairline overflow-hidden">
        {listing.listing_images?.[0] && (
          <div className="relative aspect-video bg-panel-2">
            <Image
              src={listing.listing_images[0].image_url}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                {listing.category.replace("_", " ")}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-panel-2 text-ink-muted text-xs font-bold">
                {listing.listing_type}
              </span>
              {listing.is_digital && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                  Digital
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-ink">{listing.title}</h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-panel-2 rounded-lg p-3 text-center">
              <div className="text-lg font-black text-ink">{formatPrice(listing.price)}</div>
              <div className="text-xs text-ink-muted">Price</div>
            </div>
            <div className="bg-panel-2 rounded-lg p-3 text-center">
              <div className="text-lg font-black text-ink">Sem {listing.semester}</div>
              <div className="text-xs text-ink-muted">Semester</div>
            </div>
            <div className="bg-panel-2 rounded-lg p-3 text-center">
              <div className="text-lg font-black text-ink">{listing.branch}</div>
              <div className="text-xs text-ink-muted">Branch</div>
            </div>
            <div className="bg-panel-2 rounded-lg p-3 text-center">
              <div className="text-lg font-black text-ink">{listing.available_quantity}</div>
              <div className="text-xs text-ink-muted">Available</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-ink">Description</h3>
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-ink">Subject</h3>
            <p className="text-sm text-ink-muted">{listing.subject}</p>
          </div>

          {listing.profiles && (
            <div className="flex items-center gap-3 p-4 bg-panel-2 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                {listing.profiles.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-ink">{listing.profiles.full_name}</span>
                  {listing.profiles.verification_status === "verified" && (
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <span className="text-xs text-ink-muted">
                  {listing.profiles.branch} • Sem {listing.profiles.semester}
                </span>
              </div>
            </div>
          )}

          <button className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition">
            {listing.listing_type === "rent" ? "Rent Now" : listing.listing_type === "both" ? "Buy / Rent" : "Purchase Now"}
          </button>

          <ReportButton listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}

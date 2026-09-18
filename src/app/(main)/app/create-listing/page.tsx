"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "notes", label: "Notes" },
  { value: "academic_projects", label: "Academic Projects" },
  { value: "hardware_projects", label: "Hardware Projects" },
  { value: "student_essentials", label: "Student Essentials" },
];

const BRANCHES = [
  "Computer Science",
  "Electronics & Communication",
  "Mechanical",
  "Electrical",
  "Civil",
  "Information Technology",
  "Other",
];

export default function CreateListingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("notes");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState(1);
  const [branch, setBranch] = useState("Computer Science");
  const [listingType, setListingType] = useState<"sell" | "rent" | "both">("sell");
  const [price, setPrice] = useState(0);
  const [rentPrice, setRentPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isDigital, setIsDigital] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("college_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      setError("Please complete your profile first");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("listings").insert({
      seller_id: user.id,
      college_id: profile.college_id,
      title,
      description,
      category: category as "notes" | "academic_projects" | "hardware_projects" | "student_essentials",
      subject,
      semester,
      branch,
      listing_type: listingType,
      price,
      rent_price: rentPrice,
      quantity,
      available_quantity: quantity,
      status: "pending",
      is_digital: isDigital,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/app/explore");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/app/explore"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">Create Listing</h1>
        <p className="text-sm text-slate-600 mt-1">List your notes, projects, or essentials on the marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Operating Systems Exam Notes"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your listing in detail..."
            required
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Listing Type</label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as "sell" | "rent" | "both")}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
              <option value="both">Sell & Rent</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Operating Systems"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {(listingType === "rent" || listingType === "both") && (
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Rent Price (₹)</label>
            <input
              type="number"
              value={rentPrice || ""}
              onChange={(e) => setRentPrice(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDigital"
            checked={isDigital}
            onChange={(e) => setIsDigital(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="isDigital" className="text-sm font-semibold text-slate-700">
            This is a digital product (instant download)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Submit Listing for Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}

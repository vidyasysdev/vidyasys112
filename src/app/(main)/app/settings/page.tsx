"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User, Shield } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-600 mt-1">Manage your account</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit Profile</h3>
              <p className="text-xs text-slate-500">Update your name, bio, and skills</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Edit
          </button>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verification Status</h3>
              <p className="text-xs text-slate-500">College email verified</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
            Verified
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

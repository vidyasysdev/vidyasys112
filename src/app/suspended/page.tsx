import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Ban, ShieldAlert } from "lucide-react";

export const metadata = { title: "Account Restricted" };

export default async function SuspendedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_status, full_name")
    .eq("user_id", user.id)
    .single();

  const status = profile?.account_status || "suspended";
  const isDisabled = status === "disabled";

  return (
    <div className="min-h-screen bg-panel-2 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel rounded-2xl border border-hairline p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          {isDisabled ? (
            <Ban className="w-7 h-7 text-red-600" />
          ) : (
            <ShieldAlert className="w-7 h-7 text-red-600" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-ink tracking-tight">
            {isDisabled ? "Account Disabled" : "Account Suspended"}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            {isDisabled
              ? "Your account has been disabled by the Vidyasys team. You cannot access the platform right now."
              : "Your account has been suspended due to a violation of the community guidelines. While suspended you cannot access the platform."}
          </p>
          <p className="text-sm text-ink-muted">
            If you believe this is a mistake, contact support with your registered email (
            <span className="font-semibold text-ink">{user.email}</span>).
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}

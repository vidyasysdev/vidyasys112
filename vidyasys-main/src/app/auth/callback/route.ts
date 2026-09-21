import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPROVED_DOMAINS } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const email = user.email || "";
        const domain = email.split("@")[1] || "";
        const isApprovedDomain = APPROVED_DOMAINS.includes(domain);

        if (isApprovedDomain) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("verification_status, college_id")
            .eq("user_id", user.id)
            .single();

          if (!profile || profile.verification_status !== "verified" || !isApprovedDomain) {
            return NextResponse.redirect(`${origin}/verify-college`);
          }
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("verification_status")
            .eq("user_id", user.id)
            .single();

          if (!profile || profile.verification_status !== "verified") {
            return NextResponse.redirect(`${origin}/verify-college`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

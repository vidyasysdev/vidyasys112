import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { APPROVED_DOMAINS } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isOnboarding = pathname === "/onboarding";
  const isVerifyCollege = pathname === "/verify-college";
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = pathname.startsWith("/app");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if ((isProtectedRoute || isOnboarding) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (isProtectedRoute || isOnboarding) && !isVerifyCollege) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status, onboarding_completed")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.verification_status !== "verified") {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-college";
      return NextResponse.redirect(url);
    }

    if (!profile.onboarding_completed && !isOnboarding) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status, onboarding_completed")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.verification_status !== "verified") {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-college";
      return NextResponse.redirect(url);
    }

    if (profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

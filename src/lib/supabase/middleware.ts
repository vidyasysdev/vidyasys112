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

  const publicRoutes = ["/", "/about", "/how-it-works", "/explore", "/tutors", "/contact", "/login", "/signup", "/verify-email", "/verify-college"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = pathname.startsWith("/app");
  const isVerifyCollege = pathname === "/verify-college";

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && user && !isVerifyCollege) {
    const email = user.email || "";
    const domain = email.split("@")[1] || "";
    const isApprovedDomain = APPROVED_DOMAINS.includes(domain);

    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.verification_status !== "verified") {
      if (!isVerifyCollege) {
        const url = request.nextUrl.clone();
        url.pathname = "/verify-college";
        return NextResponse.redirect(url);
      }
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && user) {
    const email = user.email || "";
    const domain = email.split("@")[1] || "";
    const isApprovedDomain = APPROVED_DOMAINS.includes(domain);

    if (isApprovedDomain) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("user_id", user.id)
        .single();

      if (profile && profile.verification_status === "verified") {
        const url = request.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      } else {
        const url = request.nextUrl.clone();
        url.pathname = "/verify-college";
        return NextResponse.redirect(url);
      }
    }
  }

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

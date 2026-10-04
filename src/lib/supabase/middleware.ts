import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { APPROVED_DOMAINS } from "@/lib/utils";
import { DEFAULT_ROLE_PERMISSIONS, type RoleKey } from "@/lib/rbac";

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
  const isSuspendedRoute = pathname === "/suspended";
  const isCreateListingRoute = pathname === "/app/create-listing";
  const isSignupRoute = pathname === "/signup";

  if ((isProtectedRoute || isOnboarding || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Closed signups: platform_settings.signups_enabled = false
  if (isSignupRoute && !user) {
    const { data: signupSetting } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "signups_enabled")
      .single();
    if (signupSetting?.value === "false") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "?signup=closed";
      return NextResponse.redirect(url);
    }
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status, onboarding_completed")
      .eq("user_id", user.id)
      .single();

    // RBAC columns (supabase/rbac-migration.sql). Tolerate their absence so
    // the app keeps working before the migration has been applied.
    let role: RoleKey = "user";
    let accountStatus = "active";

    const { data: rbacProfile, error: rbacError } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("user_id", user.id)
      .single();

    if (!rbacError && rbacProfile) {
      role = (rbacProfile.role as RoleKey) || "user";
      accountStatus = rbacProfile.account_status || "active";
    } else {
      // Pre-migration fallback: is_admin flag from fix-live-db.sql
      const { data: adminFlag } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();
      if (adminFlag?.is_admin === true) role = "admin";
    }

    // Suspended / disabled accounts are routed to /suspended and nothing else.
    const isBlockedStatus = accountStatus === "suspended" || accountStatus === "disabled";
    if (isBlockedStatus) {
      if (!isSuspendedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/suspended";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }
    if (isSuspendedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    // Admin panel requires the admin role (or legacy is_admin flag).
    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    // Create Listing requires the create_content permission for the role.
    if (isCreateListingRoute && role !== "admin") {
      const { data: permRow } = await supabase
        .from("role_permissions")
        .select("enabled")
        .eq("role", role)
        .eq("permission", "create_content")
        .maybeSingle();

      const canCreate = permRow
        ? permRow.enabled === true
        : DEFAULT_ROLE_PERMISSIONS[role].create_content;

      if (!canCreate) {
        const url = request.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      }
    }

    // College verification then onboarding.
    if (isProtectedRoute || isOnboarding) {
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

  return supabaseResponse;
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { APPROVED_DOMAINS } from "@/lib/utils";
import { DEFAULT_ROLE_PERMISSIONS, type RoleKey } from "@/lib/rbac";
import {
  DEMO_ADMIN_COOKIE,
  demoHomeForRole,
  parseDemoSession,
} from "@/lib/demo-admin";

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

  // Local demo session (see src/lib/demo-admin.ts) — any seeded role.
  // It is ignored entirely when a real Supabase user is signed in, and only
  // an admin-role session may open the admin panel.
  const demoSession = user
    ? null
    : parseDemoSession(request.cookies.get(DEMO_ADMIN_COOKIE)?.value);
  const demoAdmin = demoSession?.role === "admin";

  // The admin area has no separate login page: /login is the single entry
  // point for every role (admin, moderator, Brand Ambassador, student).
  if (
    (isProtectedRoute || isOnboarding || isAdminRoute) &&
    !user &&
    !demoSession
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // A demo session with a non-admin role is bounced out of the panel to
  // its own landing page (ambassadors → /app/ambassador, …).
  if (isAdminRoute && !user && demoSession && !demoAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = demoHomeForRole(demoSession.role);
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
    // Single round-trip for everything the middleware needs (verification,
    // onboarding, RBAC role, account status). `select("*")` never fails on
    // columns the rbac-migration hasn't added yet — they are simply absent.
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let role: RoleKey = "user";
    let accountStatus = "active";

    if (profile) {
      if ("role" in profile) {
        role = (profile.role as RoleKey) || "user";
        accountStatus = (profile.account_status as string) || "active";
      } else if (profile.is_admin === true) {
        // Pre-migration fallback: is_admin flag from fix-live-db.sql
        role = "admin";
      }
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
    if (isAdminRoute && role !== "admin" && !demoAdmin) {
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
      .select("verification_status, onboarding_completed, role, is_admin")
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

    // Already signed in: admins go to the panel, everyone else to the app.
    const url = request.nextUrl.clone();
    url.pathname =
      profile.role === "admin" || profile.is_admin ? "/admin" : "/app";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

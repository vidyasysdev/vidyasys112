"use server";

import { cookies } from "next/headers";
import {
  DEMO_ADMIN_COOKIE,
  DEMO_ADMIN_TOKEN,
  checkDemoAdminCredentials,
  demoHomeForRole,
  encodeDemoSession,
  isDemoAdminEnabled,
} from "@/lib/demo-admin";
import { demoListUsers } from "@/lib/demo-store";

export type DemoLoginResult =
  | { ok: true; destination: string }
  | { ok: false; code: "disabled" | "invalid" | "suspended"; error: string };

/**
 * Sign-in for the single shared /login page when Supabase auth is not
 * available yet. Accepts either the bootstrap administrator or any seeded
 * demo account that carries a password (e.g. yash@vidyasys.in). The
 * credentials are validated here, on the server, so nothing sensitive ever
 * reaches the browser bundle.
 */
export async function signInAsDemoAdmin(
  email: string,
  password: string
): Promise<DemoLoginResult> {
  if (!isDemoAdminEnabled()) {
    return {
      ok: false,
      code: "disabled",
      error: "Enable ADMIN_DEMO_LOGIN in your environment to use this login.",
    };
  }

  // 1) Bootstrap administrator (constant, never stored in the JSON store).
  if (checkDemoAdminCredentials(email, password)) {
    const cookieStore = await cookies();
    cookieStore.set(DEMO_ADMIN_COOKIE, DEMO_ADMIN_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return { ok: true, destination: "/admin" };
  }

  // 2) Seeded demo accounts (fake students, moderators, ambassadors, …).
  const normalised = email.trim().toLowerCase();
  const users = await demoListUsers();
  const match = users.find((u) => u.email.toLowerCase() === normalised);

  if (match && match.password && match.password === password) {
    if (match.account_status !== "active") {
      return {
        ok: false,
        code: "suspended",
        error: "This account is suspended. Contact an administrator.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      DEMO_ADMIN_COOKIE,
      encodeDemoSession({
        userId: match.user_id,
        email: match.email,
        role: match.role,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      }
    );
    return { ok: true, destination: demoHomeForRole(match.role) };
  }

  return {
    ok: false,
    code: "invalid",
    error: "Incorrect email or password.",
  };
}

/** Sign out of the demo session (used by the panel's sign-out flow). */
export async function signOutDemoAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ADMIN_COOKIE);
}

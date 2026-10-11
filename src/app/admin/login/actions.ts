"use server";

import { cookies } from "next/headers";
import {
  DEMO_ADMIN_COOKIE,
  DEMO_ADMIN_TOKEN,
  checkDemoAdminCredentials,
  isDemoAdminEnabled,
} from "@/lib/demo-admin";

export type DemoAdminLoginResult =
  | { ok: true }
  | { ok: false; code: "disabled" | "invalid"; error: string };

/**
 * Bootstrap admin sign-in used when Supabase auth is not available yet.
 * The credentials are validated here, on the server, so nothing sensitive
 * ever reaches the browser bundle.
 */
export async function signInAsDemoAdmin(
  email: string,
  password: string
): Promise<DemoAdminLoginResult> {
  if (!isDemoAdminEnabled()) {
    return {
      ok: false,
      code: "disabled",
      error: "Enable ADMIN_DEMO_LOGIN in your environment to use this login.",
    };
  }

  if (!checkDemoAdminCredentials(email, password)) {
    return {
      ok: false,
      code: "invalid",
      error: "Incorrect email or password.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_ADMIN_COOKIE, DEMO_ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return { ok: true };
}

/** Sign out of the demo admin session (used by the panel's sign-out flow). */
export async function signOutDemoAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ADMIN_COOKIE);
}

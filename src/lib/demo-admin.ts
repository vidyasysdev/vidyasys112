/**
 * Demo / bootstrap access sessions.
 *
 * These values are only ever read on the server (middleware, layouts and
 * server actions) — nothing sensitive is shipped to the browser.
 *
 * Two kinds of demo session exist, both on the same `vidyasys_admin_demo`
 * cookie so there is exactly ONE login page for every role:
 *
 *  - `granted`               → the bootstrap administrator (rajbhosale@…)
 *  - `u1.<encoded session>`  → any seeded demo account (e.g. the fake Brand
 *                              Ambassador yash@vidyasys.in), carrying its
 *                              userId, email and role.
 *
 * The mechanism is switched off unless `ADMIN_DEMO_LOGIN=true` is present in
 * the environment, so a production deployment that uses real Supabase auth is
 * unaffected.
 */
import { ROLE_KEYS, type RoleKey } from "@/lib/rbac";

export const DEMO_ADMIN_COOKIE = "vidyasys_admin_demo";
export const DEMO_ADMIN_TOKEN = "granted";
export const DEMO_ADMIN_EMAIL = "rajbhosale@vidyasys.in";
export const DEMO_ADMIN_USER_ID = "demo-admin";

const DEMO_ADMIN_PASSWORD = "rajbhosale";

/** A signed-in local demo identity (any role). */
export interface DemoSession {
  userId: string;
  email: string;
  role: RoleKey;
}

/** Is the local bootstrap login switched on for this environment? */
export function isDemoAdminEnabled(): boolean {
  return process.env.ADMIN_DEMO_LOGIN === "true";
}

/** Encode a demo identity into a cookie-safe value (no quotes/semicolons). */
export function encodeDemoSession(session: DemoSession): string {
  return `u1.${encodeURIComponent(JSON.stringify(session))}`;
}

/** Parse a demo session cookie. Returns null when absent, foreign or invalid. */
export function parseDemoSession(
  value: string | undefined | null
): DemoSession | null {
  if (!value) return null;

  // Legacy / bootstrap administrator token.
  if (value === DEMO_ADMIN_TOKEN) {
    return {
      userId: DEMO_ADMIN_USER_ID,
      email: DEMO_ADMIN_EMAIL,
      role: "admin",
    };
  }

  if (!value.startsWith("u1.")) return null;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(value.slice(3))
    ) as Partial<DemoSession>;
    if (
      typeof parsed.userId === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      (ROLE_KEYS as readonly string[]).includes(parsed.role)
    ) {
      return {
        userId: parsed.userId,
        email: parsed.email,
        role: parsed.role as RoleKey,
      };
    }
  } catch {
    // Corrupt cookie — treat as signed out.
  }
  return null;
}

/** Does this request carry a demo session that may open the admin panel? */
export function isDemoAdminToken(value: string | undefined | null): boolean {
  return isDemoAdminEnabled() && parseDemoSession(value)?.role === "admin";
}

/** Where each role lands after signing in on the shared login page. */
export function demoHomeForRole(role: RoleKey): string {
  if (role === "admin") return "/admin";
  if (role === "ambassador") return "/app/ambassador";
  if (role === "moderator") return "/app/moderation";
  return "/app";
}

/** Server-side check of the bootstrap administrator credentials. */
export function checkDemoAdminCredentials(
  email: string,
  password: string
): boolean {
  if (!isDemoAdminEnabled()) return false;

  const normalisedEmail = email.trim().toLowerCase();
  return (
    normalisedEmail === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD
  );
}

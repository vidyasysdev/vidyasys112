/**
 * Demo / bootstrap administrator access.
 *
 * These values are only ever read on the server (middleware, layouts and
 * server actions) — the password is never shipped to the browser.
 *
 * The mechanism is switched off unless `ADMIN_DEMO_LOGIN=true` is present in
 * the environment, so a production deployment that uses real Supabase auth
 * is unaffected. Set it to false (or remove it) once your own admin account
 * exists in Supabase.
 */
export const DEMO_ADMIN_COOKIE = "vidyasys_admin_demo";
export const DEMO_ADMIN_TOKEN = "granted";
export const DEMO_ADMIN_EMAIL = "rajbhosale@vidyasys.in";

const DEMO_ADMIN_PASSWORD = "rajbhosale";

/** Is the local bootstrap admin login switched on for this environment? */
export function isDemoAdminEnabled(): boolean {
  return process.env.ADMIN_DEMO_LOGIN === "true";
}

/** Does the request carry a valid demo-admin session cookie? */
export function isDemoAdminToken(value: string | undefined | null): boolean {
  return isDemoAdminEnabled() && value === DEMO_ADMIN_TOKEN;
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

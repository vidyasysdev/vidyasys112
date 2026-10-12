/**
 * Environment-only Supabase configuration check (safe for client bundles
 * and for build-time prerendering — no filesystem, no Next.js APIs).
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    !!url &&
    !!key &&
    !url.includes("your-project") &&
    !url.startsWith("your_")
  );
}

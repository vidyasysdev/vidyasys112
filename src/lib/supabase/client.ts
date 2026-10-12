import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a browser Supabase client, or `null` when real credentials are
 * not present in the environment. Callers must handle `null` (show a
 * friendly "not configured" message instead of crashing). This keeps
 * `next build` from failing during prerender when env vars are missing.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Optional Supabase client. Returns null when env vars are missing so the
 * store keeps working in "local / demo" mode.
 * Only the public anon key is ever used in the browser; all writes go through
 * SECURITY DEFINER RPCs protected by RLS (see supabase/migrations).
 */
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

export const isSupabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for the THEFATTEST.STORE project.
 * The publishable key is public by design: every write goes through
 * SECURITY DEFINER RPCs and RLS (see supabase/migrations), so the browser
 * can only read the catalog, create orders, validate coupons and subscribe.
 * Env vars override the defaults; set NEXT_PUBLIC_SUPABASE_URL="off" to run
 * without a database (orders stay in the browser + WhatsApp).
 */
const DEFAULT_URL = "https://dqzjwdcwblizhpaeertg.supabase.co";
const DEFAULT_KEY = "sb_publishable_25E8Am6ghIwYPbgGLAlwFQ_31U_joqn";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;
const enabled = url !== "off";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = enabled ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

export const isSupabaseConfigured = () => enabled;

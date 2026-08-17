import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Get the Supabase service-role secret key.
 * Supports two naming conventions:
 *  - SUPABASE_SECRET_KEY        (our custom / local .env.local name)
 *  - SUPABASE_SERVICE_ROLE_KEY  (Vercel/cPanel standard name)
 */
export function getSupabaseSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    console.error(
      '[SEED Admin] FATAL: Neither SUPABASE_SECRET_KEY nor SUPABASE_SERVICE_ROLE_KEY is set.'
    );
    return '';
  }

  return key;
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseSecretKey = getSupabaseSecretKey();

  const formattedUrl = supabaseUrl.startsWith('http')
    ? supabaseUrl
    : `https://${supabaseUrl}.supabase.co`;

  return createSupabaseClient(formattedUrl, supabaseSecretKey, {
    auth: {
      persistSession: false
    }
  });
}

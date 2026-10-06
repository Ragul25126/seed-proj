import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Get the Supabase service-role secret key.
 * Supports two naming conventions:
 *  - SUPABASE_SECRET_KEY        (our custom / local .env.local name)
 *  - SUPABASE_SERVICE_ROLE_KEY  (Vercel Supabase integration standard)
 */
export function getSupabaseSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    '';

  if (!key) {
    console.error(
      '[SEED Admin] WARN: Service-role key is missing. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY.'
    );
  }

  return key;
}

export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'apvkdnofstyyidcmuczb';
  const supabaseSecretKey = getSupabaseSecretKey();

  const formattedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

  return createSupabaseClient(formattedUrl, supabaseSecretKey, {
    auth: {
      persistSession: false
    }
  });
}

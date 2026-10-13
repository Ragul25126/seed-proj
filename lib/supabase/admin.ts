import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Get the Supabase service-role secret key.
 * Server-side ONLY: Privileged keys must NEVER be prefixed with NEXT_PUBLIC_.
 * Supports standard Vercel Supabase integration naming and local env naming:
 *  - SUPABASE_SERVICE_ROLE_KEY  (Vercel Supabase integration standard)
 *  - SUPABASE_SECRET_KEY        (custom / local .env.local name)
 */
export function getSupabaseSecretKey(): string {
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    ''
  ).trim();

  return key;
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();
}

let warnedMissingSecret = false;

export function createAdminClient() {
  const rawUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'apvkdnofstyyidcmuczb'
  ).trim();

  const formattedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

  const supabaseSecretKey = getSupabaseSecretKey();

  if (supabaseSecretKey) {
    return createSupabaseClient(formattedUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  // Graceful fallback: If service-role key is not configured, fall back to anonymous key.
  // This allows public database queries (e.g. projects, vacancies) to succeed in production
  // without returning "Invalid API key". Privileged operations will still be restricted by RLS.
  const anonKey = getSupabaseAnonKey();
  if (anonKey) {
    if (!warnedMissingSecret) {
      console.warn(
        '[SEED Supabase] Service-role key is missing (set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY). ' +
        'Falling back to anon key for public database operations.'
      );
      warnedMissingSecret = true;
    }
    return createSupabaseClient(formattedUrl, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  console.error(
    '[SEED Supabase] CRITICAL: Neither service-role key nor anon key is set. ' +
    'Please configure SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables.'
  );

  return createSupabaseClient(formattedUrl, 'dummy-key-missing', {
    auth: {
      persistSession: false,
    },
  });
}

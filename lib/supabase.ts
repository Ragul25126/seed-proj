import { createClient } from '@supabase/supabase-js';

const rawUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'apvkdnofstyyidcmuczb'
).trim();

const formattedUrl = rawUrl.startsWith('http')
  ? rawUrl
  : `https://${rawUrl}.supabase.co`;

const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''
).trim();

if (!supabaseAnonKey && typeof window === 'undefined') {
  console.warn(
    '[SEED Supabase] Notice: Supabase anonymous key is not set. ' +
    'Set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment variables.'
  );
}

export const supabase = createClient(
  formattedUrl,
  supabaseAnonKey || 'dummy-key-missing'
);

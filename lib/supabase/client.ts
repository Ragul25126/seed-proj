import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const rawUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'apvkdnofstyyidcmuczb'
  ).trim();

  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();

  const formattedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

  return createBrowserClient(formattedUrl, supabaseAnonKey);
}

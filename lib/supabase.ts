import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not defined in .env.local');
}

const formattedUrl = supabaseUrl && supabaseUrl.startsWith('http')
  ? supabaseUrl
  : (supabaseUrl ? `https://${supabaseUrl}.supabase.co` : 'https://placeholder-url.supabase.co');

export const supabase = createClient(
  formattedUrl,
  supabaseAnonKey || 'placeholder-anon-key'
);

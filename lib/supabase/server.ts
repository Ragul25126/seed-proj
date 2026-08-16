import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import dns from 'dns';

// Force Node.js to prefer IPv4 DNS resolution to avoid NAT64/IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore fallback issues
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Support both our local key name and the Vercel Supabase integration standard name
  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )!;
  
  const formattedUrl = supabaseUrl.startsWith('http')
    ? supabaseUrl
    : `https://${supabaseUrl}.supabase.co`;

  try {
    const cookieStore = cookies();
    return createServerClient(
      formattedUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
  } catch (err) {
    // Fall back to a standard Supabase client without cookies outside request scope
    return createSupabaseClient(formattedUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
  }
}

import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from './admin';
import dns from 'dns';

// Force Node.js to prefer IPv4 DNS resolution to avoid NAT64/IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore fallback issues
}

export function createClient() {
  const rawUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'apvkdnofstyyidcmuczb'
  ).trim();

  // Support both standard Vercel Supabase name, custom publishable name, and anon key
  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();
  
  const formattedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

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

/**
 * Server-side authorization helper for Next.js App Router Server Components.
 *
 * 1. Authenticates the incoming request session via createClient().auth.getUser().
 * 2. Verifies that the authenticated user exists in the public.admin_users table.
 * 3. Fails closed:
 *    - Unauthenticated: redirects to /admin/login
 *    - Authenticated non-admin / lookup failure: redirects to /admin/login?error=unauthorized
 * 4. Returns the verified User object.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    redirect('/admin/login');
  }

  const authLookupClient = createAdminClient();

  const { data: adminUser, error: checkErr } = await authLookupClient
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (checkErr || !adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  return user;
}

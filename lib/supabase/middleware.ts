import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseSecretKey } from './admin';

// Helper to sign a message using HMAC SHA-256 for fast edge-native session caching
async function getAdminToken(userId: string) {
  const encoder = new TextEncoder();
  // Use the actual service-role key as the HMAC secret so tokens are env-specific
  const secretKey = encoder.encode(getSupabaseSecretKey() || 'seed_admin_fallback_secret');
  const data = encoder.encode(userId);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyAdminToken(userId: string, token: string) {
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(getSupabaseSecretKey() || 'seed_admin_fallback_secret');
    const data = encoder.encode(userId);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const binaryStr = atob(token);
    const signature = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      signature[i] = binaryStr.charCodeAt(i);
    }
    return await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
  } catch (e) {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Support both our custom key name and the Vercel Supabase integration standard name
  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )!;

  if (!supabaseAnonKey) {
    console.error(
      '[SEED Middleware] FATAL: Neither NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY nor ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is set. Auth will not work in production. ' +
      'Add one of these to your Vercel environment variables.'
    );
  }
  
  const formattedUrl = supabaseUrl.startsWith('http')
    ? supabaseUrl
    : `https://${supabaseUrl}.supabase.co`;

  const supabase = createServerClient(
    formattedUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard admin routes (e.g. /admin, /admin/projects, etc.)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login');

  const redirectResponse = (url: URL | string) => {
    const redirectRes = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectRes.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
      });
    });
    return redirectRes;
  };

  // Redirect old /admin routes (e.g. /admin, /admin/projects) to the new /admin/dashboard routes
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/dashboard') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.replace('/admin', '/admin/dashboard');
    return redirectResponse(url);
  }

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return redirectResponse(url);
    }

    // Check if the user is already verified via a signed token in cookies
    const cachedToken = request.cookies.get('seed_admin_token')?.value;
    let isVerifiedAdmin = false;
    if (cachedToken) {
      isVerifiedAdmin = await verifyAdminToken(user.id, cachedToken);
    }

    if (!isVerifiedAdmin) {
      // Verify admin role against admin_users table in the public schema
      // USE SERVICE-ROLE CLIENT TO BYPASS RLS (supports both key naming conventions)
      const secretKey = getSupabaseSecretKey();

      if (!secretKey) {
        console.error(
          '[SEED Middleware] Cannot verify admin: service-role key is missing. ' +
          'Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY in Vercel env vars.'
        );
        // Fail open with a redirect to login to avoid locking out (no sign-out, key is broken)
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'config');
        return redirectResponse(url);
      }

      const adminClient = createSupabaseClient(formattedUrl, secretKey, {
        auth: { persistSession: false },
      });

      const { data: adminUser, error: adminCheckErr } = await adminClient
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (adminCheckErr || !adminUser) {
        console.error(
          '[SEED Middleware] Admin check failed for user:', user.id,
          '| DB error:', adminCheckErr?.message || 'none',
          '| adminUser found:', !!adminUser
        );
        // Sign out unauthorized user session and redirect to login
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        const redirectRes = redirectResponse(url);
        redirectRes.cookies.delete('seed_admin_token');
        return redirectRes;
      }
      
      // Cache verified admin status in a signed cookie for 7 days
      const token = await getAdminToken(user.id);
      supabaseResponse.cookies.set('seed_admin_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
  }

  // If user is already logged in as admin and tries to hit /admin/login, redirect to /admin
  if (isLoginRoute && user) {
    // Confirm if they are indeed an admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (adminUser) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return redirectResponse(url);
    }
  }

  return supabaseResponse;
}

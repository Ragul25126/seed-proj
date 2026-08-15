import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  
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

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return redirectResponse(url);
    }

    // Verify admin role against admin_users table in the public schema
    // USE ADMIN CLIENT TO BYPASS RLS
    const adminClient = createSupabaseClient(formattedUrl, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false },
    });
    
    const { data: adminUser, error: adminCheckErr } = await adminClient
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (adminCheckErr || !adminUser) {
      // Sign out unauthorized user session and redirect to login
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'unauthorized');
      return redirectResponse(url);
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
      url.pathname = '/admin';
      return redirectResponse(url);
    }
  }

  return supabaseResponse;
}

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { createAdminClient } from './admin';

function logQueryError(queryName: string, error: any) {
  const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
  if (msg.includes('Invalid API key') || msg.includes('JWT') || msg.includes('apikey') || msg.includes('supabaseKey')) {
    console.error(
      `[SEED cache] Error fetching ${queryName}: Invalid or missing Supabase API key. ` +
      `Verify NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in deployment settings.`
    );
  } else {
    console.error(`[SEED cache] Error fetching ${queryName}:`, msg);
  }
}

// 1. Unread inquiries count (cached with short TTL for responsive admin navigation)
export const getUnreadInquiriesCount = cache(
  unstable_cache(
    async () => {
      try {
        const adminClient = createAdminClient();
        const { count, error } = await adminClient
          .from('contact_inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        if (error) {
          logQueryError('unread inquiries count', error);
          return 0;
        }
        return count || 0;
      } catch (err: any) {
        logQueryError('unread inquiries count', err);
        return 0;
      }
    },
    ['unread-inquiries-count'],
    { revalidate: 30, tags: ['inquiries'] }
  )
);

// 2. Dashboard main statistics
export const getDashboardStats = cache(
  unstable_cache(
    async () => {
      try {
        const adminClient = createAdminClient();
        const [
          { count: totalProjects, error: errProjects },
          { count: totalImages, error: errImages },
          { count: totalInquiries, error: errInquiries }
        ] = await Promise.all([
          adminClient.from('projects').select('*', { count: 'exact', head: true }),
          adminClient.from('project_images').select('*', { count: 'exact', head: true }),
          adminClient.from('contact_inquiries').select('*', { count: 'exact', head: true })
        ]);

        if (errProjects) logQueryError('dashboard totalProjects', errProjects);
        if (errImages) logQueryError('dashboard totalImages', errImages);
        if (errInquiries) logQueryError('dashboard totalInquiries', errInquiries);

        return {
          totalProjects: totalProjects || 0,
          totalImages: totalImages || 0,
          totalInquiries: totalInquiries || 0
        };
      } catch (err: any) {
        logQueryError('dashboard stats', err);
        return {
          totalProjects: 0,
          totalImages: 0,
          totalInquiries: 0
        };
      }
    },
    ['dashboard-stats'],
    { revalidate: 60, tags: ['stats', 'projects', 'inquiries'] }
  )
);

// 3. Recent projects (5 items)
export const getRecentProjects = cache(
  unstable_cache(
    async () => {
      try {
        const adminClient = createAdminClient();
        const { data, error } = await adminClient
          .from('projects')
          .select(`
            id,
            title,
            slug,
            division,
            client_sector,
            created_at,
            project_images (
              id,
              image_url,
              storage_path,
              display_order,
              is_cover
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          logQueryError('recent projects', error);
          return [];
        }
        return (data || []).map((p: any) => ({
          ...p,
          project_images: (p.project_images || []).sort(
            (a: any, b: any) => (a.display_order ?? 999) - (b.display_order ?? 999)
          ),
        }));
      } catch (err: any) {
        logQueryError('recent projects', err);
        return [];
      }
    },
    ['recent-projects'],
    { revalidate: 60, tags: ['projects'] }
  )
);

// 4. Recent inquiries (5 items)
export const getRecentInquiries = cache(
  async () => {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        logQueryError('recent inquiries', error);
        return [];
      }
      return data || [];
    } catch (err: any) {
      logQueryError('recent inquiries', err);
      return [];
    }
  }
);

// 5. All projects (for projects list page)
export const getAllProjectsCached = cache(
  unstable_cache(
    async () => {
      try {
        const adminClient = createAdminClient();
        const { data, error } = await adminClient
          .from('projects')
          .select(`
            *,
            project_images (
              id,
              image_url,
              storage_path,
              display_order,
              is_cover
            )
          `)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) {
          logQueryError('all projects', error);
          return [];
        }
        return (data || []).map((p: any) => ({
          ...p,
          project_images: (p.project_images || []).sort(
            (a: any, b: any) => (a.display_order ?? 999) - (b.display_order ?? 999)
          ),
        }));
      } catch (err: any) {
        logQueryError('all projects', err);
        return [];
      }
    },
    ['all-projects-list'],
    { revalidate: 60, tags: ['projects'] }
  )
);

// 6. All inquiries (for inquiries list page)
export const getAllInquiriesCached = cache(
  async () => {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logQueryError('all inquiries', error);
        return [];
      }
      return data || [];
    } catch (err: any) {
      logQueryError('all inquiries', err);
      return [];
    }
  }
);

// 7. All vacancies (for admin dashboard) - SUPABASE IS 100% SINGLE SOURCE OF TRUTH
export const getAllVacanciesCached = cache(
  async () => {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('vacancies')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        logQueryError('all vacancies', error);
        return [];
      }
      return data || [];
    } catch (err: any) {
      logQueryError('all vacancies', err);
      return [];
    }
  }
);

// 8. Active vacancies (for public Careers page) - SUPABASE IS 100% SINGLE SOURCE OF TRUTH
export const getActiveVacanciesCached = cache(
  async () => {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('vacancies')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        logQueryError('active vacancies', error);
        return [];
      }
      return data || [];
    } catch (err: any) {
      logQueryError('active vacancies', err);
      return [];
    }
  }
);

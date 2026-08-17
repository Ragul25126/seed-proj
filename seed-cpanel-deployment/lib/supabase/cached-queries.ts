import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { createAdminClient } from './admin';

// 1. Unread inquiries count (React cache for per-request memoization, next/cache for cross-request caching)
export const getUnreadInquiriesCount = cache(
  unstable_cache(
    async () => {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('contact_inquiries')
        .select('id')
        .eq('status', 'new');

      if (error) {
        console.error('[SEED cache] Error fetching unread inquiries count:', error.message);
        return 0;
      }
      return data?.length || 0;
    },
    ['unread-inquiries-count'],
    { revalidate: 60, tags: ['inquiries'] }
  )
);

// 2. Dashboard main statistics
export const getDashboardStats = cache(
  unstable_cache(
    async () => {
      const adminClient = createAdminClient();
      const [
        { count: totalProjects },
        { count: totalImages },
        { count: totalInquiries }
      ] = await Promise.all([
        adminClient.from('projects').select('*', { count: 'exact', head: true }),
        adminClient.from('project_images').select('*', { count: 'exact', head: true }),
        adminClient.from('contact_inquiries').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalProjects: totalProjects || 0,
        totalImages: totalImages || 0,
        totalInquiries: totalInquiries || 0
      };
    },
    ['dashboard-stats'],
    { revalidate: 60, tags: ['stats', 'projects', 'inquiries'] }
  )
);

// 3. Recent projects (5 items)
export const getRecentProjects = cache(
  unstable_cache(
    async () => {
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
            image_url,
            is_cover
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('[SEED cache] Error fetching recent projects:', error.message);
        return [];
      }
      return data || [];
    },
    ['recent-projects'],
    { revalidate: 60, tags: ['projects'] }
  )
);

// 4. Recent inquiries (5 items)
export const getRecentInquiries = cache(
  unstable_cache(
    async () => {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('[SEED cache] Error fetching recent inquiries:', error.message);
        return [];
      }
      return data || [];
    },
    ['recent-inquiries'],
    { revalidate: 60, tags: ['inquiries'] }
  )
);

// 5. All projects (for projects list page)
export const getAllProjectsCached = cache(
  unstable_cache(
    async () => {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('projects')
        .select(`
          *,
          project_images (
            id,
            image_url,
            is_cover
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SEED cache] Error fetching all projects:', error.message);
        return [];
      }
      return data || [];
    },
    ['all-projects-list'],
    { revalidate: 60, tags: ['projects'] }
  )
);

// 6. All inquiries (for inquiries list page)
export const getAllInquiriesCached = cache(
  unstable_cache(
    async () => {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SEED cache] Error fetching all inquiries:', error.message);
        return [];
      }
      return data || [];
    },
    ['all-inquiries-list'],
    { revalidate: 60, tags: ['inquiries'] }
  )
);

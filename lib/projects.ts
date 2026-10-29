import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import dns from 'dns';

// Force Node.js to prefer IPv4 DNS resolution to avoid NAT64/IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore fallback issues
}

/**
 * Retry wrapper for flaky network calls (e.g. transient DNS or fetch timeouts).
 */
async function retryQuery<T>(fn: () => PromiseLike<T>, retries = 2, delay = 400): Promise<T> {
  let lastResult: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await fn();
      lastResult = result;
      if (result && typeof result === 'object' && 'error' in result) {
        const errorVal = (result as any).error;
        if (errorVal && (
          errorVal.message === 'TypeError: fetch failed' ||
          errorVal.message?.includes('fetch failed') ||
          errorVal.message?.includes('FetchError') ||
          errorVal.message?.includes('timeout') ||
          errorVal.message?.includes('ECONNRESET') ||
          errorVal.message?.includes('ETIMEDOUT')
        )) {
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, delay * attempt));
            continue;
          }
        }
      }
      return result;
    } catch (err: any) {
      lastResult = { error: err };
      if (
        err.message === 'TypeError: fetch failed' ||
        err.message?.includes('fetch failed') ||
        err.message?.includes('FetchError') ||
        err.message?.includes('timeout') ||
        err.message?.includes('ECONNRESET') ||
        err.message?.includes('ETIMEDOUT')
      ) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delay * attempt));
          continue;
        }
      }
      throw err;
    }
  }
  return lastResult;
}


export interface Project {
  id: string;
  slug: string;
  title: string;
  client?: string;
  architect?: string;
  services?: string;
  area?: string;
  sector?: string;
  clientSector?: string;
  client_sector?: string;
  projectScale?: string;
  project_scale?: string;
  division?: string;
  location: string;
  description?: string;
  short_description?: string;
  full_description?: string;
  image: string;
  images: string[];
  [key: string]: any;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  location: string;
  sector?: string;
  client_sector?: string;
  clientSector?: string;
  client?: string;
  architect?: string;
  services?: string;
  area?: string;
  division?: string;
  project_scale?: string;
  projectScale?: string;
  description?: string;
  short_description?: string;
  image: string;
  imageCount: number;
}


/**
 * Public Supabase client for reading cached public project data.
 * Does not read cookies, ensuring 100% compatibility with Next.js unstable_cache.
 */
function getPublicClient() {
  const rawUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'apvkdnofstyyidcmuczb'
  ).trim();

  // ONLY public anon or publishable keys — NEVER privileged service-role or secret keys
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  if (!anonKey) {
    throw new Error(
      '[SEED Supabase] Missing public Supabase credentials. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is configured in deployment environment variables.'
    );
  }

  const formattedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

  return createSupabaseClient(formattedUrl, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Sort project_images by display_order ascending.
 * Images without a display_order (null/undefined) go to the end.
 */
function sortImages(imgs: any[]): any[] {
  return [...imgs].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    const aOrder = a.display_order ?? Infinity;
    const bOrder = b.display_order ?? Infinity;
    return aOrder - bOrder;
  });
}

/**
 * Pick the best cover URL from an image list:
 * 1. First image flagged is_cover = true
 * 2. Fall back to the first image in display_order
 */
function pickCoverUrl(imgs: any[]): string | null {
  if (!imgs || imgs.length === 0) return null;
  const cover = imgs.find((img) => img.is_cover);
  const first = imgs[0];
  const src = cover || first;
  return src ? (src.image_url || src.storage_path || null) : null;
}

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient();

      // Fetch project with images ordered by display_order at the DB level
      let { data: project, error } = await retryQuery(() =>
        supabase
          .from('projects')
          .select(`
            *,
            project_images (
              id,
              image_url,
              storage_path,
              alt_text,
              display_order,
              is_cover
            )
          `)
          .eq('slug', slug)
          .maybeSingle()
      );

      if (error && error.code !== 'PGRST116') {
        console.error(`[SEED Supabase] Error fetching project by slug "${slug}":`, error.message);
        throw new Error(`[SEED Supabase] Database query failed for project "${slug}": ${error.message}`);
      }

      if (!project) {
        const { data: fallback, error: fallbackError } = await retryQuery(() =>
          supabase
            .from('projects')
            .select(`
              *,
              project_images (
                id,
                image_url,
                storage_path,
                alt_text,
                display_order,
                is_cover
              )
            `)
            .ilike('slug', slug)
            .maybeSingle()
        );

        if (fallbackError && fallbackError.code !== 'PGRST116') {
          console.error(`[SEED Supabase] Error fetching fallback project "${slug}":`, fallbackError.message);
          throw new Error(`[SEED Supabase] Database fallback query failed: ${fallbackError.message}`);
        }
        project = fallback;
      }

      if (!project) return null;

      const imgs = sortImages(project.project_images || []);
      const coverUrl = pickCoverUrl(imgs);
      const validImages: string[] = imgs
        .map((img: any) => img.image_url || img.storage_path)
        .filter((s): s is string => typeof s === 'string' && s.length > 0);

      return {
        ...project,
        id: project.id || '',
        location: project.location || '',
        clientSector: project.client_sector,
        projectScale: project.project_scale,
        description: project.short_description || project.description || '',
        short_description: project.short_description || project.description || '',
        full_description: project.full_description || '',
        // image array used by gallery — Supabase-only, ordered by display_order
        images: validImages,
        // cover thumbnail — Supabase project_images is single source of truth; null/empty when deleted
        image: coverUrl || '',
      };
    },
    ['project-by-slug', slug],
    { revalidate: 300, tags: ['projects', `project-${slug}`] }
  )();
});

export const getAllProjects = cache(
  unstable_cache(
    async (): Promise<Project[]> => {
      const supabase = getPublicClient();

      // Fetch all projects with their images.
      // Project ordering is controlled by display_order on the projects table (existing).
      // We do NOT change the project ordering here.
      const { data: projects, error } = await retryQuery(() =>
        supabase
          .from('projects')
          .select(`
            *,
            project_images (
              id,
              image_url,
              storage_path,
              alt_text,
              display_order,
              is_cover
            )
          `)
          .order('display_order', { ascending: true })
      );

      if (error) {
        console.error('[SEED Supabase] Error fetching all projects:', error.message);
        throw new Error(`[SEED Supabase] Failed to fetch projects catalogue: ${error.message}`);
      }

      if (!projects) return [];

      return projects.map((p: any) => {
        const imgs = sortImages(p.project_images || []);
        const coverUrl = pickCoverUrl(imgs);
        const validImages: string[] = imgs
          .map((img: any) => img.image_url || img.storage_path)
          .filter((s): s is string => typeof s === 'string' && s.length > 0);
        return {
          ...p,
          id: p.id || '',
          location: p.location || '',
          clientSector: p.client_sector,
          projectScale: p.project_scale,
          description: p.short_description || p.description || '',
          short_description: p.short_description || p.description || '',
          full_description: p.full_description || '',
          // image array — Supabase-only, ordered by display_order
          images: validImages,
          // cover thumbnail — Supabase project_images is single source of truth; null/empty when deleted
          image: coverUrl || '',
        };
      });
    },
    ['all-projects-public'],
    { revalidate: 300, tags: ['projects', 'all-projects-list'] }
  )
);

/**
 * Lightweight project summary for public listing pages (/projects).
 * Strips full descriptions and secondary gallery URLs to keep initial RSC payload small.
 * Orders strictly by display_order ascending.
 */
export const getProjectsSummary = cache(
  unstable_cache(
    async (): Promise<ProjectSummary[]> => {
      const supabase = getPublicClient();

      const { data: projects, error } = await retryQuery(() =>
        supabase
          .from('projects')
          .select(`
            id,
            slug,
            title,
            location,
            sector,
            client_sector,
            division,
            client,
            architect,
            services,
            area,
            project_scale,
            short_description,
            display_order,
            project_images (
              id,
              image_url,
              storage_path,
              display_order,
              is_cover
            )
          `)
          .order('display_order', { ascending: true })
      );

      if (error) {
        console.error('[SEED Supabase] Error fetching project summaries:', error.message);
        throw new Error(`[SEED Supabase] Failed to fetch project summaries catalogue: ${error.message}`);
      }

      if (!projects) return [];

      return projects.map((p: any) => {
        const imgs = sortImages(p.project_images || []);
        const coverUrl = pickCoverUrl(imgs);
        return {
          id: p.id || '',
          slug: p.slug,
          title: p.title,
          location: p.location || '',
          sector: p.sector || '',
          client_sector: p.client_sector || '',
          clientSector: p.client_sector || '',
          client: p.client || '',
          architect: p.architect || '',
          services: p.services || '',
          area: p.area || '',
          division: p.division || '',
          project_scale: p.project_scale || '',
          projectScale: p.project_scale || '',
          description: p.short_description || '',
          short_description: p.short_description || '',
          image: coverUrl || '',
          imageCount: imgs.length,
        };
      });
    },
    ['projects-summary-public'],
    { revalidate: 300, tags: ['projects', 'projects-summary', 'all-projects-list'] }
  )
);



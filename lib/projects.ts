import { createClient } from './supabase/server';

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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();

  // Fetch project with images ordered by display_order at the DB level
  let { data: project, error } = await supabase
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
    .maybeSingle();

  if (!project) {
    const { data: fallback } = await supabase
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
      .ilike('slug', `${slug}%`)
      .maybeSingle();
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
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createClient();

  // Fetch all projects with their images.
  // Project ordering is controlled by display_order on the projects table (existing).
  // We do NOT change the project ordering here.
  const { data: projects, error } = await supabase
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
    .order('display_order', { ascending: true });

  if (error || !projects) return [];

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
}

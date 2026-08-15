import { createClient } from './supabase/server';

/**
 * Sort project_images by display_order ascending.
 * Images without a display_order (null/undefined) go to the end.
 */
function sortImages(imgs: any[]): any[] {
  return [...imgs].sort((a, b) => {
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
  const cover = imgs.find((img) => img.is_cover);
  const first = imgs[0];
  const src = cover || first;
  return src ? (src.image_url || src.storage_path || null) : null;
}

export async function getProjectBySlug(slug: string) {
  const supabase = createClient();

  // Fetch project with images ordered by display_order at the DB level
  const { data: project, error } = await supabase
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
    .single();

  if (error || !project) return null;

  const imgs = sortImages(project.project_images || []);
  const coverUrl = pickCoverUrl(imgs);

  return {
    ...project,
    clientSector: project.client_sector,
    projectScale: project.project_scale,
    description: project.full_description || project.description || '',
    // image array used by gallery — Supabase-only, ordered by display_order
    images: imgs.map((img: any) => img.image_url || img.storage_path).filter(Boolean),
    // cover thumbnail — prefer is_cover flag, then fall back to project.image
    image: coverUrl || project.image || null,
  };
}

export async function getAllProjects() {
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
    return {
      ...p,
      clientSector: p.client_sector,
      projectScale: p.project_scale,
      description: p.full_description || p.description || '',
      // image array — Supabase-only, ordered by display_order
      images: imgs.map((img: any) => img.image_url || img.storage_path).filter(Boolean),
      // cover thumbnail
      image: coverUrl || p.image || null,
    };
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/project-images?slug=some-project-slug
 *
 * Returns the current image URLs for the given project from Supabase,
 * ordered by display_order ascending (is_cover first is handled client-side).
 *
 * Used by the public project modal on /projects to always show the
 * latest images from Supabase instead of the hardcoded portfolio array.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const supabase = createClient();

  // 1. Find the project by slug
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('id, image')
    .eq('slug', slug)
    .single();

  if (projErr || !project) {
    return NextResponse.json({ images: [], coverImage: null });
  }

  // 2. Fetch its images ordered by display_order
  const { data: imgRows, error: imgErr } = await supabase
    .from('project_images')
    .select('id, image_url, storage_path, is_cover, display_order')
    .eq('project_id', project.id)
    .order('display_order', { ascending: true });

  if (imgErr) {
    return NextResponse.json({ error: imgErr.message }, { status: 500 });
  }

  const rows = imgRows || [];

  // Sort: cover image first, then by display_order
  rows.sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return (a.display_order ?? 999) - (b.display_order ?? 999);
  });

  const images = rows
    .map((img) => img.image_url || img.storage_path)
    .filter(Boolean) as string[];

  const coverImage =
    rows.find((img) => img.is_cover)?.image_url ||
    rows.find((img) => img.is_cover)?.storage_path ||
    images[0] ||
    project.image ||
    null;

  return NextResponse.json({ images, coverImage });
}

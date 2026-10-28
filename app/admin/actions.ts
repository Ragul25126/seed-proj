'use server';

import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient as createServerClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import dns from 'dns';

// Force Node.js to prefer IPv4 DNS resolution to avoid NAT64/IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) { }

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Revalidate every public and admin route that shows project data.
 * IMPORTANT: busts Next.js cache so layout and project order reflect DB immediately.
 */
function revalidateProjectRoutes(slug?: string) {
  if (slug) {
    revalidatePath(`/projects/${slug}`);
    revalidatePath(`/projects/${slug}`, 'page');
    revalidatePath(`/view/${slug}`);
    revalidatePath(`/view/${slug}`, 'page');
    revalidatePath(`/project/${slug}`);
    revalidatePath(`/project/${slug}`, 'page');
  }
  revalidatePath('/projects');
  revalidatePath('/projects', 'page');
  revalidatePath('/pool/projects');
  revalidatePath('/pool/projects', 'page');
  revalidatePath('/mep/projects');
  revalidatePath('/mep/projects', 'page');
  revalidatePath('/');
  revalidatePath('/', 'page');
  revalidatePath('/admin/dashboard/projects');
  revalidatePath('/admin/dashboard/projects', 'page');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard', 'page');
  revalidatePath('/api/project-images');
  revalidateTag('projects');
  revalidateTag('all-projects-list');
  revalidateTag('projects-summary');
  revalidateTag('recent-projects');
  revalidateTag('stats');
  revalidateTag('dashboard-stats');
}

/**
 * Retry wrapper for flaky Supabase network calls.
 * Retries only on network-level errors (fetch failed / timeout).
 */
async function retrySupabase<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
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
            await new Promise(r => setTimeout(r, delay * attempt));
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
          await new Promise(r => setTimeout(r, delay * attempt));
          continue;
        }
      }
      throw err;
    }
  }
  return lastResult;
}

/** Authenticate the incoming request and verify admin privileges. */
async function verifyAdmin() {
  const supabase = createServerClient();
  const { data: { user }, error: authErr } = (await retrySupabase(async () =>
    await supabase.auth.getUser()
  )) as any;

  if (authErr || !user) {
    throw new Error('Unauthorized: Session expired or invalid');
  }

  const adminClient = createAdminClient();

  const { data: adminUser, error: checkErr } = (await retrySupabase(async () =>
    await adminClient
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
  )) as any;

  let isAuthorizedAdmin = !!adminUser;

  if (!isAuthorizedAdmin) {
    const { data: fallbackUser } = (await retrySupabase(async () =>
      await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()
    )) as any;

    if (fallbackUser) {
      isAuthorizedAdmin = true;
    }
  }

  if (!isAuthorizedAdmin) {
    console.error('Admin check error:', checkErr, 'user.id:', user.id, 'user.email:', user.email);
    throw new Error(
      `Unauthorized: Administrative access restricted. Err: ${checkErr ? checkErr.message : 'No record found'}`
    );
  }

  return user;
}

/**
 * Get the public URL for a storage object.
 * Prefers getPublicUrl (no expiry). Falls back to a signed URL for private buckets.
 */
async function getImageUrl(adminClient: ReturnType<typeof createAdminClient>, storagePath: string): Promise<string> {
  const tenYears = 10 * 365 * 24 * 60 * 60;
  const { data: signedData, error: signedErr } = await retrySupabase(async () =>
    adminClient.storage.from('project-images').createSignedUrl(storagePath, tenYears)
  ) as any;

  if (signedErr || !signedData?.signedUrl) {
    throw new Error(`Cannot generate image URL: ${signedErr?.message || 'unknown'}`);
  }

  return signedData.signedUrl;
}

/**
 * Normalizes all projects' display_order in Supabase into continuous 1-based sequential positions (1, 2, 3...)
 * without gaps or duplicate values.
 *
 * @param adminClient Supabase admin client
 * @param targetId The project ID being created or updated
 * @param targetPosition The desired 1-based exact position (1 = 1st, 2 = 2nd, etc.)
 */
async function syncProjectPositions(
  adminClient: ReturnType<typeof createAdminClient>,
  targetId?: string,
  targetPosition?: number
) {
  // Fetch all existing projects ordered by current display_order ASC, created_at DESC
  const { data: projects, error } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .select('id, display_order')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
  )) as any;

  if (error || !projects) return;

  let list = [...projects];

  if (targetId && typeof targetPosition === 'number') {
    const existingIndex = list.findIndex(p => p.id === targetId);
    let itemToPlace: { id: string; display_order: number };

    if (existingIndex >= 0) {
      itemToPlace = list.splice(existingIndex, 1)[0];
    } else {
      itemToPlace = { id: targetId, display_order: targetPosition };
    }

    // Clamp 1-based targetPosition between 1 and list.length + 1
    const clampedPos = Math.max(1, Math.min(targetPosition, list.length + 1));
    const insertIndex = clampedPos - 1;

    list.splice(insertIndex, 0, itemToPlace);
  }

  // Assign sequential 1-based display_order values (1, 2, 3...)
  const updates: Promise<any>[] = [];
  list.forEach((proj, idx) => {
    const desiredOrder = idx + 1;
    if (proj.display_order !== desiredOrder) {
      updates.push(
        retrySupabase(async () =>
          adminClient
            .from('projects')
            .update({ display_order: desiredOrder })
            .eq('id', proj.id)
        )
      );
    }
  });

  if (updates.length > 0) {
    await Promise.all(updates);
  }
}

// ─── 1. Authentication Actions ───────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createServerClient();
  const { data, error } = (await retrySupabase(async () =>
    await supabase.auth.signInWithPassword({ email, password })
  )) as any;

  if (error) {
    if (error.message?.includes('Invalid API key') || error.message?.includes('apikey')) {
      console.error('[SEED Auth] Login failed: Supabase API key is invalid or not configured on Vercel.');
      return { error: 'Authentication service configuration error. Please verify Supabase environment variables.' };
    }
    return { error: error.message };
  }

  if (data.user) {
    const adminClient = createAdminClient();

    const { data: adminUser, error: checkErr } = (await retrySupabase(async () =>
      await adminClient
        .from('admin_users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()
    )) as any;

    let isAuthorizedAdmin = !!adminUser;

    if (!isAuthorizedAdmin) {
      const { data: fallbackUser } = (await retrySupabase(async () =>
        await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()
      )) as any;

      if (fallbackUser) {
        isAuthorizedAdmin = true;
      }
    }

    if (!isAuthorizedAdmin) {
      await supabase.auth.signOut();
      return { error: 'Unauthorized: Access restricted to administrators.' };
    }
  }

  return { success: true };
}

export async function logoutAction(formData?: FormData): Promise<void> {
  const supabase = createServerClient();
  await supabase.auth.signOut();
}

// ─── 2. Project Actions ──────────────────────────────────────────────────────

export async function createProjectAction(projectData: any) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const cleanSlug = (projectData.slug || '').trim().toLowerCase();
  if (!cleanSlug) {
    return { error: 'Project slug is required.' };
  }

  // Pre-validate slug uniqueness to provide a clear, user-friendly error
  const { data: existingSlug } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle()
  )) as any;

  if (existingSlug) {
    return { error: `A project with the slug "${cleanSlug}" already exists. Please choose a unique slug.` };
  }

  const isOrderProvided =
    projectData.display_order !== undefined &&
    projectData.display_order !== null &&
    String(projectData.display_order).trim() !== '';

  let finalOrder: number;
  let shouldSyncPositions = false;

  if (isOrderProvided) {
    const parsed = Number(projectData.display_order);
    if (!isNaN(parsed) && parsed > 0) {
      finalOrder = Math.floor(parsed);
      shouldSyncPositions = true;
    } else {
      const { data: maxProj } = (await retrySupabase(async () =>
        await adminClient
          .from('projects')
          .select('display_order')
          .not('display_order', 'is', null)
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle()
      )) as any;
      const maxOrder = maxProj && typeof maxProj.display_order === 'number' ? maxProj.display_order : 0;
      finalOrder = maxOrder + 1;
    }
  } else {
    // Empty display order: calculate server-side MAX(display_order) + 1
    const { data: maxProj } = (await retrySupabase(async () =>
      await adminClient
        .from('projects')
        .select('display_order')
        .not('display_order', 'is', null)
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle()
    )) as any;

    const maxOrder = maxProj && typeof maxProj.display_order === 'number' ? maxProj.display_order : 0;
    finalOrder = maxOrder + 1;
  }

  const { data, error } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .insert({
        slug: cleanSlug,
        title: projectData.title,
        division: projectData.division,
        client_sector: projectData.client_sector,
        sector: projectData.sector || null,
        location: projectData.location,
        project_scale: projectData.project_scale,
        client: projectData.client || null,
        architect: projectData.architect || null,
        services: projectData.services || null,
        area: projectData.area || null,
        short_description: projectData.short_description || null,
        full_description: projectData.full_description || null,
        status: projectData.status || 'Completed',
        featured: !!projectData.featured,
        display_order: finalOrder,
        is_published: projectData.is_published !== false,
      })
      .select('id')
      .single()
  )) as any;

  if (error) {
    return { error: error.message };
  }

  // Only re-sequence positions if an explicit valid position was provided
  if (shouldSyncPositions) {
    await syncProjectPositions(adminClient, data.id, finalOrder);
  }

  revalidateProjectRoutes(projectData.slug);
  return { success: true, projectId: data.id };
}

export async function updateProjectAction(projectId: string, projectData: any) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const cleanSlug = (projectData.slug || '').trim().toLowerCase();
  if (!cleanSlug) {
    return { error: 'Project slug is required.' };
  }

  // Pre-validate slug uniqueness against other projects
  const { data: existingSlug } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', projectId)
      .maybeSingle()
  )) as any;

  if (existingSlug) {
    return { error: `A project with the slug "${cleanSlug}" already exists. Please choose a unique slug.` };
  }

  const isOrderProvided =
    projectData.display_order !== undefined &&
    projectData.display_order !== null &&
    String(projectData.display_order).trim() !== '';

  let finalOrder: number;
  let shouldSyncPositions = false;

  if (isOrderProvided) {
    const parsed = Number(projectData.display_order);
    if (!isNaN(parsed) && parsed > 0) {
      finalOrder = Math.floor(parsed);
      shouldSyncPositions = true;
    } else {
      const { data: currProj } = (await retrySupabase(async () =>
        await adminClient.from('projects').select('display_order').eq('id', projectId).single()
      )) as any;
      finalOrder = currProj?.display_order || 1;
    }
  } else {
    const { data: currProj } = (await retrySupabase(async () =>
      await adminClient.from('projects').select('display_order').eq('id', projectId).single()
    )) as any;
    finalOrder = currProj?.display_order || 1;
  }

  const { error } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .update({
        slug: cleanSlug,
        title: projectData.title,
        division: projectData.division,
        client_sector: projectData.client_sector,
        sector: projectData.sector || null,
        location: projectData.location,
        project_scale: projectData.project_scale,
        client: projectData.client || null,
        architect: projectData.architect || null,
        services: projectData.services || null,
        area: projectData.area || null,
        short_description: projectData.short_description || null,
        full_description: projectData.full_description || null,
        status: projectData.status || 'Completed',
        featured: !!projectData.featured,
        display_order: finalOrder,
        is_published: projectData.is_published !== false,
      })
      .eq('id', projectId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  if (shouldSyncPositions) {
    await syncProjectPositions(adminClient, projectId, finalOrder);
  }

  revalidateProjectRoutes(projectData.slug);
  return { success: true };
}

export async function deleteProjectAction(projectId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Get project slug before deletion so we can revalidate
  const { data: project } = (await retrySupabase(async () =>
    await adminClient.from('projects').select('slug').eq('id', projectId).single()
  )) as any;

  // Get all storage paths for this project's images
  const { data: images } = (await retrySupabase(async () =>
    await adminClient
      .from('project_images')
      .select('storage_path')
      .eq('project_id', projectId)
  )) as any;

  if (images && images.length > 0) {
    const paths = (images as any[]).map((img: any) => img.storage_path).filter(Boolean) as string[];
    if (paths.length > 0) {
      try {
        await adminClient.storage.from('project-images').remove(paths);
      } catch (storageErr) {
        console.error('Storage cleanup error during project delete:', storageErr);
      }
    }
  }

  // Delete project
  const { error } = (await retrySupabase(async () =>
    await adminClient.from('projects').delete().eq('id', projectId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  // Normalize remaining project positions after deletion
  await syncProjectPositions(adminClient);

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true };
}

// ─── 3. Image Actions ────────────────────────────────────────────────────────

/**
 * Synchronizes and normalizes project_images for a given project:
 * - Orders images by display_order ASC, created_at ASC.
 * - Re-indexes display_order to sequential 0, 1, 2, ...
 * - Guarantees that the first image (idx === 0) is marked is_cover = true.
 * - Guarantees that all remaining images (idx > 0) are marked is_cover = false.
 * - If no images exist, sets projects.image to null (if column exists).
 * - If images exist, updates projects.image to the first image's URL (if column exists).
 * - Never leaves a deleted image URL as a fallback or cached cover image.
 */
async function syncProjectImages(
  adminClient: ReturnType<typeof createAdminClient>,
  projectId: string
) {
  const { data: rawImages, error } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id, image_url, storage_path, alt_text, display_order, is_cover, created_at')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
  )) as any;

  if (error || !rawImages) {
    console.error('Error fetching images for sync:', error?.message);
    return [];
  }

  const images = (rawImages as any[]) || [];

  if (images.length === 0) {
    // Gracefully handle empty-image state: clear project cover column if present
    try {
      await adminClient.from('projects').update({ image: null }).eq('id', projectId);
    } catch (_) {}
    return [];
  }

  const updates: Promise<any>[] = [];
  const normalized = images.map((img, idx) => {
    const shouldBeCover = idx === 0;
    const shouldOrder = idx;
    const needsUpdate = img.display_order !== shouldOrder || img.is_cover !== shouldBeCover;

    if (needsUpdate) {
      updates.push(
        retrySupabase(async () =>
          adminClient
            .from('project_images')
            .update({ display_order: shouldOrder, is_cover: shouldBeCover })
            .eq('id', img.id)
            .eq('project_id', projectId)
        )
      );
    }

    return {
      ...img,
      display_order: shouldOrder,
      is_cover: shouldBeCover,
    };
  });

  if (updates.length > 0) {
    await Promise.all(updates);
  }

  // Update projects.image with current authoritative cover URL if column exists
  const coverUrl = normalized[0]?.image_url || normalized[0]?.storage_path || null;
  try {
    await adminClient.from('projects').update({ image: coverUrl }).eq('id', projectId);
  } catch (_) {}

  return normalized;
}

/**
 * uploadImageAction
 *
 * Uploads one or multiple files to Supabase Storage, creates project_images rows,
 * and automatically marks the first image in display_order as the cover image.
 */
export async function uploadImageAction(projectId: string, formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const rawFiles = formData.getAll('files').concat(formData.getAll('file'));
  const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { error: 'No file provided' };
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return { error: `File "${file.name}" must be a valid image (JPG, PNG, or WEBP)` };
    }
  }

  // 1. Verify project exists and get its slug
  const { data: project, error: getProjErr } = (await retrySupabase(async () =>
    await adminClient.from('projects').select('id, slug').eq('id', projectId).single()
  )) as any;

  if (getProjErr || !project) {
    return { error: `Project not found (id: ${projectId})` };
  }

  // 2. Determine base display_order for new images
  const { data: maxImg } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('display_order')
      .eq('project_id', projectId)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle()
  )) as any;

  let nextOrder = (maxImg?.display_order ?? -1) + 1;
  const insertedImages: any[] = [];

  // 3. Upload each file in sequence to preserve chosen order
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now() + i;
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^\w-]/g, '_')
      .substring(0, 60);
    const storagePath = `projects/${project.slug}/${timestamp}_${safeName}.${ext}`;

    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch (err: any) {
      return { error: `Failed to read file "${file.name}": ${err.message}` };
    }

    const { error: uploadError } = (await retrySupabase(async () =>
      adminClient.storage
        .from('project-images')
        .upload(storagePath, buffer, { contentType: file.type, upsert: true })
    )) as any;

    if (uploadError) {
      return { error: `Storage upload failed for "${file.name}": ${uploadError.message}` };
    }

    let imageUrl: string;
    try {
      imageUrl = await getImageUrl(adminClient, storagePath);
    } catch (urlErr: any) {
      try { await adminClient.storage.from('project-images').remove([storagePath]); } catch (_) {}
      return { error: `Failed to get image URL for "${file.name}": ${urlErr.message}` };
    }

    const { data: newImg, error: dbError } = (await retrySupabase(async () =>
      adminClient
        .from('project_images')
        .insert({
          project_id: project.id,
          image_url: imageUrl,
          storage_path: storagePath,
          alt_text: `${project.slug} image`,
          display_order: nextOrder + i,
          is_cover: false, // will be resolved deterministically by syncProjectImages
        })
        .select()
        .single()
    )) as any;

    if (dbError) {
      try { await adminClient.storage.from('project-images').remove([storagePath]); } catch (_) {}
      return { error: `Failed to save image record for "${file.name}": ${dbError.message}` };
    }

    insertedImages.push(newImg);
  }

  // 4. Synchronize all images: first image is strictly is_cover = true, all others false
  const syncedImages = await syncProjectImages(adminClient, projectId);

  // 5. Invalidate caches for all public and admin routes
  revalidateProjectRoutes(project.slug);

  return {
    success: true,
    image: insertedImages[0],
    images: insertedImages,
    allImages: syncedImages,
  };
}

/**
 * deleteImageAction
 *
 * Deletes one image identified by its project_images.id.
 * Allows deleting the cover image. When deleted, automatically promotes
 * the first remaining image by display_order as the new cover image.
 * If no images remain, handles the empty-image state gracefully.
 */
export async function deleteImageAction(imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // 1. Look up the image by its own ID
  const { data: img, error: getImgErr } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id, storage_path, is_cover, project_id')
      .eq('id', imageId)
      .single()
  )) as any;

  if (getImgErr || !img) {
    return { error: `Image record not found (id: ${imageId})` };
  }

  // 2. Delete the DB row FIRST (authoritative delete)
  const { error: dbError } = (await retrySupabase(async () =>
    adminClient.from('project_images').delete().eq('id', imageId)
  )) as any;

  if (dbError) {
    return { error: `Database delete failed: ${dbError.message}` };
  }

  // 3. Remove from Storage (best-effort)
  if (img.storage_path) {
    const { error: storageErr } = (await retrySupabase(async () =>
      adminClient.storage.from('project-images').remove([img.storage_path])
    )) as any;

    if (storageErr) {
      console.warn(
        `Storage object "${img.storage_path}" could not be removed after DB delete:`,
        storageErr.message
      );
    }
  }

  // 4. Automatically promote the first remaining image to cover and re-index order
  const remainingImages = await syncProjectImages(adminClient, img.project_id);

  // 5. Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', img.project_id).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return {
    success: true,
    allImages: remainingImages,
  };
}

/**
 * setCoverImageAction
 *
 * Sets an image as the cover image by moving it to the top (display_order = 0)
 * and updating is_cover = true, keeping ordering and cover flags perfectly in sync.
 */
export async function setCoverImageAction(projectId: string, imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Verify the target image belongs to this project
  const { data: targetImg, error: checkErr } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id')
      .eq('id', imageId)
      .eq('project_id', projectId)
      .single()
  )) as any;

  if (checkErr || !targetImg) {
    return { error: 'Image does not belong to this project' };
  }

  // Fetch all images for this project ordered by display_order
  const { data: rawImages } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
  )) as any;

  const images = (rawImages as any[]) || [];
  const otherImages = images.filter(img => img.id !== imageId);
  const reordered = [targetImg, ...otherImages];

  // Update display_order: target image becomes 0, others follow
  const updatePromises = reordered.map((img, idx) =>
    retrySupabase(async () =>
      adminClient
        .from('project_images')
        .update({
          display_order: idx,
          is_cover: idx === 0,
        })
        .eq('id', img.id)
        .eq('project_id', projectId)
    )
  );

  await Promise.all(updatePromises);

  // Sync and ensure consistency
  const syncedImages = await syncProjectImages(adminClient, projectId);

  // Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', projectId).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true, allImages: syncedImages };
}

/**
 * updateImageOrderAction
 *
 * Updates project_images.display_order.
 * The first image in the new order (idx === 0) automatically becomes the cover image (is_cover = true).
 */
export async function updateImageOrderAction(projectId: string, imageIds: string[]) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Verify all image IDs belong to the declared project
  const { data: ownedImages, error: verifyErr } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id')
      .eq('project_id', projectId)
      .in('id', imageIds)
  )) as any;

  if (verifyErr) {
    return { error: `Verification failed: ${verifyErr.message}` };
  }

  const ownedIds = new Set(((ownedImages as any[]) || []).map((r: any) => r.id));
  const invalidIds = imageIds.filter(id => !ownedIds.has(id));
  if (invalidIds.length > 0) {
    return { error: `Image IDs do not belong to this project: ${invalidIds.join(', ')}` };
  }

  // Update display_order and cover flags (first image in list is ALWAYS cover)
  const updatePromises = imageIds.map((id, idx) =>
    retrySupabase(async () =>
      adminClient
        .from('project_images')
        .update({
          display_order: idx,
          is_cover: idx === 0,
        })
        .eq('id', id)
        .eq('project_id', projectId)
    )
  );

  const results = await Promise.all(updatePromises);
  const firstError = results.find((r: any) => r?.error);
  if (firstError) {
    return { error: `Failed to update image order: ${(firstError as any).error.message}` };
  }

  // Guarantee DB-level consistency across all images
  const syncedImages = await syncProjectImages(adminClient, projectId);

  // Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', projectId).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true, allImages: syncedImages };
}

// ─── 4. Inquiry Actions ──────────────────────────────────────────────────────

export async function markInquiryStatusAction(inquiryId: string, status: 'new' | 'read' | 'replied') {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = (await retrySupabase(async () =>
    adminClient.from('contact_inquiries').update({ status }).eq('id', inquiryId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateTag('inquiries');
  return { success: true };
}

export async function deleteInquiryAction(inquiryId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = (await retrySupabase(async () =>
    adminClient.from('contact_inquiries').delete().eq('id', inquiryId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateTag('inquiries');
  return { success: true };
}

// ─── 5. Vacancy Actions ──────────────────────────────────────────────────────

function revalidateVacancyRoutes() {
  revalidatePath('/careers');
  revalidatePath('/admin/dashboard/vacancies');
  revalidateTag('vacancies');
}

const IS_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createVacancyAction(vacancyData: {
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description?: string;
  requirements?: string;
  application_instructions?: string;
  application_email?: string;
  poster_url?: string;
  positions?: any[];
  display_order?: number;
  is_active?: boolean;
}): Promise<{ success?: boolean; error?: string; vacancyId?: string }> {
  await verifyAdmin();
  const adminClient = createAdminClient();

  if (!vacancyData.title || !vacancyData.title.trim()) {
    return { error: 'Job title is required' };
  }

  const payload = {
    title: vacancyData.title.trim(),
    department: vacancyData.department?.trim() || null,
    location: vacancyData.location?.trim() || null,
    employment_type: vacancyData.employment_type?.trim() || 'Full-time',
    description: vacancyData.description?.trim() || null,
    requirements: vacancyData.requirements?.trim() || null,
    application_instructions: vacancyData.application_instructions?.trim() || 'Please send your CV to hr@seedengineering.com',
    application_email: vacancyData.application_email?.trim() || 'hr@seedengineering.com',
    poster_url: vacancyData.poster_url?.trim() || null,
    positions: vacancyData.positions || [],
    display_order: Number(vacancyData.display_order || 0),
    is_active: vacancyData.is_active !== false,
  };

  const { data, error } = (await retrySupabase(async () =>
    adminClient.from('vacancies').insert(payload).select('id').single()
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateVacancyRoutes();
  return { success: true, vacancyId: data.id };
}

export async function updateVacancyAction(vacancyId: string, vacancyData: {
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description?: string;
  requirements?: string;
  application_instructions?: string;
  application_email?: string;
  poster_url?: string;
  positions?: any[];
  display_order?: number;
  is_active?: boolean;
}): Promise<{ success?: boolean; error?: string; vacancyId?: string }> {
  await verifyAdmin();
  const adminClient = createAdminClient();

  if (!vacancyData.title || !vacancyData.title.trim()) {
    return { error: 'Job title is required' };
  }

  const payload = {
    title: vacancyData.title.trim(),
    department: vacancyData.department?.trim() || null,
    location: vacancyData.location?.trim() || null,
    employment_type: vacancyData.employment_type?.trim() || 'Full-time',
    description: vacancyData.description?.trim() || null,
    requirements: vacancyData.requirements?.trim() || null,
    application_instructions: vacancyData.application_instructions?.trim() || 'Please send your CV to hr@seedengineering.com',
    application_email: vacancyData.application_email?.trim() || 'hr@seedengineering.com',
    poster_url: vacancyData.poster_url === '' ? null : (vacancyData.poster_url || null),
    positions: vacancyData.positions || [],
    display_order: Number(vacancyData.display_order || 0),
    is_active: vacancyData.is_active !== false,
    updated_at: new Date().toISOString(),
  };

  if (!IS_UUID_REGEX.test(vacancyId)) {
    return await createVacancyAction(vacancyData);
  }

  const { error } = (await retrySupabase(async () =>
    adminClient.from('vacancies').update(payload).eq('id', vacancyId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateVacancyRoutes();
  return { success: true };
}

export async function toggleVacancyActiveAction(vacancyId: string, isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();
  const adminClient = createAdminClient();

  if (!IS_UUID_REGEX.test(vacancyId)) {
    revalidateVacancyRoutes();
    return { success: true };
  }

  const { error } = (await retrySupabase(async () =>
    adminClient.from('vacancies').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', vacancyId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateVacancyRoutes();
  return { success: true };
}

export async function deleteVacancyAction(vacancyId: string): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();
  const adminClient = createAdminClient();

  if (!IS_UUID_REGEX.test(vacancyId)) {
    revalidateVacancyRoutes();
    return { success: true };
  }

  const { error } = (await retrySupabase(async () =>
    adminClient.from('vacancies').delete().eq('id', vacancyId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateVacancyRoutes();
  return { success: true };
}

export async function uploadVacancyPosterAction(formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No image file provided' };
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Uploaded file must be a valid image (PNG, JPG, WEBP)' };
  }

  const ext = file.name.split('.').pop() || 'png';
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w-]/g, '_')
    .substring(0, 50);
  const storagePath = `vacancies/${timestamp}_${safeName}.${ext}`;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (err: any) {
    return { error: `Failed to read image file: ${err.message}` };
  }

  const { error: uploadError } = (await retrySupabase(async () =>
    adminClient.storage
      .from('project-images')
      .upload(storagePath, buffer, { contentType: file.type, upsert: true })
  )) as any;

  if (uploadError) {
    return { error: `Storage upload failed: ${uploadError.message}` };
  }

  let imageUrl: string;
  try {
    imageUrl = await getImageUrl(adminClient, storagePath);
  } catch (urlErr: any) {
    try { await adminClient.storage.from('project-images').remove([storagePath]); } catch (_) {}
    return { error: `Failed to get image URL: ${urlErr.message}` };
  }

  return { success: true, imageUrl };
}



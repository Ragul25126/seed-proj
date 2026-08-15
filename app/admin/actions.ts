'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import dns from 'dns';

// Force Node.js to prefer IPv4 DNS resolution to avoid NAT64/IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) { }

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Revalidate every public route that shows project data.
 * IMPORTANT: this does NOT change project order – it only busts Next.js cache.
 */
function revalidateProjectRoutes(slug: string) {
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/projects');
  revalidatePath('/pool/projects');
  revalidatePath('/mep/projects');
  revalidatePath('/api/project-images');
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

  if (checkErr || !adminUser) {
    console.error('Admin check error:', checkErr, 'adminUser:', adminUser, 'user.id:', user.id);
    throw new Error(
      `Unauthorized: Administrative access restricted. Err: ${checkErr ? checkErr.message : 'No record found'}`
    );
  }

  return user;
}

/**
 * Get the public URL for a storage object.
 * Prefers getPublicUrl (no expiry). Falls back to a signed URL for private buckets.
 *
 * DOES NOT modify any project ordering.
 */
async function getImageUrl(adminClient: ReturnType<typeof createAdminClient>, storagePath: string): Promise<string> {
  // Try public URL first (works when bucket policy is public)
  const { data: publicData } = adminClient.storage
    .from('project-images')
    .getPublicUrl(storagePath);

  if (publicData?.publicUrl) {
    return publicData.publicUrl;
  }

  // Fall back to a long-lived signed URL (10 years)
  const tenYears = 10 * 365 * 24 * 60 * 60;
  const { data: signedData, error: signedErr } = await retrySupabase(async () =>
    adminClient.storage.from('project-images').createSignedUrl(storagePath, tenYears)
  ) as any;

  if (signedErr || !signedData?.signedUrl) {
    throw new Error(`Cannot generate image URL: ${signedErr?.message || 'unknown'}`);
  }

  return signedData.signedUrl;
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

    if (checkErr || !adminUser) {
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

  const { data, error } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .insert({
        slug: projectData.slug,
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
        display_order: Number(projectData.display_order || 0),
        is_published: projectData.is_published !== false,
      })
      .select('id')
      .single()
  )) as any;

  if (error) {
    return { error: error.message };
  }

  revalidateProjectRoutes(projectData.slug);
  return { success: true, projectId: data.id };
}

export async function updateProjectAction(projectId: string, projectData: any) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = (await retrySupabase(async () =>
    await adminClient
      .from('projects')
      .update({
        slug: projectData.slug,
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
        display_order: Number(projectData.display_order || 0),
        is_published: projectData.is_published !== false,
      })
      .eq('id', projectId)
  )) as any;

  if (error) {
    return { error: error.message };
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
      // Attempt storage cleanup; don't fail the whole operation if this has issues
      try {
        await adminClient.storage.from('project-images').remove(paths);
      } catch (storageErr) {
        console.error('Storage cleanup error during project delete:', storageErr);
      }
    }
  }

  // Delete project (cascades to project_images via DB FK if configured, otherwise rows
  // were already soft-deleted via Storage cleanup above; the DB row delete is authoritative)
  const { error } = (await retrySupabase(async () =>
    await adminClient.from('projects').delete().eq('id', projectId)
  )) as any;

  if (error) {
    return { error: error.message };
  }

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true };
}

// ─── 3. Image Actions ────────────────────────────────────────────────────────

/**
 * uploadImageAction
 *
 * Uploads a file to Supabase Storage, then creates a project_images row.
 * Uses the project's ACTUAL UUID as project_id – NEVER an array index or display_order.
 * Does NOT touch projects.display_order.
 */
export async function uploadImageAction(projectId: string, formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Uploaded file must be a valid image' };
  }

  // 1. Verify project exists and get its slug
  const { data: project, error: getProjErr } = (await retrySupabase(async () =>
    await adminClient.from('projects').select('id, slug').eq('id', projectId).single()
  )) as any;

  if (getProjErr || !project) {
    return { error: `Project not found (id: ${projectId})` };
  }

  // 2. Build a unique storage path
  const ext = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, '')   // strip extension
    .replace(/[^\w-]/g, '_')   // sanitise
    .substring(0, 60);         // truncate
  const storagePath = `projects/${project.slug}/${timestamp}_${safeName}.${ext}`;

  // 3. Read file into buffer
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (err: any) {
    return { error: `Failed to read file: ${err.message}` };
  }

  // 4. Upload to Storage
  const { error: uploadError } = (await retrySupabase(async () =>
    adminClient.storage
      .from('project-images')
      .upload(storagePath, buffer, { contentType: file.type, upsert: true })
  )) as any;

  if (uploadError) {
    return { error: `Storage upload failed: ${uploadError.message}` };
  }

  // 5. Get the accessible image URL (public URL preferred; signed URL as fallback)
  let imageUrl: string;
  try {
    imageUrl = await getImageUrl(adminClient, storagePath);
  } catch (urlErr: any) {
    // Clean up the orphaned storage file
    try { await adminClient.storage.from('project-images').remove([storagePath]); } catch (_) {}
    return { error: `Failed to get image URL: ${urlErr.message}` };
  }

  // 6. Determine the next display_order for images in this project
  const { data: maxImg } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('display_order')
      .eq('project_id', projectId)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle()
  )) as any;

  const nextOrder = (maxImg?.display_order ?? -1) + 1;

  // 7. Check if this project already has a cover image
  const { data: existingCover } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .select('id')
      .eq('project_id', projectId)
      .eq('is_cover', true)
      .maybeSingle()
  )) as any;

  const isCover = !existingCover; // first image uploaded becomes cover

  // 8. Insert into project_images
  //    CRITICAL: project_id = actual project UUID, NEVER an index or display_order
  const { data: newImg, error: dbError } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .insert({
        project_id: project.id,   // ← the project's actual UUID
        image_url: imageUrl,
        storage_path: storagePath,
        alt_text: `${project.slug} image`,
        display_order: nextOrder,
        is_cover: isCover,
      })
      .select()
      .single()
  )) as any;

  if (dbError) {
    // Storage upload succeeded but DB insert failed → clean up orphaned storage file
    console.error('DB insert failed after storage upload – cleaning up storage:', dbError.message);
    try { await adminClient.storage.from('project-images').remove([storagePath]); } catch (_) {}
    return { error: `Failed to save image record: ${dbError.message}` };
  }

  revalidateProjectRoutes(project.slug);

  return { success: true, image: newImg };
}

/**
 * deleteImageAction
 *
 * Deletes one image identified by its project_images.id.
 * Removes the DB row first, then the Storage object.
 * NEVER modifies projects.display_order.
 */
export async function deleteImageAction(imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // 1. Look up the image by its own ID – NOT by URL or index
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

  // 2. Prevent deleting a cover image when others exist (UI should reassign cover first)
  if (img.is_cover) {
    const { count } = (await retrySupabase(async () =>
      adminClient
        .from('project_images')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', img.project_id)
    )) as any;

    if (count && count > 1) {
      return {
        error: 'Cannot delete the cover image while other images exist. Please set another image as cover first.',
      };
    }
  }

  // 3. Delete the DB row FIRST (authoritative delete)
  const { error: dbError } = (await retrySupabase(async () =>
    adminClient.from('project_images').delete().eq('id', imageId)
  )) as any;

  if (dbError) {
    return { error: `Database delete failed: ${dbError.message}` };
  }

  // 4. Now remove from Storage (best-effort — DB row is already gone)
  if (img.storage_path) {
    const { error: storageErr } = (await retrySupabase(async () =>
      adminClient.storage.from('project-images').remove([img.storage_path])
    )) as any;

    if (storageErr) {
      // Log the issue but don't fail — the DB row is already deleted, which is the source of truth
      console.warn(
        `Storage object "${img.storage_path}" could not be removed after DB delete:`,
        storageErr.message
      );
    }
  }

  // 5. Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', img.project_id).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true };
}

/**
 * setCoverImageAction
 *
 * Updates is_cover on project_images for ONE project.
 * NEVER touches projects.display_order.
 */
export async function setCoverImageAction(projectId: string, imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Verify the target image actually belongs to this project
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

  // Unset all covers for this project
  const { error: unsetErr } = (await retrySupabase(async () =>
    adminClient
      .from('project_images')
      .update({ is_cover: false })
      .eq('project_id', projectId)
  )) as any;

  if (unsetErr) {
    return { error: `Failed to unset existing covers: ${unsetErr.message}` };
  }

  // Set the selected image as cover
  const { error: setErr } = (await retrySupabase(async () =>
    adminClient.from('project_images').update({ is_cover: true }).eq('id', imageId)
  )) as any;

  if (setErr) {
    return { error: `Failed to set cover image: ${setErr.message}` };
  }

  // Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', projectId).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true };
}

/**
 * updateImageOrderAction
 *
 * Updates project_images.display_order only – NEVER projects.display_order.
 * Each imageId must belong to the given projectId to prevent cross-project mutations.
 */
export async function updateImageOrderAction(projectId: string, imageIds: string[]) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Verify all image IDs belong to the declared project before mutating anything
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

  const ownedIds = new Set((ownedImages as any[] || []).map((r: any) => r.id));
  const invalidIds = imageIds.filter(id => !ownedIds.has(id));
  if (invalidIds.length > 0) {
    return { error: `Image IDs do not belong to this project: ${invalidIds.join(', ')}` };
  }

  // Update display_order for each image – only project_images, never projects
  const updatePromises = imageIds.map((id, idx) =>
    retrySupabase(async () =>
      adminClient
        .from('project_images')
        .update({ display_order: idx })
        .eq('id', id)
        .eq('project_id', projectId) // extra safety: scoped to this project only
    )
  );

  const results = await Promise.all(updatePromises);
  const firstError = results.find((r: any) => r?.error);
  if (firstError) {
    return { error: `Failed to update image order: ${(firstError as any).error.message}` };
  }

  // Get project slug for revalidation
  const { data: project } = (await retrySupabase(async () =>
    adminClient.from('projects').select('slug').eq('id', projectId).single()
  )) as any;

  if (project) {
    revalidateProjectRoutes(project.slug);
  }

  return { success: true };
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

  return { success: true };
}

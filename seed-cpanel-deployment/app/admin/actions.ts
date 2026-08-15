'use server';

import { cookies } from 'next/headers';
import { createClient as createServerClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';

// Helper to authenticate actions and check admin privileges
async function verifyAdmin() {
  const supabase = createServerClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  
  if (authErr || !user) {
    throw new Error('Unauthorized: Session expired or invalid');
  }

  // Verify against public.admin_users
  const { data: adminUser, error: checkErr } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (checkErr || !adminUser) {
    throw new Error('Unauthorized: Administrative access restricted');
  }

  return user;
}

// 1. Authentication Actions
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Verify admin_users membership
    const { data: adminUser, error: checkErr } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

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

// 2. Project Actions
export async function createProjectAction(projectData: any) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
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
      is_published: projectData.is_published !== false
    })
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, projectId: data.id };
}

export async function updateProjectAction(projectId: string, projectData: any) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
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
      is_published: projectData.is_published !== false
    })
    .eq('id', projectId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteProjectAction(projectId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // 1. Get all images for this project to delete files from Storage
  const { data: images, error: getImgsErr } = await adminClient
    .from('project_images')
    .select('storage_path')
    .eq('project_id', projectId);

  if (!getImgsErr && images && images.length > 0) {
    const paths = images.map(img => img.storage_path).filter(Boolean) as string[];
    if (paths.length > 0) {
      await adminClient.storage.from('project-images').remove(paths);
    }
  }

  // 2. Delete project from DB (cascades database project_images deletions)
  const { error } = await adminClient
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// 3. Image Actions
export async function uploadImageAction(projectId: string, formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  // Verify file type is an image
  if (!file.type.startsWith('image/')) {
    return { error: 'Uploaded file must be a valid image' };
  }

  // Get project slug to build storage folder
  const { data: project, error: getProjErr } = await adminClient
    .from('projects')
    .select('slug')
    .eq('id', projectId)
    .single();

  if (getProjErr || !project) {
    return { error: 'Project not found' };
  }

  // Sanitize filename
  const filename = file.name;
  const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');
  const storagePath = `projects/${project.slug}/${sanitizedFilename}`;

  // Read file into buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Supabase Storage
  const { error: uploadError } = await adminClient.storage
    .from('project-images')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true
    });

  if (uploadError) {
    return { error: `Storage upload failed: ${uploadError.message}` };
  }

  console.log(`Successfully uploaded "${filename}" to storage path: ${storagePath}`);

  // Generate 10-year signed URL
  const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;
  const { data: signedData, error: signedUrlError } = await adminClient.storage
    .from('project-images')
    .createSignedUrl(storagePath, tenYearsInSeconds);

  if (signedUrlError || !signedData) {
    return { error: `Failed to generate signed URL: ${signedUrlError?.message}` };
  }

  // Find max display_order
  const { data: maxImg } = await adminClient
    .from('project_images')
    .select('display_order')
    .eq('project_id', projectId)
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = maxImg ? maxImg.display_order + 1 : 0;

  // Check if project has any cover images
  const { data: coverCheck } = await adminClient
    .from('project_images')
    .select('id')
    .eq('project_id', projectId)
    .eq('is_cover', true)
    .maybeSingle();

  const isCover = !coverCheck; // Make cover if it's the first image uploaded

  // Insert DB record
  const { error: dbError } = await adminClient
    .from('project_images')
    .insert({
      project_id: projectId,
      image_url: signedData.signedUrl,
      storage_path: storagePath,
      alt_text: `${project.slug} render`,
      display_order: nextOrder,
      is_cover: isCover
    });

  if (dbError) {
    return { error: `Failed to save image record: ${dbError.message}` };
  }

  return { success: true };
}

export async function deleteImageAction(imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Get image details
  const { data: img, error: getImgErr } = await adminClient
    .from('project_images')
    .select('storage_path, is_cover, project_id')
    .eq('id', imageId)
    .single();

  if (getImgErr || !img) {
    return { error: 'Image record not found' };
  }

  // Prevent deletion if it's the cover image, and there are other images
  if (img.is_cover) {
    const { count } = await adminClient
      .from('project_images')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', img.project_id);

    if (count && count > 1) {
      return { error: 'Cannot delete the cover image. Please select another image as cover first.' };
    }
  }

  // Remove from Storage
  if (img.storage_path) {
    await adminClient.storage.from('project-images').remove([img.storage_path]);
  }

  // Delete DB record
  const { error: dbError } = await adminClient
    .from('project_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    return { error: dbError.message };
  }

  return { success: true };
}

export async function setCoverImageAction(projectId: string, imageId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Unset all covers for this project
  const { error: unsetErr } = await adminClient
    .from('project_images')
    .update({ is_cover: false })
    .eq('project_id', projectId);

  if (unsetErr) {
    return { error: unsetErr.message };
  }

  // Set selected as cover
  const { error: setErr } = await adminClient
    .from('project_images')
    .update({ is_cover: true })
    .eq('id', imageId);

  if (setErr) {
    return { error: setErr.message };
  }

  return { success: true };
}

export async function updateImageOrderAction(projectId: string, imageIds: string[]) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  // Sequentially update ordering
  for (let idx = 0; idx < imageIds.length; idx++) {
    const id = imageIds[idx];
    await adminClient
      .from('project_images')
      .update({ display_order: idx })
      .eq('id', id)
      .eq('project_id', projectId);
  }

  return { success: true };
}

// 4. Inquiry Actions
export async function markInquiryStatusAction(inquiryId: string, status: 'new' | 'read' | 'replied') {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('contact_inquiries')
    .update({ status })
    .eq('id', inquiryId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteInquiryAction(inquiryId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('contact_inquiries')
    .delete()
    .eq('id', inquiryId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

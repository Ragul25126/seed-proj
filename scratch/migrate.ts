import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { portfolio, featuredProjects } from '../lib/data';

// 1. Load env variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrlRaw = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = env.SUPABASE_SECRET_KEY;

if (!supabaseUrlRaw || !supabaseSecretKey) {
  console.error('Supabase URL or Secret Key not found in .env.local!');
  process.exit(1);
}

const supabaseUrl = supabaseUrlRaw.startsWith('http')
  ? supabaseUrlRaw
  : `https://${supabaseUrlRaw}.supabase.co`;

console.log(`Connecting to Supabase at: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false
  }
});

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

// Robust retry wrapper with exponential backoff
async function retry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries <= 0) throw err;
    console.warn(`  [RETRY] Warning: Operation failed (${err.message || err}). Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 1.5);
  }
}

async function runMigration() {
  console.log(`Starting migration of ${portfolio.length} projects with auto-retry enabled...`);
  
  let projectsSuccess = 0;
  let projectsSkipped = 0;
  let imagesUploaded = 0;
  let imagesSkipped = 0;
  const errors: string[] = [];

  for (let i = 0; i < portfolio.length; i++) {
    const proj = portfolio[i];
    const slug = proj.slug;
    console.log(`\n[${i + 1}/${portfolio.length}] Processing project: "${proj.title}" (slug: ${slug})`);

    let projectId: string;

    try {
      // Check if project exists with retry
      const existingProj = await retry(async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw new Error(error.message);
        return data;
      });

      if (existingProj) {
        console.log(`Project "${proj.title}" already exists in database (ID: ${existingProj.id}). Skipping project insert.`);
        projectId = existingProj.id;
        projectsSkipped++;
      } else {
        // Determine featured state
        const isFeatured = featuredProjects.some(fp => fp.slug === slug);
        
        // Determine descriptions
        const fullDesc = proj.description || '';
        // Short description is the first sentence or first 150 characters
        const firstSentenceMatch = fullDesc.match(/^[^.!?]+[.!?]/);
        const shortDesc = firstSentenceMatch ? firstSentenceMatch[0] : (fullDesc.substring(0, 150) + (fullDesc.length > 150 ? '...' : ''));

        const newProj = await retry(async () => {
          const { data, error } = await supabase
            .from('projects')
            .insert({
              slug,
              title: proj.title,
              division: proj.division || 'mep',
              client_sector: proj.clientSector || 'Unknown',
              sector: proj.sector || proj.clientSector || 'Unknown',
              location: proj.location || 'Unknown',
              project_scale: proj.projectScale || 'Unknown',
              client: proj.client || null,
              architect: proj.architect || null,
              services: proj.services || null,
              area: proj.area || null,
              short_description: shortDesc,
              full_description: fullDesc,
              status: 'Completed',
              featured: isFeatured,
              display_order: i,
              is_published: true
            })
            .select('id')
            .single();
          if (error) throw new Error(error.message);
          return data;
        });

        projectId = newProj.id;
        console.log(`Successfully created project "${proj.title}" (ID: ${projectId})`);
        projectsSuccess++;
      }
    } catch (err: any) {
      const msg = `Error handling project "${proj.title}": ${err.message}`;
      console.error(msg);
      errors.push(msg);
      continue;
    }

    // Determine images to upload
    const imagesToProcess: string[] = [];
    if (proj.image) {
      imagesToProcess.push(proj.image);
    }
    if (proj.images && proj.images.length > 0) {
      proj.images.forEach(img => {
        if (!imagesToProcess.includes(img)) {
          imagesToProcess.push(img);
        }
      });
    }

    // Preserve order of images
    for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
      const img = imagesToProcess[imgIdx];
      const filename = path.basename(img);
      // Sanitize filename to prevent Invalid Key storage errors on unicode apostrophes or spaces
      const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');
      const storagePath = `projects/${slug}/${sanitizedFilename}`;
      const localFilePath = path.join(process.cwd(), 'public', img);

      console.log(`  - Image [${imgIdx + 1}/${imagesToProcess.length}]: ${img}`);

      if (!fs.existsSync(localFilePath)) {
        const msg = `  [ERROR] Local image file does not exist: ${localFilePath}`;
        console.error(msg);
        errors.push(msg);
        continue;
      }

      try {
        // Check if image already exists in DB
        const existingImg = await retry(async () => {
          const { data, error } = await supabase
            .from('project_images')
            .select('id')
            .eq('project_id', projectId)
            .eq('storage_path', storagePath)
            .maybeSingle();
          if (error) throw new Error(error.message);
          return data;
        });

        if (existingImg) {
          console.log(`  Image "${filename}" already exists in DB. Skipping upload.`);
          imagesSkipped++;
          continue;
        }

        // Upload file to Supabase Storage with retry
        const fileBuffer = fs.readFileSync(localFilePath);
        const mimeType = getMimeType(localFilePath);

        await retry(async () => {
          const { data, error } = await supabase.storage
            .from('project-images')
            .upload(storagePath, fileBuffer, {
              contentType: mimeType,
              upsert: true
            });
          if (error) throw new Error(error.message);
          return data;
        });

        console.log(`  Successfully uploaded "${filename}" to storage path: ${storagePath}`);

        // Generate signed URL (10 years expiry) with retry
        const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;
        const signedUrl = await retry(async () => {
          const { data, error } = await supabase.storage
            .from('project-images')
            .createSignedUrl(storagePath, tenYearsInSeconds);
          if (error) throw new Error(error.message);
          return data.signedUrl;
        });

        const isCover = img === proj.image;

        // Insert image record in DB with retry
        await retry(async () => {
          const { data, error } = await supabase
            .from('project_images')
            .insert({
              project_id: projectId,
              image_url: signedUrl,
              storage_path: storagePath,
              alt_text: `${proj.title} - Image ${imgIdx + 1}`,
              display_order: imgIdx,
              is_cover: isCover
            });
          if (error) throw new Error(error.message);
          return data;
        });

        console.log(`  Successfully registered image "${filename}" (Cover: ${isCover})`);
        imagesUploaded++;
      } catch (err: any) {
        const msg = `  [ERROR] Image "${filename}" migration failed: ${err.message}`;
        console.error(msg);
        errors.push(msg);
      }
    }
  }

  console.log('\n======================================================');
  console.log('MIGRATION COMPLETE SUMMARY');
  console.log('======================================================');
  console.log(`Projects: ${projectsSuccess} migrated, ${projectsSkipped} skipped (already existed).`);
  console.log(`Images: ${imagesUploaded} uploaded & registered, ${imagesSkipped} skipped.`);
  console.log(`Errors encountered: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nDetailed Errors:');
    errors.forEach(err => console.log(`- ${err}`));
  }
}

runMigration().catch(err => {
  console.error('Migration failed with exception:', err);
  process.exit(1);
});

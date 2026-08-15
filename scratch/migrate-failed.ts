import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
    default:
      return 'application/octet-stream';
  }
}

async function retry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries <= 0) throw err;
    console.warn(`  [RETRY] Operation failed: ${err.message || err}. Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 1.5);
  }
}

const failedImages = [
  {
    projectSlug: 'ellington-sands-1-2',
    img: '/projects/ellington-sands-aerial.png',
    isCover: false,
    displayOrder: 2
  },
  {
    projectSlug: 'eltiera-heights',
    img: '/projects/eltiera-heights-new-03.png',
    isCover: false,
    displayOrder: 2
  },
  {
    projectSlug: 'rajiv-gandhi-int-l-cricket-stadium',
    img: '/projects/Rajiv Gandhi Int’l Cricket Stadium.webp',
    isCover: true,
    displayOrder: 0
  }
];

async function migrateFailed() {
  console.log(`Starting targeted migration of ${failedImages.length} failed images...`);

  for (const item of failedImages) {
    console.log(`\nProcessing: ${item.img} for project: ${item.projectSlug}`);

    const localFilePath = path.join(process.cwd(), 'public', item.img);
    if (!fs.existsSync(localFilePath)) {
      console.error(`Local file not found: ${localFilePath}`);
      continue;
    }

    // 1. Get Project ID
    const project = await retry(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', item.projectSlug)
        .single();
      if (error) throw new Error(error.message);
      return data;
    });

    const projectId = project.id;
    console.log(`Project ID resolved: ${projectId}`);

    // 2. Sanitize filename for storage path
    const filename = path.basename(item.img);
    const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');
    const storagePath = `projects/${item.projectSlug}/${sanitizedFilename}`;

    console.log(`Uploading to: ${storagePath}`);

    // 3. Upload file
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

    console.log('Upload success.');

    // 4. Generate signed URL
    const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;
    const signedUrl = await retry(async () => {
      const { data, error } = await supabase.storage
        .from('project-images')
        .createSignedUrl(storagePath, tenYearsInSeconds);
      if (error) throw new Error(error.message);
      return data.signedUrl;
    });

    console.log('Signed URL generated.');

    // 5. Insert image record in DB
    await retry(async () => {
      const { data, error } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          image_url: signedUrl,
          storage_path: storagePath,
          alt_text: `${item.projectSlug} - Image ${item.displayOrder + 1}`,
          display_order: item.displayOrder,
          is_cover: item.isCover
        });
      if (error) throw new Error(error.message);
      return data;
    });

    console.log('Database registration complete.');
  }

  console.log('\nTargeted migration complete!');
}

migrateFailed().catch(err => {
  console.error('Targeted migration failed:', err);
});

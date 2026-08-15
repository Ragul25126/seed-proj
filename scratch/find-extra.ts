import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { portfolio } from '../lib/data';

const envPath = path.join(process.cwd(), '.env.local');
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
const supabaseUrl = supabaseUrlRaw.startsWith('http') ? supabaseUrlRaw : `https://${supabaseUrlRaw}.supabase.co`;

const supabase = createClient(supabaseUrl, supabaseSecretKey);

async function find() {
  const { data: dbImages, error } = await supabase
    .from('project_images')
    .select('id, storage_path, projects(slug, title)');

  if (error) {
    console.error('Error fetching db images:', error.message);
    return;
  }

  console.log(`DB has ${dbImages.length} images.`);

  // Map local paths to expected storage paths
  const localPaths = new Set<string>();
  portfolio.forEach(proj => {
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

    imagesToProcess.forEach(img => {
      const filename = path.basename(img);
      const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');
      
      // Store both sanitized and unsanitized keys since the first run was unsanitized
      const unsanitizedPath = `projects/${proj.slug}/${filename}`;
      const sanitizedPath = `projects/${proj.slug}/${sanitizedFilename}`;
      
      localPaths.add(unsanitizedPath);
      localPaths.add(sanitizedPath);
    });
  });

  console.log('\nChecking DB records that do not match expected paths:');
  dbImages.forEach((img: any) => {
    const path = img.storage_path;
    const projTitle = img.projects?.title;
    if (!localPaths.has(path)) {
      console.log(`Extra Image in DB: ${path} (Project: "${projTitle}")`);
    }
  });

  // Check for exact duplicates in DB (same project_id and storage_path)
  const duplicates: Record<string, number> = {};
  dbImages.forEach((img: any) => {
    const key = `${img.projects?.slug}::${img.storage_path}`;
    duplicates[key] = (duplicates[key] || 0) + 1;
  });

  console.log('\nChecking for duplicates (inserted multiple times):');
  Object.keys(duplicates).forEach(key => {
    if (duplicates[key] > 1) {
      console.log(`Duplicate: ${key} -> Count: ${duplicates[key]}`);
    }
  });
}

find();

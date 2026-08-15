import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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

async function check() {
  const slug = 'sobha-hartland';
  console.log(`Checking project: ${slug}`);
  
  const { data: project, error: pError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (pError) {
    console.error('Error fetching project:', pError);
    return;
  }
  
  console.log('Project row:', project);
  
  const { data: images, error: iError } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id);
    
  if (iError) {
    console.error('Error fetching project images:', iError);
    return;
  }
  
  console.log('Project images from DB:', images);
}

check();

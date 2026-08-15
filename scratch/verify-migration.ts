import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env
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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseUrl = supabaseUrlRaw.startsWith('http') ? supabaseUrlRaw : `https://${supabaseUrlRaw}.supabase.co`;

const adminClient = createClient(supabaseUrl, supabaseSecretKey);
const publicClient = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('--- SUPABASE DATABASE & STORAGE VERIFICATION ---\n');

  // 1. Verify Projects count
  const { count: projectsCount, error: countProjErr } = await adminClient
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  if (countProjErr) {
    console.error('FAIL - Projects count query:', countProjErr.message);
  } else {
    console.log(`1. PROJECTS COUNT: ${projectsCount} / 69 (Expected: 69) - ${projectsCount === 69 ? 'PASS' : 'FAIL'}`);
  }

  // 2. Verify Project Images count
  const { count: imagesCount, error: countImgErr } = await adminClient
    .from('project_images')
    .select('*', { count: 'exact', head: true });

  if (countImgErr) {
    console.error('FAIL - Project images count query:', countImgErr.message);
  } else {
    console.log(`2. IMAGES COUNT: ${imagesCount} / 203 (Expected: 203) - ${imagesCount === 203 ? 'PASS' : 'FAIL'}`);
  }

  // 3. Verify images and cover assignments per project
  const { data: projectsList, error: listProjErr } = await adminClient
    .from('projects')
    .select('id, title, slug');

  if (listProjErr) {
    console.error('FAIL - Fetching projects list:', listProjErr.message);
  } else if (projectsList) {
    let allValid = true;
    let projectsWithMultipleCovers = 0;
    let projectsWithNoCovers = 0;
    let projectsWithNoImages = 0;

    for (const proj of projectsList) {
      const { data: imgs, error: listImgErr } = await adminClient
        .from('project_images')
        .select('is_cover, image_url')
        .eq('project_id', proj.id);

      if (listImgErr) {
        allValid = false;
        console.error(`Error listing images for "${proj.title}":`, listImgErr.message);
        continue;
      }

      if (imgs.length === 0) {
        projectsWithNoImages++;
        allValid = false;
      } else {
        const coverCount = imgs.filter(i => i.is_cover).length;
        if (coverCount === 0) {
          projectsWithNoCovers++;
          allValid = false;
        } else if (coverCount > 1) {
          projectsWithMultipleCovers++;
          allValid = false;
        }
      }
    }

    console.log(`3. IMAGE & COVER CORRECTNESS:`);
    console.log(`   - Projects with 0 images: ${projectsWithNoImages} (Expected: 0)`);
    console.log(`   - Projects with 0 covers: ${projectsWithNoCovers} (Expected: 0)`);
    console.log(`   - Projects with multiple covers: ${projectsWithMultipleCovers} (Expected: 0)`);
    console.log(`   - Overall correctness check: ${allValid ? 'PASS' : 'FAIL'}`);
  }

  // 4. Verify bucket files exist
  const { data: storageFiles, error: storageErr } = await adminClient.storage
    .from('project-images')
    .list('projects/mandarin-wasl-tower', { limit: 10 });

  if (storageErr) {
    console.error('4. STORAGE BUCKET INTEGRITY: FAIL - Listing bucket files:', storageErr.message);
  } else {
    const hasFiles = storageFiles && storageFiles.length > 0;
    console.log(`4. STORAGE BUCKET INTEGRITY: ${storageFiles.length} files found under 'projects/mandarin-wasl-tower/' - ${hasFiles ? 'PASS' : 'FAIL'}`);
  }

  // 5. Verify public read access (anon client)
  const { data: pubData, error: pubErr } = await publicClient
    .from('projects')
    .select('id, title, is_published')
    .eq('is_published', true)
    .limit(1);

  if (pubErr) {
    console.error('5. PUBLIC READ ACCESS: FAIL - querying projects with anon key:', pubErr.message);
  } else {
    console.log(`5. PUBLIC READ ACCESS: Successfully read published project "${pubData?.[0]?.title}" with anon key - PASS`);
  }

  // 6. Verify contact inquiry submission (insert only) and reading (RLS check)
  const testEmail = `test-${Date.now()}@example.com`;
  const { error: insertInqErr } = await publicClient
    .from('contact_inquiries')
    .insert({
      name: 'Verification Test Bot',
      company: 'SEED Verification Inc.',
      email: testEmail,
      subject: 'RLS Verification Test',
      message: 'This is an automated test message for Supabase RLS verification.',
      status: 'new'
    });

  if (insertInqErr) {
    console.error('6. INQUIRY SUBMISSION: FAIL - inserting inquiry with anon key:', insertInqErr.message);
  } else {
    console.log('6. INQUIRY SUBMISSION: Successfully submitted contact inquiry with anon key - PASS');
  }

  // 7. Verify RLS (anon client cannot select contact inquiries, admin client can)
  const { data: anonInqs, error: anonReadInqErr } = await publicClient
    .from('contact_inquiries')
    .select('*');

  const { data: adminInq, error: adminReadInqErr } = await adminClient
    .from('contact_inquiries')
    .select('*')
    .eq('email', testEmail)
    .maybeSingle();

  // If select was blocked by RLS, anonInqs should be empty or null or not contain the test email
  const anonSelectBlocked = !anonInqs || anonInqs.length === 0 || !anonInqs.some(i => i.email === testEmail);
  const adminSelectAllowed = !!adminInq && adminInq.email === testEmail;

  console.log(`7. ADMIN AUTH / RLS SECURITY:`);
  console.log(`   - Anon select inquiries check (should block): ${anonSelectBlocked ? 'BLOCKED (PASS)' : 'ALLOWED (FAIL)'}`);
  console.log(`   - Admin select inquiries check (should allow): ${adminSelectAllowed ? 'ALLOWED (PASS)' : 'BLOCKED (FAIL)'}`);
}

verify();

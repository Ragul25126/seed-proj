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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseUrl = supabaseUrlRaw.startsWith('http') ? supabaseUrlRaw : `https://${supabaseUrlRaw}.supabase.co`;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  console.log('Testing connection to Supabase with Anon Key...');
  
  // 1. Try fetching schema documentation from REST API
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseSecretKey,
        'Authorization': `Bearer ${supabaseSecretKey}`
      }
    });
    const schema = await res.json();
    console.log('\nExposed Tables/Views in schema:');
    if (schema.paths) {
      Object.keys(schema.paths).forEach(path => {
        console.log(`- ${path}`);
      });
    } else {
      console.log('No paths found in OpenAPI schema document:', schema);
    }
  } catch (err: any) {
    console.error('Failed to get schema info:', err.message);
  }

  // 2. Try fetching from projects
  console.log('\nTesting query on projects table...');
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  if (error) {
    console.error('Query error on projects:', error);
  } else {
    console.log('Query success on projects:', data);
  }
}

inspect();

-- ==============================================================================
-- Migration: Fix Supabase vacancies Table Permissions, Grants, RLS, and Schema Cache
-- ==============================================================================

-- 1. Ensure vacancies table exists in public schema
CREATE TABLE IF NOT EXISTS public.vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT,
  application_instructions TEXT DEFAULT 'Please send your CV to hr@seedengineering.com',
  application_email TEXT DEFAULT 'hr@seedengineering.com',
  poster_url TEXT,
  positions JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ensure all columns exist
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS application_email TEXT DEFAULT 'hr@seedengineering.com';
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS positions JSONB DEFAULT '[]'::jsonb;

-- 3. Grant schema usage to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 4. Grant table DML permissions to API roles
GRANT SELECT ON TABLE public.vacancies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.vacancies TO authenticated;
GRANT ALL ON TABLE public.vacancies TO service_role;
GRANT ALL ON TABLE public.vacancies TO postgres;

-- 5. Enable Row Level Security (RLS) and define minimal required policies
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- Policy for Public Read Access (Public Careers Page)
DROP POLICY IF EXISTS "Allow public read active vacancies" ON public.vacancies;
CREATE POLICY "Allow public read active vacancies" 
ON public.vacancies FOR SELECT 
TO public 
USING (true);

-- Policy for Admin/Authenticated Full Access (Admin Dashboard)
DROP POLICY IF EXISTS "Allow authenticated admin full vacancies" ON public.vacancies;
CREATE POLICY "Allow authenticated admin full vacancies" 
ON public.vacancies FOR ALL 
TO authenticated, service_role 
USING (true) 
WITH CHECK (true);

-- 6. Trigger PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

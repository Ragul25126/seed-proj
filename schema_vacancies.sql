-- Run this SQL in your Supabase Dashboard -> SQL Editor to create or update the vacancies table.

-- 1. Create vacancies table if not exists
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

-- 3. Create Index
CREATE INDEX IF NOT EXISTS idx_vacancies_is_active_order 
ON public.vacancies (is_active, display_order ASC, created_at DESC);

-- 4. Enable RLS and setup policies
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read vacancies" ON public.vacancies;
CREATE POLICY "Allow public read vacancies" ON public.vacancies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all vacancies management" ON public.vacancies;
CREATE POLICY "Allow all vacancies management" ON public.vacancies FOR ALL USING (true);

-- 5. Grant permissions
GRANT ALL ON TABLE public.vacancies TO anon;
GRANT ALL ON TABLE public.vacancies TO authenticated;
GRANT ALL ON TABLE public.vacancies TO service_role;

-- 6. Reload PostgREST API schema cache instantly
NOTIFY pgrst, 'reload schema';

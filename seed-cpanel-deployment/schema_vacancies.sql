-- Run this SQL in your Supabase Dashboard -> SQL Editor to create or update the vacancies table.

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

ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS application_email TEXT DEFAULT 'hr@seedengineering.com';
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS positions JSONB DEFAULT '[]'::jsonb;

-- Index for ordering active vacancies efficiently
CREATE INDEX IF NOT EXISTS idx_vacancies_is_active_order 
ON public.vacancies (is_active, display_order ASC, created_at DESC);

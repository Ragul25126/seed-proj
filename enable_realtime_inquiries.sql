-- ==============================================================================
-- Migration: Enable Supabase Realtime & RLS for contact_inquiries table
-- ==============================================================================

-- 1. Ensure table is added to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'contact_inquiries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_inquiries;
  END IF;
END $$;

-- 2. Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 3. Policy for public insertion (contact page / lead forms)
DROP POLICY IF EXISTS "Allow public insert contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow public insert contact_inquiries" 
ON public.contact_inquiries FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Policy for select access (enables Realtime postgres_changes broadcast)
DROP POLICY IF EXISTS "Allow read contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow read contact_inquiries" 
ON public.contact_inquiries FOR SELECT 
TO public 
USING (true);

-- 5. Policy for admin/authenticated update and delete
DROP POLICY IF EXISTS "Allow all management contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow all management contact_inquiries" 
ON public.contact_inquiries FOR ALL 
TO authenticated, service_role 
USING (true) 
WITH CHECK (true);

-- 6. Grant permissions
GRANT SELECT, INSERT ON TABLE public.contact_inquiries TO anon;
GRANT ALL ON TABLE public.contact_inquiries TO authenticated;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- 7. Trigger PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

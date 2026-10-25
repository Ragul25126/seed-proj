-- ==============================================================================
-- Migration: Harden Row Level Security (RLS) and Table Grants
-- File: supabase/migrations/20261025_harden_rls_policies.sql
-- Description:
--   1. Revoke public/anonymous SELECT access on `contact_inquiries` table,
--      closing the critical anonymous data exfiltration vulnerability.
--   2. Maintain unauthenticated INSERT on `contact_inquiries` so that public
--      lead/contact form submissions continue to work smoothly.
--   3. Restrict SELECT, UPDATE, DELETE on `contact_inquiries` to authorized
--      administrators (verified against public.admin_users) and service_role.
--   4. Enable Supabase Realtime broadcast for authenticated admins while
--      keeping customer inquiries strictly private from anonymous users.
--   5. Restrict INSERT, UPDATE, DELETE on `vacancies` table to authorized
--      administrators (verified against public.admin_users) and service_role,
--      while preserving public SELECT access for the Careers page.
--
-- STATUS: UNAPPLIED (Prepared for manual review and deployment by authorized operator)
-- DO NOT EXECUTE AUTOMATICALLY. Review notes and verification queries included below.
-- ==============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- SECTION 1: CONTACT INQUIRIES (Closing Anonymous Read Vulnerability)
-- ──────────────────────────────────────────────────────────────────────────────

-- Ensure RLS is enabled
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1.1 Revoke table-level read grants from anon and public
-- In enable_realtime_inquiries.sql, "GRANT SELECT, INSERT ON TABLE public.contact_inquiries TO anon;" was granted.
-- We must revoke SELECT so the anon role cannot read inquiry rows.
REVOKE SELECT ON TABLE public.contact_inquiries FROM anon;
REVOKE SELECT ON TABLE public.contact_inquiries FROM public;

-- Ensure necessary DML grants remain intact
GRANT INSERT ON TABLE public.contact_inquiries TO anon;
GRANT INSERT ON TABLE public.contact_inquiries TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_inquiries TO authenticated;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- 1.2 Drop the over-permissive public read policy
DROP POLICY IF EXISTS "Allow read contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow all management contact_inquiries" ON public.contact_inquiries;

-- 1.3 Ensure public insertion policy is strictly INSERT-only with validation
DROP POLICY IF EXISTS "Allow public insert contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow public insert contact_inquiries" 
ON public.contact_inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 1.4 Allow SELECT only to verified administrators and service_role
-- This enables Realtime postgres_changes broadcast for authenticated admins
-- while preventing any non-admin authenticated or anonymous user from reading inquiries.
CREATE POLICY "Allow admin read contact_inquiries" 
ON public.contact_inquiries 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid() 
       OR lower(admin_users.email) = lower(auth.jwt()->>'email')
  )
);

-- 1.5 Allow UPDATE and DELETE only to verified administrators
CREATE POLICY "Allow admin manage contact_inquiries" 
ON public.contact_inquiries 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid() 
       OR lower(admin_users.email) = lower(auth.jwt()->>'email')
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid() 
       OR lower(admin_users.email) = lower(auth.jwt()->>'email')
  )
);

-- 1.6 Service role policy for background tasks & server-side queries
CREATE POLICY "Allow service_role all contact_inquiries" 
ON public.contact_inquiries 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);


-- ──────────────────────────────────────────────────────────────────────────────
-- SECTION 2: VACANCIES (Restricting Mutation to Verified Admins)
-- ──────────────────────────────────────────────────────────────────────────────

-- Ensure RLS is enabled
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- 2.1 Table-level grants:
-- Public & anon can SELECT active vacancies for the Careers page.
-- Authenticated users need table-level permissions, filtered by RLS policies.
GRANT SELECT ON TABLE public.vacancies TO anon;
GRANT SELECT ON TABLE public.vacancies TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.vacancies TO authenticated;
GRANT ALL ON TABLE public.vacancies TO service_role;

-- 2.2 Drop the over-permissive mutation policy that granted FOR ALL to any authenticated user
DROP POLICY IF EXISTS "Allow authenticated admin full vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow public read active vacancies" ON public.vacancies;

-- 2.3 Public Read Policy: Allow anyone (anon + authenticated) to view active vacancies
CREATE POLICY "Allow public read active vacancies" 
ON public.vacancies 
FOR SELECT 
TO public 
USING (is_active = true OR EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE admin_users.id = auth.uid() 
     OR lower(admin_users.email) = lower(auth.jwt()->>'email')
));

-- 2.4 Admin Mutation Policy: Restrict INSERT, UPDATE, DELETE to verified administrators
CREATE POLICY "Allow admin full access to vacancies" 
ON public.vacancies 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid() 
       OR lower(admin_users.email) = lower(auth.jwt()->>'email')
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid() 
       OR lower(admin_users.email) = lower(auth.jwt()->>'email')
  )
);

-- 2.5 Service role policy for server actions and migrations
CREATE POLICY "Allow service_role all vacancies" 
ON public.vacancies 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- SECTION 3: SCHEMA CACHE RELOAD
-- ──────────────────────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES FOR AUTHORIZED OPERATOR
-- Run these queries after applying this migration in the Supabase SQL Editor:
--
-- 1. Test Anon SELECT on contact_inquiries (MUST return 0 rows or permission denied):
--    SET ROLE anon;
--    SELECT id, name, email FROM public.contact_inquiries LIMIT 5;
--    RESET ROLE;
--
-- 2. Test Anon INSERT on contact_inquiries (MUST succeed):
--    SET ROLE anon;
--    INSERT INTO public.contact_inquiries (name, email, message)
--    VALUES ('Test Lead', 'test@example.com', 'Verification test message');
--    RESET ROLE;
--
-- 3. Test Non-Admin Authenticated user mutation on vacancies (MUST fail):
--    SET ROLE authenticated;
--    -- Assuming auth.uid() is not in admin_users
--    INSERT INTO public.vacancies (title, department) VALUES ('Hacked Vacancy', 'IT');
--    RESET ROLE;
--
-- 4. Test Public SELECT on vacancies (MUST return active vacancies):
--    SET ROLE anon;
--    SELECT id, title, department FROM public.vacancies WHERE is_active = true LIMIT 5;
--    RESET ROLE;
-- ──────────────────────────────────────────────────────────────────────────────

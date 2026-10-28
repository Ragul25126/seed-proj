-- ==============================================================================
-- Migration: Harden Row Level Security (RLS) and Table Grants (Hardened & Idempotent)
-- File: supabase/migrations/20261025_harden_rls_policies.sql
-- Description:
--   1. Implement a secured, search-path-safe, UUID-only SECURITY DEFINER function
--      `public.is_admin()` owned by `postgres` to verify admin identity against
--      `public.admin_users` without granting table-level SELECT on `admin_users`.
--   2. Enforce strict UUID-only authorization (`admin_users.id = auth.uid()`),
--      eliminating reliance on unconfirmed or mutable JWT email claims.
--   3. Secure `public.admin_users`: Enable RLS, revoke anonymous/public access,
--      restrict authenticated reads strictly to own row (`id = auth.uid()`), and grant
--      full privileges to `service_role`.
--   4. Revoke all public/anonymous access on `contact_inquiries` and grant only
--      INSERT, closing the critical customer inquiry data exfiltration vulnerability.
--   5. Maintain unauthenticated INSERT on `contact_inquiries` so public lead and
--      contact submissions continue to succeed without disruption.
--   6. Restrict SELECT, UPDATE, DELETE on `contact_inquiries` to authorized
--      administrators and service_role (exactly 5 non-overlapping policies).
--   7. Maintain Supabase Realtime event broadcasts for authenticated admins
--      while keeping customer inquiry payloads private from anonymous users.
--   8. Restrict INSERT, UPDATE, DELETE on `vacancies` to authorized administrators
--      and service_role, while preserving public SELECT access for active vacancies
--      (exactly 3 non-overlapping policies).
--   9. Explicitly drop legacy policies including "Allow all vacancies management"
--      and "Allow authenticated admin full vacancies".
--  10. Full idempotency and atomicity: safe to rerun with explicit transaction wrapping
--      and DROP POLICY IF EXISTS.
--
-- STATUS: UNAPPLIED (Prepared for manual review and deployment by authorized operator)
-- DO NOT EXECUTE AUTOMATICALLY. Safe read-only verification queries included below.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- SECTION 0: SECURE ADMIN CHECK HELPER (UUID-ONLY AUTHORIZATION)
-- ------------------------------------------------------------------------------
-- Hardening specifications:
--   1. SET search_path = '' strictly prevents search-path hijacking attacks.
--   2. All object references are fully schema-qualified (public.admin_users, auth.uid()).
--   3. UUID-Only Authorization: Enforces matching strictly on `admin_users.id = auth.uid()`.
--      Email fallback is intentionally excluded to eliminate reliance on mutable JWT email
--      claims and prevent unauthorized access via unconfirmed signup vectors.
--      (Prerequisite: All administrators in `public.admin_users` must be provisioned with
--      their Supabase Auth UUID, as verified in production: 1 admin, 1 valid mapping, 0 unmapped).
--   4. STABLE volatility allows PostgreSQL to cache evaluation per statement across multiple rows.
--   5. Explicit ownership by `postgres` role (superuser in Supabase).
--   6. REVOKE ALL FROM PUBLIC; execution granted to anon, authenticated, and service_role.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  );
$$;

-- Explicitly assign trusted owner (postgres role in Supabase)
ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- Verification assertion: Ensure function exists, owner is postgres, and SECURITY DEFINER is active
DO $$
DECLARE
  v_owner text;
  v_secdef boolean;
BEGIN
  SELECT proowner::regrole::text, prosecdef
  INTO v_owner, v_secdef
  FROM pg_proc
  WHERE proname = 'is_admin'
    AND pronamespace = 'public'::regnamespace;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verification failed: public.is_admin() function does not exist.';
  END IF;

  IF v_owner IS NULL OR v_owner != 'postgres' THEN
    RAISE EXCEPTION 'Ownership verification failed: public.is_admin() owner is %, expected postgres', COALESCE(v_owner, 'NULL');
  END IF;

  IF v_secdef IS NOT TRUE THEN
    RAISE EXCEPTION 'Security check failed: public.is_admin() is not SECURITY DEFINER';
  END IF;
END $$;

-- Secure function execution privileges (grant execute to anon for RLS evaluation while revoking PUBLIC)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;


-- ------------------------------------------------------------------------------
-- DYNAMIC POLICY CLEANUP (Purging All Existing Policies on Target Tables)
-- ------------------------------------------------------------------------------
-- PostgreSQL evaluates permissive RLS policies using OR. If ANY legacy or UI-created
-- policy permitting unauthorized reads or mutations survives, the table remains vulnerable.
-- This transactional block dynamically inspects pg_policies and drops ALL existing policies
-- exclusively on 'admin_users', 'contact_inquiries', and 'vacancies' in the 'public' schema
-- before replacement policies are created.
-- Catalog-derived identifiers are safely escaped using format('... %I ...').
-- Does NOT drop policies from any other table.

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('admin_users', 'contact_inquiries', 'vacancies')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;


-- ------------------------------------------------------------------------------
-- SECTION 1: ADMIN USERS TABLE (Preventing Anonymous Enumeration & Hardening Direct Access)
-- ------------------------------------------------------------------------------

-- 1.1 Ensure Row Level Security is active
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1.2 Table-level grants (Strict Least Privilege)
-- Revoke all table-level access from anon and public to prevent admin enumeration
REVOKE ALL ON TABLE public.admin_users FROM anon;
REVOKE ALL ON TABLE public.admin_users FROM public;

-- Authenticated role receives SELECT permissions, with access filtered strictly by RLS policies
GRANT SELECT ON TABLE public.admin_users TO authenticated;

-- Service role retains full access for admin management and migrations
GRANT ALL ON TABLE public.admin_users TO service_role;

-- 1.3 Drop all existing and legacy policies for admin_users (ensures idempotency)
DROP POLICY IF EXISTS "Allow authenticated read own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Allow service_role all admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow all admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_users;
DROP POLICY IF EXISTS "Public admin_users are viewable by everyone" ON public.admin_users;

-- 1.4 Create non-overlapping, strictly scoped policies (Exactly 2 policies)

-- A. Authenticated self-read only (allows authenticated admin session to confirm identity)
CREATE POLICY "Allow authenticated read own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- B. Service Role Full Access
CREATE POLICY "Allow service_role all admin_users"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- SECTION 2: CONTACT INQUIRIES (Closing Anonymous Read Vulnerability)
-- ------------------------------------------------------------------------------

-- 2.1 Ensure Row Level Security is active
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 2.2 Realtime publication and replica identity
-- Ensure contact_inquiries is in supabase_realtime publication for InquiriesClient.tsx
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'contact_inquiries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_inquiries;
  END IF;
END $$;

-- Set REPLICA IDENTITY FULL so UPDATE events deliver complete record payloads to Realtime subscribers
ALTER TABLE public.contact_inquiries REPLICA IDENTITY FULL;

-- 2.3 Table-level grants (Strict Least Privilege)
-- Revoke all table-level access from anon and public first
REVOKE ALL ON TABLE public.contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.contact_inquiries FROM public;

-- Grant strictly INSERT to anon and public for website lead submissions
GRANT INSERT ON TABLE public.contact_inquiries TO anon;
GRANT INSERT ON TABLE public.contact_inquiries TO public;

-- Authenticated role receives DML permissions, with access filtered strictly by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_inquiries TO authenticated;

-- Service role retains full access for background tasks and server-side count queries
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- 2.4 Drop all existing and legacy policies for contact_inquiries (ensures idempotency)
-- IMPORTANT: PostgreSQL evaluates permissive policies with OR. Every legacy policy that allows
-- read access to public/anon MUST be dropped. Verify remaining policies using verification query #4.
DROP POLICY IF EXISTS "Allow read contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow all management contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow public insert contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow admin read contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow admin manage contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow admin update contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow admin delete contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow service_role all contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Public contact_inquiries are viewable by everyone" ON public.contact_inquiries;

-- 2.5 Create non-overlapping, strictly scoped policies (Exactly 5 policies)

-- A. Public Insertion (Lead submissions from website)
CREATE POLICY "Allow public insert contact_inquiries"
ON public.contact_inquiries
FOR INSERT
TO public
WITH CHECK (true);

-- B. Admin SELECT (Admin dashboard and Realtime subscribers)
CREATE POLICY "Allow admin read contact_inquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING (public.is_admin());

-- C. Admin UPDATE (Status updates and inquiry notes)
CREATE POLICY "Allow admin update contact_inquiries"
ON public.contact_inquiries
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- D. Admin DELETE (Inquiry deletion)
CREATE POLICY "Allow admin delete contact_inquiries"
ON public.contact_inquiries
FOR DELETE
TO authenticated
USING (public.is_admin());

-- E. Service Role Full Access (Server actions / cached query workers)
CREATE POLICY "Allow service_role all contact_inquiries"
ON public.contact_inquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- SECTION 3: VACANCIES (Restricting Mutation to Verified Admins & Removing Anon Mutations)
-- ------------------------------------------------------------------------------

-- 3.1 Ensure Row Level Security is active
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- 3.2 Table-level grants (Strict Least Privilege)
-- Revoke all table-level access from anon and public first (removes broad mutation privileges)
REVOKE ALL ON TABLE public.vacancies FROM anon;
REVOKE ALL ON TABLE public.vacancies FROM public;

-- Grant strictly SELECT to anon and public for the Careers page
GRANT SELECT ON TABLE public.vacancies TO anon;
GRANT SELECT ON TABLE public.vacancies TO public;

-- Authenticated role receives DML permissions, with access filtered strictly by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.vacancies TO authenticated;

-- Service role retains full access for server actions and migrations
GRANT ALL ON TABLE public.vacancies TO service_role;

-- 3.3 Drop all existing and legacy policies for vacancies (ensures idempotency)
-- Explicitly drops legacy open policies including "Allow all vacancies management" and "Allow authenticated admin full vacancies".
DROP POLICY IF EXISTS "Allow all vacancies management" ON public.vacancies;
DROP POLICY IF EXISTS "Allow authenticated admin full vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow public read active vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow admin read all vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow public read vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow admin full access to vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow admin manage vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Allow service_role all vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vacancies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.vacancies;
DROP POLICY IF EXISTS "Public vacancies are viewable by everyone" ON public.vacancies;

-- 3.4 Create non-overlapping, strictly scoped policies (Exactly 3 policies)

-- A. Public SELECT (Careers page: active vacancies for everyone)
CREATE POLICY "Allow public read active vacancies"
ON public.vacancies
FOR SELECT
TO public
USING (is_active = true);

-- B. Admin Full Access (CMS management: select, insert, update, delete for admins)
-- Note: FOR ALL covers SELECT, INSERT, UPDATE, and DELETE, making a separate SELECT policy redundant.
CREATE POLICY "Allow admin manage vacancies"
ON public.vacancies
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- C. Service Role Full Access
CREATE POLICY "Allow service_role all vacancies"
ON public.vacancies
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- SECTION 4: SCHEMA CACHE RELOAD
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

COMMIT;


-- ==============================================================================
-- VERIFICATION CHECKLIST & QUERIES FOR AUTHORIZED DATABASE OPERATOR
-- ==============================================================================
-- SAFE PRODUCTION READ-ONLY INSPECTION (Zero data modification)
--
-- IMPORTANT OPERATOR NOTICE -- LIVE SCHEMA STATUS & PREREQUISITES:
-- 1. UNAPPLIED LOCAL ARTIFACT: This migration file has been reviewed locally and prepared
--    for operator deployment. It has NOT been applied to the live database.
-- 2. LIVE SCHEMA VERIFICATION STATUS: Production verification confirmed that RLS is enabled,
--    identity mapping is valid (1 admin, 1 valid mapping, 0 unmapped), and vacancies had broad
--    anon privileges and an open authenticated ALL policy. Applying this migration resolves
--    all three tables atomically.
-- 3. PERMISSIVE POLICIES USE 'OR': PostgreSQL combines all permissive RLS policies using OR.
--    Every legacy policy that allows unauthorized access is explicitly dropped by this script.
-- 4. SQL EDITOR ROLE BEHAVIOR (BYPASSRLS): In the Supabase Dashboard SQL Editor, queries execute
--    as the `postgres` superuser by default. The `postgres` role has the `BYPASSRLS` attribute,
--    meaning queries run directly as `postgres` bypass all RLS policies. To test RLS in the
--    SQL Editor, operators MUST simulate the target role using `SET ROLE <role>;` and `RESET ROLE;`.
--
-- ------------------------------------------------------------------------------
-- TIER 1: TABLE-LEVEL GRANTS AUDIT (Database Permissions)
-- ------------------------------------------------------------------------------
-- Table grants determine whether a role can perform operations at the SQL table boundary
-- before RLS is evaluated.
-- Expected:
--   - admin_users: 0 rows for anon/public
--   - contact_inquiries: ONLY INSERT for anon/public
--   - vacancies: ONLY SELECT for anon/public
--
-- 1. Audit effective table-level grants for anon and public roles:
--    SELECT grantee, table_name, privilege_type
--    FROM information_schema.role_table_grants
--    WHERE table_schema = 'public'
--      AND table_name IN ('admin_users', 'contact_inquiries', 'vacancies')
--      AND grantee IN ('anon', 'public')
--    ORDER BY table_name, grantee, privilege_type;
--
-- ------------------------------------------------------------------------------
-- TIER 2: ROW LEVEL SECURITY & POLICY INSPECTION (Catalog Audit)
-- ------------------------------------------------------------------------------
-- 2. Confirm RLS is enabled on all three tables (all must return rowsecurity = true):
--    SELECT tablename, rowsecurity
--    FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN ('admin_users', 'contact_inquiries', 'vacancies');
--
-- 3. Audit active policies on admin_users (MUST return exactly 2 policies):
--    SELECT policyname, permissive, roles, cmd
--    FROM pg_policies
--    WHERE schemaname = 'public' AND tablename = 'admin_users'
--    ORDER BY cmd;
--    (Expected: Exactly 2 active policies -- 1 SELECT for authenticated (id = auth.uid()), 1 ALL for service_role).
--
-- 4. Audit active policies on contact_inquiries (MUST return exactly 5 policies; MUST NOT contain public/anon SELECT):
--    SELECT policyname, permissive, roles, cmd
--    FROM pg_policies
--    WHERE schemaname = 'public' AND tablename = 'contact_inquiries'
--    ORDER BY cmd;
--    (Expected: Exactly 5 active policies -- 1 INSERT for public, 1 SELECT for authenticated, 1 UPDATE for authenticated, 1 DELETE for authenticated, 1 ALL for service_role).
--
-- 5. Audit active policies on vacancies (MUST return exactly 3 policies):
--    SELECT policyname, permissive, roles, cmd
--    FROM pg_policies
--    WHERE schemaname = 'public' AND tablename = 'vacancies'
--    ORDER BY cmd;
--    (Expected: Exactly 3 active policies -- 1 SELECT for public active, 1 ALL for authenticated admins, 1 ALL for service_role).
--
-- ------------------------------------------------------------------------------
-- TIER 3: ADMIN IDENTITY LINKAGE AUDIT (UUID-Only Integrity Check)
-- ------------------------------------------------------------------------------
-- Verifies that every record in public.admin_users is mapped to an existing Supabase
-- Auth user (auth.users.id). Under UUID-only authorization (admin_users.id = auth.uid()),
-- any admin record with a NULL id or an unmatched UUID cannot be authorized.
-- Safe read-only inspection: does NOT expose personal information (emails/names) or modify data.
--
-- 6. Audit public.admin_users for missing or unmapped auth UUIDs:
--    SELECT
--      admin_users.id AS unmatched_admin_id,
--      (admin_users.id IS NULL) AS is_null_id
--    FROM public.admin_users
--    LEFT JOIN auth.users ON auth.users.id = admin_users.id
--    WHERE auth.users.id IS NULL OR admin_users.id IS NULL;
--    (MUST return 0 rows in production; verified 0 unmapped records in live DB).
--
--    Verify total count of active, mapped administrators:
--    SELECT COUNT(*) AS total_valid_admins
--    FROM public.admin_users
--    INNER JOIN auth.users ON auth.users.id = admin_users.id;
--    (Verified: 1 in production).
--
-- ------------------------------------------------------------------------------
-- TIER 4: SQL EDITOR ROLE SIMULATION (Local Session Tests)
-- ------------------------------------------------------------------------------
-- In the Supabase SQL Editor, default execution is under the `postgres` role which bypasses RLS.
-- Use SET ROLE and RESET ROLE to accurately test RLS enforcement.
--
-- 7. Test anonymous SELECT on admin_users (MUST fail with permission denied 42501):
--    SET ROLE anon;
--    SELECT COUNT(*) AS anon_admin_count FROM public.admin_users;
--    -- Expected: ERROR 42501 (permission denied for table admin_users)
--    RESET ROLE;
--
-- 8. Test anonymous SELECT on contact_inquiries (MUST return 0 rows or permission denied):
--    SET ROLE anon;
--    SELECT COUNT(*) AS anon_inquiry_count FROM public.contact_inquiries;
--    RESET ROLE;
--
-- 9. Test anonymous SELECT on vacancies (MUST only count active vacancies; inactive count MUST be 0):
--    SET ROLE anon;
--    SELECT COUNT(*) AS anon_inactive_vacancies FROM public.vacancies WHERE is_active = false;
--    RESET ROLE;
--
-- 10. Test anonymous INSERT/UPDATE/DELETE on vacancies (MUST fail with permission denied):
--    SET ROLE anon;
--    INSERT INTO public.vacancies (title, department) VALUES ('Unauthorized Job', 'Engineering');
--    -- Expected: ERROR 42501 (permission denied for table vacancies)
--    RESET ROLE;
--
-- 11. Test is_admin() execution privileges:
--    a. Anon role execution (MUST succeed and return false since auth.uid() is NULL for anonymous users):
--       SET ROLE anon;
--       SELECT public.is_admin() AS anon_is_admin;
--       -- Expected: false (allowed to execute for RLS evaluation; evaluates to false for unauthenticated requests)
--       RESET ROLE;
--
--    b. Authenticated role execution without admin context (MUST return false):
--       SET ROLE authenticated;
--       SELECT public.is_admin() AS unauth_is_admin;
--       -- Expected: false (since auth.uid() is NULL in raw SQL session)
--       RESET ROLE;
--
-- ------------------------------------------------------------------------------
-- TIER 5: REAL-WORLD POSTGREST / HTTP API VERIFICATION (Safe Read-Only)
-- ------------------------------------------------------------------------------
-- Distinguishing SQL Editor tests from actual HTTP / PostgREST network behavior:
-- In production, the client connects to PostgREST via HTTP. PostgREST authenticates the request,
-- sets request.jwt.claims and current role, and queries PostgreSQL.
--
-- 12. Anonymous Inquiry Read Test via PostgREST:
--     curl -i \
--       -H "apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
--       -H "Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
--       "https://apvkdnofstyyidcmuczb.supabase.co/rest/v1/contact_inquiries?select=id"
--
-- 13. Anonymous Vacancies Mutation Test via PostgREST (MUST return HTTP 401/403):
--     curl -i -X POST \
--       -H "apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
--       -H "Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
--       -H "Content-Type: application/json" \
--       -d '{"title":"Unauthorized Job"}' \
--       "https://apvkdnofstyyidcmuczb.supabase.co/rest/v1/vacancies"
--
-- 14. Authenticated Admin Contrast Test (Conclusive Proof of Access Boundary):
--     curl -i \
--       -H "apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
--       -H "Authorization: Bearer <ADMIN_USER_ACCESS_TOKEN>" \
--       "https://apvkdnofstyyidcmuczb.supabase.co/rest/v1/contact_inquiries?select=id"
--     (The admin request MUST return the actual record IDs, proving the access boundary).
--
-- ------------------------------------------------------------------------------
-- TIER 6: REALTIME WEBSOCKET AUTHORIZATION TEST (Safe Read-Only)
-- ------------------------------------------------------------------------------
-- Verify that Supabase Realtime blocks unauthorized event payloads:
-- 15. Connect an anonymous client to the `realtime_contact_inquiries_dashboard` channel.
-- 16. Submit a test inquiry via the public contact form or curl.
-- 17. Confirm that the anonymous websocket subscriber receives ZERO event payloads.
-- 18. Connect an authenticated admin client and confirm that the event payload IS received.
-- ------------------------------------------------------------------------------

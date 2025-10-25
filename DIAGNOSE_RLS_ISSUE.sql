-- =====================================================
-- DIAGNOSTIC QUERIES - Run these in Supabase SQL Editor
-- This will tell us EXACTLY what's wrong
-- =====================================================

-- 1) Check if RLS is enabled (should be true)
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('kits', 'kit_assets', 'kit_sections')
ORDER BY tablename;

-- Expected: All should show 't' (true)

-- 2) Check what policies exist on kits table
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'kits'
ORDER BY policyname;

-- Look for policies with names like 'kits_write_owner_admin' (BAD - too restrictive)
-- Should see 'kits_insert_members' and 'kits_update_members' (GOOD)

-- 3) Check what policies exist on kit_assets table
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'kit_assets'
ORDER BY policyname;

-- 4) Check your organization membership
SELECT 
  m.role,
  o.name as org_name,
  o.id as org_id
FROM organization_members m
JOIN organizations o ON o.id = m.org_id
WHERE m.user_id = auth.uid();

-- This shows YOUR role. If you're 'member' (not owner/admin), 
-- that's why the old policies blocked you.

-- 5) Check if there are any kits in your workspace
SELECT 
  id,
  name,
  org_id,
  created_at
FROM kits
WHERE org_id IN (
  SELECT org_id 
  FROM organization_members 
  WHERE user_id = auth.uid()
)
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- STEP-BY-STEP FIX
-- =====================================================

-- If queries above show policies named 'kits_write_owner_admin', 
-- run this to fix:

-- Drop old restrictive policies
DROP POLICY IF EXISTS "kits_write_owner_admin" ON kits;
DROP POLICY IF EXISTS "sections_write_owner_admin" ON kit_sections;
DROP POLICY IF EXISTS "assets_write_owner_admin" ON kit_assets;

-- Create new member-friendly policies for kits
CREATE POLICY "kits_insert_members" ON kits
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

CREATE POLICY "kits_update_members" ON kits
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

-- Create new member-friendly policies for kit_assets
CREATE POLICY "assets_insert_members" ON kit_assets
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id AND m.user_id = auth.uid()
  )
);

CREATE POLICY "assets_update_members" ON kit_assets
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id AND m.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id AND m.user_id = auth.uid()
  )
);

-- =====================================================
-- After running the fix, verify:
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('kits', 'kit_assets')
  AND policyname LIKE '%members%'
ORDER BY tablename, policyname;

-- You should see:
-- kits | kits_insert_members | INSERT
-- kits | kits_update_members | UPDATE
-- kit_assets | assets_insert_members | INSERT
-- kit_assets | assets_update_members | UPDATE


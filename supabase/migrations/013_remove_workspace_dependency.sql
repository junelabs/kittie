-- =====================================================
-- Migration: Remove Workspace Dependency from Kits
-- =====================================================

-- 1) Add owner_id column to kits table
ALTER TABLE kits ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2) Backfill owner_id from created_by or org_id
-- First, try to get owner from created_by
UPDATE kits 
SET owner_id = created_by 
WHERE owner_id IS NULL AND created_by IS NOT NULL;

-- For any remaining kits, we'll need to handle them based on org_id
-- This is a fallback - ideally all kits should have created_by
UPDATE kits 
SET owner_id = (
  SELECT m.user_id 
  FROM organization_members m 
  WHERE m.org_id = kits.org_id 
  AND m.role = 'owner'
  LIMIT 1
)
WHERE owner_id IS NULL AND org_id IS NOT NULL;

-- 3) Make owner_id required (NOT NULL)
ALTER TABLE kits ALTER COLUMN owner_id SET NOT NULL;

-- 4) Drop org_id column
ALTER TABLE kits DROP COLUMN IF EXISTS org_id;

-- 5) Update indexes
DROP INDEX IF EXISTS idx_kits_org;
CREATE INDEX IF NOT EXISTS idx_kits_owner ON kits(owner_id);
CREATE INDEX IF NOT EXISTS idx_kits_owner_archived ON kits(owner_id, archived);

-- 6) Drop ALL existing policies that depend on org_id
-- Kits policies
DROP POLICY IF EXISTS "kits_read_members" ON kits;
DROP POLICY IF EXISTS "kits_write_owner_admin" ON kits;
DROP POLICY IF EXISTS "kits_insert_members" ON kits;
DROP POLICY IF EXISTS "kits_update_members" ON kits;
DROP POLICY IF EXISTS "kits_delete_members" ON kits;
DROP POLICY IF EXISTS "kits_all_operations_members" ON kits;

-- Kit sections policies
DROP POLICY IF EXISTS "sections_read_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_write_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_insert_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_update_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_delete_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_all_operations_members" ON kit_sections;

-- Kit assets policies
DROP POLICY IF EXISTS "assets_read_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_write_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_insert_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_update_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_delete_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_all_operations_members" ON kit_assets;

-- Kit team policies
DROP POLICY IF EXISTS "team_read_members" ON kit_team;
DROP POLICY IF EXISTS "team_write_members" ON kit_team;
DROP POLICY IF EXISTS "team_insert_members" ON kit_team;
DROP POLICY IF EXISTS "team_update_members" ON kit_team;
DROP POLICY IF EXISTS "team_delete_members" ON kit_team;
DROP POLICY IF EXISTS "team_all_operations_members" ON kit_team;
DROP POLICY IF EXISTS "kit_team_read_members" ON kit_team;
DROP POLICY IF EXISTS "kit_team_write_owner_admin" ON kit_team;

-- Create user-based policies
CREATE POLICY "kits_user_access" ON kits
FOR ALL USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 7) Create new user-based policies for kit_sections
CREATE POLICY "sections_user_access" ON kit_sections
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM kits k 
    WHERE k.id = kit_sections.kit_id 
    AND k.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM kits k 
    WHERE k.id = kit_sections.kit_id 
    AND k.owner_id = auth.uid()
  )
);

-- 8) Create new user-based policies for kit_assets
CREATE POLICY "assets_user_access" ON kit_assets
FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    WHERE s.id = kit_assets.section_id 
    AND k.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    WHERE s.id = kit_assets.section_id 
    AND k.owner_id = auth.uid()
  )
);

-- 9) Create new user-based policies for kit_team
CREATE POLICY "team_user_access" ON kit_team
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM kits k 
    WHERE k.id = kit_team.kit_id 
    AND k.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM kits k 
    WHERE k.id = kit_team.kit_id 
    AND k.owner_id = auth.uid()
  )
);

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================

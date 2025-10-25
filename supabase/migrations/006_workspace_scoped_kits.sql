-- =====================================================
-- Migration: Workspace-Scoped Kits (Brand Kits)
-- =====================================================

-- 1) Add required columns to media_kits table
ALTER TABLE media_kits
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE media_kits
  ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE media_kits
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE media_kits
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2) Backfill: Set org_id to the first workspace the kit owner belongs to
-- This handles existing kits that don't have a workspace assigned

-- First, backfill kits for users who DO belong to organizations
UPDATE media_kits k
SET org_id = (
  SELECT m.org_id 
  FROM organization_members m
  WHERE m.user_id = k.owner_id
  ORDER BY m.role = 'owner' DESC, m.org_id ASC
  LIMIT 1
)
WHERE k.org_id IS NULL
  AND EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.user_id = k.owner_id
  );

-- Delete any kits that still have NULL org_id
-- (These belong to users who don't have any organizations yet)
DELETE FROM media_kits
WHERE org_id IS NULL;

-- 3) Make org_id required (NOT NULL)
ALTER TABLE media_kits 
  ALTER COLUMN org_id SET NOT NULL;

-- 4) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_kits_org_id ON media_kits(org_id);
CREATE INDEX IF NOT EXISTS idx_media_kits_archived ON media_kits(archived);
CREATE INDEX IF NOT EXISTS idx_media_kits_org_arch ON media_kits(org_id, archived);

-- 5) Enable Row Level Security on media_kits
ALTER TABLE media_kits ENABLE ROW LEVEL SECURITY;

-- 6) Drop existing policies if they exist
DROP POLICY IF EXISTS "kits_select_members_of_org" ON media_kits;
DROP POLICY IF EXISTS "kits_insert_members_of_org" ON media_kits;
DROP POLICY IF EXISTS "kits_update_members_of_org" ON media_kits;
DROP POLICY IF EXISTS "kits_delete_members_of_org" ON media_kits;

-- Also drop any old owner-based policies
DROP POLICY IF EXISTS "Users can view their own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can insert their own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can update their own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can delete their own kits" ON media_kits;

-- 7) Create RLS policies for workspace-scoped access
-- Read: All members of the workspace can SELECT kits
CREATE POLICY "kits_read_members"
ON media_kits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = media_kits.org_id 
    AND m.user_id = auth.uid()
  )
);

-- Write: Only owners and admins can INSERT/UPDATE/DELETE kits
CREATE POLICY "kits_write_owner_admin"
ON media_kits FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = media_kits.org_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = media_kits.org_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'admin')
  )
);

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================


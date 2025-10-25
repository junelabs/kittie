-- =====================================================
-- Migration: Fix RLS for Kit Uploads (members can write)
-- Allow all workspace members to write (not just owner/admin)
-- =====================================================

-- 0) Ensure RLS is ON (keep it on)
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_assets ENABLE ROW LEVEL SECURITY;

-- 1) Drop old policies that might block writes
DROP POLICY IF EXISTS "kits_write_owner_admin" ON kits;
DROP POLICY IF EXISTS "sections_write_owner_admin" ON kit_sections;
DROP POLICY IF EXISTS "assets_write_owner_admin" ON kit_assets;

-- Also drop any old combined policies
DROP POLICY IF EXISTS "kits_write_members" ON kits;
DROP POLICY IF EXISTS "sections_write_members" ON kit_sections;
DROP POLICY IF EXISTS "assets_write_members" ON kit_assets;

-- 2) READ for all workspace members (keep)
DROP POLICY IF EXISTS "kits_read_members" ON kits;
CREATE POLICY "kits_read_members" ON kits
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "sections_read_members" ON kit_sections;
CREATE POLICY "sections_read_members" ON kit_sections
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM kits k
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id AND m.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "assets_read_members" ON kit_assets;
CREATE POLICY "assets_read_members" ON kit_assets
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id
      AND m.user_id = auth.uid()
  )
);

-- 3) WRITE for all workspace members (so uploads & edits work)

-- KITS: Insert
CREATE POLICY "kits_insert_members" ON kits
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

-- KITS: Update
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

-- KITS: Delete (optional)
CREATE POLICY "kits_delete_members" ON kits
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

-- KIT_SECTIONS: Insert
CREATE POLICY "sections_insert_members" ON kit_sections
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kits k
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id AND m.user_id = auth.uid()
  )
);

-- KIT_SECTIONS: Update
CREATE POLICY "sections_update_members" ON kit_sections
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM kits k
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id AND m.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kits k
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id AND m.user_id = auth.uid()
  )
);

-- KIT_SECTIONS: Delete (optional)
CREATE POLICY "sections_delete_members" ON kit_sections
FOR DELETE USING (
  EXISTS (
    SELECT 1
    FROM kits k
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id AND m.user_id = auth.uid()
  )
);

-- KIT_ASSETS: Insert
CREATE POLICY "assets_insert_members" ON kit_assets
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id
      AND m.user_id = auth.uid()
  )
);

-- KIT_ASSETS: Update
CREATE POLICY "assets_update_members" ON kit_assets
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id
      AND m.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id
      AND m.user_id = auth.uid()
  )
);

-- KIT_ASSETS: Delete
CREATE POLICY "assets_delete_members" ON kit_assets
FOR DELETE USING (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id
      AND m.user_id = auth.uid()
  )
);

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- All workspace members can now read/write kits
-- =====================================================


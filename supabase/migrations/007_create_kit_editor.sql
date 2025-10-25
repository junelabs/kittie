-- =====================================================
-- Migration: Kit Editor - Sections, Assets, Team
-- =====================================================

-- 1) KITS TABLE
-- Workspace-scoped brand kits with editable metadata
CREATE TABLE IF NOT EXISTS kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  button_label TEXT DEFAULT 'Download Brand Kit',
  logo_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  archived BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kits_org ON kits(org_id);
CREATE INDEX IF NOT EXISTS idx_kits_archived ON kits(archived);

ALTER TABLE kits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kits_read_members" ON kits;
DROP POLICY IF EXISTS "kits_write_owner_admin" ON kits;

CREATE POLICY "kits_read_members" ON kits
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = kits.org_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "kits_write_owner_admin" ON kits
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = kits.org_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = kits.org_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
);

-- 2) SECTIONS
-- Types: hero (fixed first), gallery (grid), logos (grid), team (grid)
DO $$ BEGIN
  CREATE TYPE kit_section_type AS ENUM ('hero', 'gallery', 'logos', 'team');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS kit_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  type kit_section_type NOT NULL,
  title TEXT,
  description TEXT,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_kit ON kit_sections(kit_id, position);

ALTER TABLE kit_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sections_read_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_write_owner_admin" ON kit_sections;

CREATE POLICY "sections_read_members" ON kit_sections
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "sections_write_owner_admin" ON kit_sections
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_sections.kit_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
);

-- 3) ASSETS
-- Images/files bound to a section
CREATE TABLE IF NOT EXISTS kit_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES kit_sections(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_section ON kit_assets(section_id, position);

ALTER TABLE kit_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assets_read_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_write_owner_admin" ON kit_assets;

CREATE POLICY "assets_read_members" ON kit_assets
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM kit_sections s 
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "assets_write_owner_admin" ON kit_assets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM kit_sections s 
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM kit_sections s 
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
);

-- 4) WORKSPACE TEAM (defaults)
CREATE TABLE IF NOT EXISTS workspace_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  avatar_url TEXT,
  position INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_team_org ON workspace_team(org_id, position);

ALTER TABLE workspace_team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_read_members" ON workspace_team;
DROP POLICY IF EXISTS "team_write_owner_admin" ON workspace_team;

CREATE POLICY "team_read_members" ON workspace_team
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = workspace_team.org_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "team_write_owner_admin" ON workspace_team
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = workspace_team.org_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = workspace_team.org_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
);

-- 5) KIT TEAM SNAPSHOT (override-capable)
CREATE TABLE IF NOT EXISTS kit_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  avatar_url TEXT,
  position INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kit_team ON kit_team(kit_id, position);

ALTER TABLE kit_team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kit_team_read_members" ON kit_team;
DROP POLICY IF EXISTS "kit_team_write_owner_admin" ON kit_team;

CREATE POLICY "kit_team_read_members" ON kit_team
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_team.kit_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "kit_team_write_owner_admin" ON kit_team
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_team.kit_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM kits k 
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE k.id = kit_team.kit_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('owner', 'admin')
  )
);

-- 6) STORAGE BUCKET for kit assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('kit-assets', 'kit-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for kit-assets
DROP POLICY IF EXISTS "Kit assets are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can upload kit assets" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can update kit assets" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can delete kit assets" ON storage.objects;

CREATE POLICY "Kit assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'kit-assets');

CREATE POLICY "Workspace members can upload kit assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kit-assets' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Workspace members can update kit assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kit-assets' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Workspace members can delete kit assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kit-assets' AND
  auth.uid() IS NOT NULL
);

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================


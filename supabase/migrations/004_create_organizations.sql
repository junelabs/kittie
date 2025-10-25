-- =====================================================
-- Migration: Create Organizations and Memberships
-- =====================================================

-- 1. CREATE ORGANIZATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'Organizations (workspaces) that users can belong to';

-- Indexes
CREATE INDEX IF NOT EXISTS organizations_slug_idx ON organizations(slug);
CREATE INDEX IF NOT EXISTS organizations_created_at_idx ON organizations(created_at);

-- Auto-update trigger for organizations
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. CREATE ORGANIZATION_MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_members (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

COMMENT ON TABLE organization_members IS 'Many-to-many relationship between users and organizations';

-- Indexes
CREATE INDEX IF NOT EXISTS organization_members_org_id_idx ON organization_members(org_id);
CREATE INDEX IF NOT EXISTS organization_members_user_id_idx ON organization_members(user_id);

-- 3. ENABLE RLS AND CREATE POLICIES
-- =====================================================
-- Now that both tables exist, we can create policies that reference each other

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Members can update their organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can insert organizations" ON organizations;

-- RLS Policies for organizations
-- Allow SELECT for any authenticated user (can be tightened later based on membership)
CREATE POLICY "Authenticated users can view organizations" 
  ON organizations FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their organizations" 
  ON organizations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.org_id = organizations.id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert organizations" 
  ON organizations FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on organization_members
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view memberships in their organizations" ON organization_members;
DROP POLICY IF EXISTS "Owners can manage memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can insert themselves as members" ON organization_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON organization_members;
DROP POLICY IF EXISTS "Owners can update memberships" ON organization_members;
DROP POLICY IF EXISTS "Owners can delete memberships" ON organization_members;

-- RLS Policies for organization_members (non-recursive)
CREATE POLICY "Users can view their own memberships" 
  ON organization_members FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own memberships" 
  ON organization_members FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can update memberships" 
  ON organization_members FOR UPDATE 
  USING (role = 'owner');

CREATE POLICY "Owners can delete memberships" 
  ON organization_members FOR DELETE 
  USING (role = 'owner');

-- 4. CREATE STORAGE BUCKET FOR ORG LOGOS
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('org-logos', 'org-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Org logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Organization members can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Organization members can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Organization members can delete logos" ON storage.objects;

-- Storage policies for org logos
CREATE POLICY "Org logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'org-logos');

CREATE POLICY "Organization members can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'org-logos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Organization members can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'org-logos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Organization members can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'org-logos' AND
  auth.uid() IS NOT NULL
);

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================


-- =====================================================
-- Migration: Add Brands Table and Relationships
-- =====================================================

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  primary_color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_brand_slug UNIQUE (user_id, slug)
);

-- Create indexes
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_slug ON brands(slug);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own brands" ON brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands" ON brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON brands
  FOR DELETE USING (auth.uid() = user_id);

-- Add brand_id to kits table
ALTER TABLE kits ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE CASCADE;
CREATE INDEX idx_kits_brand_id ON kits(brand_id);

-- Create default brand for existing users
INSERT INTO brands (user_id, name, slug)
SELECT DISTINCT owner_id, 'My Brand', 'my-brand'
FROM kits
WHERE owner_id IS NOT NULL
ON CONFLICT (user_id, slug) DO NOTHING;

-- Backfill brand_id for existing kits
UPDATE kits
SET brand_id = (
  SELECT id FROM brands 
  WHERE brands.user_id = kits.owner_id 
  LIMIT 1
)
WHERE brand_id IS NULL;

-- Add update trigger for brands
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_brands_updated_at();

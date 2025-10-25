-- Add brand_slug column to kits table
ALTER TABLE kits ADD COLUMN IF NOT EXISTS brand_slug TEXT;

-- Create index for brand_slug
CREATE INDEX IF NOT EXISTS idx_kits_brand_slug ON kits(brand_slug);

-- Create unique index for brand_slug + slug combination
-- This ensures each kit has a unique slug within its brand
CREATE UNIQUE INDEX IF NOT EXISTS idx_kits_brand_slug_unique 
ON kits(brand_slug, slug) WHERE brand_slug IS NOT NULL AND slug IS NOT NULL;

-- Update existing kits to have a default brand_slug based on owner
-- For now, we'll use a generic "brand" slug, but this should be updated
-- to use actual brand information from user profiles
UPDATE kits 
SET brand_slug = 'brand' 
WHERE brand_slug IS NULL;

-- Make brand_slug NOT NULL after setting defaults
ALTER TABLE kits ALTER COLUMN brand_slug SET NOT NULL;

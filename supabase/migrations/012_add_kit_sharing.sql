-- Add sharing columns to kits table
ALTER TABLE kits ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE kits ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE kits ADD COLUMN IF NOT EXISTS hide_branding BOOLEAN NOT NULL DEFAULT false;

-- Create index for public kits
CREATE INDEX IF NOT EXISTS idx_kits_public ON kits(is_public);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_kits_slug ON kits(slug) WHERE slug IS NOT NULL;


-- =====================================================
-- Migration: Add status column to kits table
-- =====================================================

-- Add status column to kits table
ALTER TABLE kits ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_kits_status ON kits(status);

-- Optional: Backfill existing kits to 'published' status
UPDATE kits SET status = 'published' WHERE status = 'draft';


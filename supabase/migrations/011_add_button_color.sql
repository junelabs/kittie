-- =====================================================
-- Migration: Add button_color to kits table
-- =====================================================

-- Add button_color column to kits table with default coral color
ALTER TABLE kits ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#FF6B6B';


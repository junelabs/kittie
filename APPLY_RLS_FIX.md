# 🔧 Fix RLS Error - Step by Step

You're getting "new row violates row-level security policy" because the database policies are too restrictive.

## ✅ Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: **kittie**
3. Click **SQL Editor** in the left sidebar

## ✅ Step 2: Check Current Policies (Optional - Diagnostic)

First, let's see what policies exist. Paste this and run:

```sql
-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename IN ('kits', 'kit_sections', 'kit_assets')
ORDER BY tablename, policyname;
```

You'll likely see policies named `kits_write_owner_admin` which block regular members.

## ✅ Step 3: Apply the Fix

Click **New Query** and paste this COMPLETE SQL:

```sql
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

-- Drop old insert/update/delete policies
DROP POLICY IF EXISTS "kits_insert_members" ON kits;
DROP POLICY IF EXISTS "kits_update_members" ON kits;
DROP POLICY IF EXISTS "kits_delete_members" ON kits;
DROP POLICY IF EXISTS "sections_insert_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_update_members" ON kit_sections;
DROP POLICY IF EXISTS "sections_delete_members" ON kit_sections;
DROP POLICY IF EXISTS "assets_insert_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_update_members" ON kit_assets;
DROP POLICY IF EXISTS "assets_delete_members" ON kit_assets;

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

-- KITS: Delete
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

-- KIT_SECTIONS: Delete
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
```

## ✅ Step 4: Click "RUN" (or press Cmd + Enter)

You should see: **Success. No rows returned**

## ✅ Step 5: Verify the Fix

Run this to confirm policies are now correct:

```sql
-- Verify new policies exist
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('kits', 'kit_sections', 'kit_assets')
ORDER BY tablename, policyname;
```

You should see policies like:
- `kits_insert_members`
- `kits_update_members`
- `assets_insert_members`
- etc.

## ✅ Step 6: Test Upload

1. Go back to your kit editor (refresh if needed)
2. Click on **Hero** section
3. Click **Upload Logo**
4. Select an image
5. **Should work without RLS error!** ✅

## 🎯 What This Does

- ✅ Allows **all workspace members** to create/edit kits
- ✅ Removes restriction that only owner/admin can write
- ✅ Still secure - users can only access their workspace's data
- ✅ Fixes Hero logo uploads
- ✅ Fixes Brand logo uploads
- ✅ Fixes Photo gallery uploads

---

**If you still get errors after this, let me know!**


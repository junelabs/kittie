# 🚨 URGENT: Fix RLS Error in 3 Steps

## Problem
Your Supabase database has RLS policies that block regular workspace members from uploading.

## Solution (Takes 2 minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard
- Select your project
- Click **SQL Editor** (left sidebar)
- Click **New Query**

### Step 2: Run Diagnostic (Copy & Paste This)
```sql
-- See what policies are blocking you
SELECT policyname FROM pg_policies WHERE tablename = 'kits';
```

Click **RUN**. You'll probably see: `kits_write_owner_admin` ← This is the problem!

### Step 3: Fix It (Copy & Paste This)
```sql
-- Remove old restrictive policies
DROP POLICY IF EXISTS "kits_write_owner_admin" ON kits;
DROP POLICY IF EXISTS "assets_write_owner_admin" ON kit_assets;

-- Allow all workspace members to write
CREATE POLICY "kits_insert_members" ON kits
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members m
    WHERE m.org_id = kits.org_id AND m.user_id = auth.uid()
  )
);

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

CREATE POLICY "assets_insert_members" ON kit_assets
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM kit_sections s
    JOIN kits k ON k.id = s.kit_id
    JOIN organization_members m ON m.org_id = k.org_id
    WHERE s.id = kit_assets.section_id AND m.user_id = auth.uid()
  )
);
```

Click **RUN** → Should see "Success"

### Step 4: Test
- Refresh your kit editor
- Try uploading a logo
- **Should work!** ✅

---

## Why This Happens
- Old policy: "Only owner/admin can upload"
- Your role: Probably "member"
- Result: RLS blocks all uploads
- Fix: Allow all workspace members to upload

---

## Still Not Working?
Run the full diagnostic from `DIAGNOSE_RLS_ISSUE.sql` and send me the output.


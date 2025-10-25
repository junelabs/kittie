# Phase 2: Database Schema Setup - Execution Guide

## Overview
This phase sets up your Supabase database with the necessary tables, security policies, and automation for the production auth system.

## ✅ Pre-Flight Checklist
Before you begin, make sure you have:
- [ ] Access to your Supabase project dashboard
- [ ] Your project has a `media_kits` table already created
- [ ] You're logged into Supabase and can access the SQL Editor

## 🚀 Step-by-Step Execution

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** to create a blank query

### Step 2: Run the Complete Migration
1. Open the file: `supabase/migrations/000_COMPLETE_MIGRATION.sql`
2. Copy the **entire contents** of this file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Cmd+Enter` / `Ctrl+Enter`)
5. Wait for the query to complete (should take ~2-5 seconds)

### Step 3: Verify Success
You should see a success message. Now let's verify everything was created correctly.

#### Check 1: Tables Exist
Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'media_kits');
```
**Expected result:** 2 rows showing `profiles` and `media_kits`

#### Check 2: RLS is Enabled
Run this query:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'media_kits');
```
**Expected result:** Both tables should have `rowsecurity = true`

#### Check 3: Profiles Table Structure
Run this query:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```
**Expected columns:**
- `id` (uuid)
- `email` (text)
- `business_name` (text)
- `logo_url` (text)
- `onboarded_at` (timestamp with time zone)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `plan_tier` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### Check 4: Media Kits Updates
Run this query:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'media_kits'
AND column_name IN ('published_at', 'is_public');
```
**Expected result:** 2 rows showing the new columns

#### Check 5: Policies Exist
Run this query:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'media_kits')
ORDER BY tablename, policyname;
```
**Expected result:** At least 9 policies total

#### Check 6: Triggers and Functions
Run this query:
```sql
SELECT 
  t.trigger_name,
  t.event_object_table,
  t.action_statement
FROM information_schema.triggers t
WHERE t.trigger_schema = 'public'
OR (t.trigger_schema = 'auth' AND t.trigger_name = 'on_auth_user_created')
ORDER BY t.event_object_table;
```
**Expected result:** Should see triggers for `profiles` and `auth.users`

### Step 4: Test Auto-Profile Creation (Optional)
This tests that profiles are automatically created when users sign up:

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter a test email (e.g., `test@example.com`) and password
4. Click **Create user**
5. Go to **Table Editor** > **profiles**
6. Verify that a new profile was automatically created for this user

If you see the profile, the trigger is working! ✅

## 🎯 Success Criteria

Phase 2 is complete when:
- [x] All SQL migrations run without errors
- [x] `profiles` table exists with all columns
- [x] `media_kits` has `published_at` and `is_public` columns
- [x] RLS is enabled on both tables
- [x] All policies are created and active
- [x] Triggers are set up and working
- [x] Test user gets auto-created profile

## ⚠️ Troubleshooting

### Error: "relation 'media_kits' does not exist"
**Problem:** You don't have a media_kits table yet.

**Solution:** First create the media_kits table:
```sql
CREATE TABLE media_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
Then re-run the migration.

### Error: "policy already exists"
**Problem:** You've run the migration before.

**Solution:** This is okay! The `DROP POLICY IF EXISTS` statements handle this. The migration is idempotent and safe to run multiple times.

### Error: "permission denied"
**Problem:** Your Supabase user doesn't have sufficient permissions.

**Solution:** Make sure you're using the SQL Editor as a project admin, not a restricted user.

### Profiles not auto-creating
**Problem:** The trigger isn't firing.

**Solution:** 
1. Check if the trigger exists:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```
2. If it doesn't exist, re-run just the trigger creation part of the migration
3. Try creating a new user again

## 🔄 Rollback Instructions

If you need to undo Phase 2, see the rollback section in:
`supabase/migrations/README.md`

## ➡️ Next Steps

Once Phase 2 is verified:
1. Mark Phase 2 as complete ✅
2. Proceed to **Phase 3: Middleware for Route Protection**
3. Keep this terminal/window open - you'll need it for verification

---

**Ready?** Open Supabase SQL Editor and let's go! 🚀


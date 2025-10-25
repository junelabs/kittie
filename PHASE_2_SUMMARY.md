# ✅ Phase 2: Database Schema Setup - READY TO EXECUTE

## What Phase 2 Delivers

Phase 2 sets up your Supabase database with everything needed for production authentication, onboarding, and email verification.

### 📊 New Database Objects

#### 1. **Profiles Table**
A new table to store user profile information:
- User email and business name
- Logo URL
- Onboarding completion timestamp
- Stripe customer and subscription IDs
- Plan tier (free, starter, pro, business)
- Auto-timestamps for created/updated dates

#### 2. **Media Kits Table Updates**
Adds new columns to your existing `media_kits` table:
- `published_at` - timestamp when kit was published
- `is_public` - boolean flag (note: your table already has this!)

#### 3. **Row Level Security (RLS)**
Comprehensive security policies that:
- Ensure users can only see/edit their own data
- Allow public access to published kits
- **Require email verification before publishing kits** 🔒

#### 4. **Automatic Profile Creation**
A database trigger that automatically creates a profile when users sign up - no code needed!

#### 5. **Helper Functions**
- `is_email_verified(user_id)` - Check email verification status
- `update_updated_at_column()` - Auto-update timestamps
- `handle_new_user()` - Auto-create profiles

### 🔐 Security Features

**Email Verification Requirement:**
- Users can create and edit kits immediately
- But they **cannot publish** kits until email is verified
- Enforced at the database level (cannot be bypassed)

**Row Level Security:**
- Users own their data
- Can't see other users' private kits
- Public kits visible to everyone
- All enforced by PostgreSQL, not application code

### 📁 Migration Files Created

Your migration files are in `/Users/davidbrantley/kittie/supabase/migrations/`:

1. **`000_COMPLETE_MIGRATION.sql`** ⭐️ **USE THIS ONE**
   - All-in-one migration
   - Run once in Supabase SQL Editor
   - Easiest option!

2. **`001_create_profiles_and_setup_auth.sql`**
   - Individual migration: profiles table
   - Use if you prefer step-by-step

3. **`002_update_media_kits_and_stripe.sql`**
   - Individual migration: media_kits updates + Stripe
   - Use if you prefer step-by-step

4. **`README.md`**
   - Technical documentation
   - Verification queries
   - Rollback instructions

### 📖 Documentation Created

1. **`PHASE_2_EXECUTION_GUIDE.md`**
   - Step-by-step instructions
   - Pre-flight checklist
   - Verification steps
   - Troubleshooting guide

2. **`supabase/migrations/README.md`**
   - Technical reference
   - Rollback procedures
   - Advanced topics

## 🚀 How to Execute

### Quick Start (5 minutes)

1. Open Supabase dashboard → SQL Editor
2. Copy contents of `supabase/migrations/000_COMPLETE_MIGRATION.sql`
3. Paste into SQL Editor
4. Click **Run**
5. Verify success (see verification steps below)

### Verification Steps

After running the migration, run these queries to verify success:

**Check 1: Tables exist**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'media_kits');
```
Expected: 2 rows

**Check 2: RLS enabled**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'media_kits');
```
Expected: Both have `rowsecurity = true`

**Check 3: Profiles columns**
```sql
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```
Expected: All 10 columns present

**Check 4: Test auto-profile creation**
1. Create a test user in Authentication → Users
2. Check profiles table for matching record
3. Should auto-create!

## ⚠️ Important Notes

### Compatibility Fix Applied ✅
- Your code uses `owner_id` for the user reference in `media_kits`
- Migration updated to use `owner_id` (not `user_id`)
- All RLS policies reference `owner_id`

### Existing Data
- Migration uses `ADD COLUMN IF NOT EXISTS` - safe to re-run
- Won't affect existing media kits
- RLS policies protect existing data

### is_public Column
- Your TypeScript types show `is_public` already exists
- Migration uses `IF NOT EXISTS` so it won't error if already there
- RLS policies will now enforce email verification for publishing

## 🎯 Success Criteria

Phase 2 is complete when:
- ✅ All migrations run without errors
- ✅ `profiles` table exists with all 10 columns
- ✅ `media_kits` has `published_at` column
- ✅ RLS is enabled on both tables
- ✅ Test user gets auto-created profile
- ✅ Policies visible in Supabase dashboard

## ❓ Need Help?

**Migration errors?**
- Check `PHASE_2_EXECUTION_GUIDE.md` troubleshooting section
- Common issues and solutions provided

**Want to test first?**
- Create a separate Supabase project
- Run migration there first
- Then apply to production

**Need to rollback?**
- Rollback SQL provided in `supabase/migrations/README.md`
- Removes all Phase 2 changes

## ➡️ What's Next?

After Phase 2 succeeds:
- **Phase 3**: Create middleware for route protection
- **Phase 4**: Update login page with Supabase auth
- **Phase 5**: Create onboarding flow
- **Phase 6**: Add email verification UI

---

**Ready to execute?** Open the `PHASE_2_EXECUTION_GUIDE.md` for step-by-step instructions! 🚀


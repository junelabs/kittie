# Supabase Migrations - Phase 2: Database Schema Setup

This directory contains SQL migrations for setting up the production authentication and onboarding system.

## Quick Start

**Option 1: Run the Complete Migration (Recommended)**
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `000_COMPLETE_MIGRATION.sql`
4. Click **Run** or press `Cmd+Enter`

**Option 2: Run Individual Migrations**
Run in order:
1. `001_create_profiles_and_setup_auth.sql`
2. `002_update_media_kits_and_stripe.sql`

## What Gets Created

### Tables

#### `profiles`
- User profile information
- Business name and logo
- Onboarding status tracking
- Stripe customer and subscription IDs
- Plan tier (free, starter, pro, business)

#### `media_kits` (updated)
- Added `published_at` timestamp
- Added `is_public` boolean flag
- Email verification requirement for publishing

### Security

#### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Users can only view/edit their own data
- Public kits are viewable by anyone
- Only email-verified users can publish kits

### Automation

#### Triggers
- **Auto-create profile**: When a user signs up, a profile is automatically created
- **Auto-update timestamps**: `updated_at` is automatically updated on profile changes

### Helper Functions

- `is_email_verified(user_id)`: Check if a user has verified their email
- `handle_new_user()`: Automatically create profile on signup
- `update_updated_at_column()`: Auto-update timestamps

## Verification

After running the migration, verify success:

### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'media_kits');
```

### 2. Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'media_kits');
```
Both should show `rowsecurity = true`

### 3. Check Policies Exist
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. Test Auto-Profile Creation
The trigger will automatically create a profile when a user signs up through Supabase Auth. You can test this by:
1. Creating a test user in Authentication > Users
2. Checking that a corresponding profile was created in the `profiles` table

## Rollback

If you need to rollback this migration:

```sql
-- Drop policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own kits" ON media_kits;
DROP POLICY IF EXISTS "Public kits are viewable by anyone" ON media_kits;
DROP POLICY IF EXISTS "Users can insert own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can update own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can delete own kits" ON media_kits;
DROP POLICY IF EXISTS "Only verified users can publish kits" ON media_kits;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS is_email_verified(UUID);
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remove added columns from media_kits
ALTER TABLE media_kits DROP COLUMN IF EXISTS published_at;
ALTER TABLE media_kits DROP COLUMN IF EXISTS is_public;

-- Drop profiles table
DROP TABLE IF EXISTS profiles CASCADE;
```

## Next Steps

After successfully running this migration:
1. ✅ Verify all tables and policies were created
2. ✅ Test that a profile is auto-created when a user signs up
3. ✅ Proceed to **Phase 3**: Middleware for route protection

## Troubleshooting

**Error: table "media_kits" does not exist**
- You need to create the `media_kits` table first
- Check your existing database schema

**Error: relation "auth.users" does not exist**
- Ensure you're running this in a Supabase project (not a standard PostgreSQL)
- Supabase provides the `auth.users` table by default

**Policies not working**
- Make sure RLS is enabled: `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`
- Check that you're using `auth.uid()` correctly in your queries

## Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs
- Review RLS policies: https://supabase.com/docs/guides/auth/row-level-security


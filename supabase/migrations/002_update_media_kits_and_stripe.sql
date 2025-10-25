-- =====================================================
-- Migration: Update Media Kits & Stripe Integration
-- Phase 2: Database Schema Setup
-- =====================================================

-- 1. UPDATE MEDIA_KITS TABLE
-- =====================================================
-- Add published_at column to track when kits are published
ALTER TABLE media_kits 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add is_public column for easier querying
ALTER TABLE media_kits 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add index for performance on published kits
CREATE INDEX IF NOT EXISTS media_kits_published_at_idx ON media_kits(published_at);
CREATE INDEX IF NOT EXISTS media_kits_owner_id_idx ON media_kits(owner_id);
CREATE INDEX IF NOT EXISTS media_kits_is_public_idx ON media_kits(is_public);

-- 2. ENABLE ROW LEVEL SECURITY ON MEDIA_KITS (if not already enabled)
-- =====================================================
ALTER TABLE media_kits ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING POLICIES (if any) AND RECREATE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can insert own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can update own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can delete own kits" ON media_kits;
DROP POLICY IF EXISTS "Public kits are viewable by anyone" ON media_kits;
DROP POLICY IF EXISTS "Only verified users can publish kits" ON media_kits;

-- 4. CREATE NEW RLS POLICIES FOR MEDIA_KITS
-- =====================================================
-- Users can view their own kits
CREATE POLICY "Users can view own kits" 
  ON media_kits FOR SELECT 
  USING (auth.uid() = owner_id);

-- Anyone can view public kits
CREATE POLICY "Public kits are viewable by anyone" 
  ON media_kits FOR SELECT 
  USING (is_public = true);

-- Users can insert their own kits
CREATE POLICY "Users can insert own kits" 
  ON media_kits FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own kits
CREATE POLICY "Users can delete own kits" 
  ON media_kits FOR DELETE 
  USING (auth.uid() = owner_id);

-- Users can update their own kits (basic updates)
CREATE POLICY "Users can update own kits" 
  ON media_kits FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Only verified users can publish kits (set is_public to true)
CREATE POLICY "Only verified users can publish kits"
  ON media_kits FOR UPDATE
  USING (
    auth.uid() = owner_id AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email_confirmed_at IS NOT NULL
    )
  )
  WITH CHECK (
    -- If setting is_public to true, email must be verified
    CASE 
      WHEN NEW.is_public = true THEN 
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE auth.users.id = auth.uid() 
          AND auth.users.email_confirmed_at IS NOT NULL
        )
      ELSE true
    END
  );

-- 5. ADD STRIPE INTEGRATION FIELDS TO PROFILES
-- =====================================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free';

-- Add constraint for plan_tier values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_plan_tier_check'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_plan_tier_check 
    CHECK (plan_tier IN ('free', 'starter', 'pro', 'business'));
  END IF;
END $$;

-- Add index for Stripe lookups
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx ON profiles(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS profiles_plan_tier_idx ON profiles(plan_tier);

-- 6. CREATE FUNCTION TO CHECK EMAIL VERIFICATION
-- =====================================================
CREATE OR REPLACE FUNCTION is_email_verified(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND email_confirmed_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION is_email_verified IS 'Check if a user has verified their email address';

-- =====================================================
-- Success! Media kits and Stripe integration ready.
-- Users must verify email before publishing kits.
-- =====================================================


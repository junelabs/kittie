-- =====================================================
-- COMPLETE MIGRATION - Phase 2: Database Schema Setup
-- =====================================================
-- This file combines all migrations for easy one-time execution
-- Run this in Supabase SQL Editor if you prefer a single migration
-- =====================================================

-- =====================================================
-- PART 1: CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  business_name TEXT,
  logo_url TEXT,
  onboarded_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'business')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profile information with business details and onboarding status';

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx ON profiles(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS profiles_plan_tier_idx ON profiles(plan_tier);

-- =====================================================
-- PART 2: AUTO-UPDATE FUNCTIONS AND TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 3: UPDATE MEDIA_KITS TABLE
-- =====================================================

ALTER TABLE media_kits 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE media_kits 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Indexes for media_kits
CREATE INDEX IF NOT EXISTS media_kits_published_at_idx ON media_kits(published_at);
CREATE INDEX IF NOT EXISTS media_kits_owner_id_idx ON media_kits(owner_id);
CREATE INDEX IF NOT EXISTS media_kits_is_public_idx ON media_kits(is_public);

ALTER TABLE media_kits ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 4: MEDIA_KITS RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can insert own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can update own kits" ON media_kits;
DROP POLICY IF EXISTS "Users can delete own kits" ON media_kits;
DROP POLICY IF EXISTS "Public kits are viewable by anyone" ON media_kits;
DROP POLICY IF EXISTS "Only verified users can publish kits" ON media_kits;

CREATE POLICY "Users can view own kits" 
  ON media_kits FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Public kits are viewable by anyone" 
  ON media_kits FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can insert own kits" 
  ON media_kits FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own kits" 
  ON media_kits FOR DELETE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can update own kits" 
  ON media_kits FOR UPDATE 
  USING (auth.uid() = owner_id);

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

-- =====================================================
-- PART 5: HELPER FUNCTIONS
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

COMMENT ON FUNCTION is_email_verified IS 'Check if a user has verified their email address';

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================
-- Next steps:
-- 1. Verify all tables were created successfully
-- 2. Test RLS policies work as expected
-- 3. Proceed to Phase 3: Middleware setup
-- =====================================================


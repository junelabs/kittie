-- Add role to profiles (nullable, constrained)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('brand','agency'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- NOTE:
-- We intentionally DO NOT rename columns:
-- - business_name → we will use existing `profiles.company`
-- - onboarding_completed → we will use existing `profiles.onboarded_at` (NULL until complete)


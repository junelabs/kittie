# Schema Mapping for Onboarding Implementation

## Database vs. Prompt Alignment

This document explains how we're adapting the onboarding prompt requirements to work with our existing Supabase schema.

---

## Profiles Table Mapping

### Prompt Expects:
```sql
profiles (
  id UUID,
  email TEXT,
  role TEXT ('brand' | 'agency'),
  business_name TEXT,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### What We Actually Have:
```sql
profiles (
  id UUID,
  email TEXT,
  full_name TEXT,           -- actual column name in your DB
  company TEXT,             -- actual column name in your DB
  role TEXT,                -- ADDED by migration 20251022
  onboarded_at TIMESTAMPTZ, -- timestamp instead of boolean
  logo_url TEXT,            -- extra field
  stripe_customer_id TEXT,  -- extra field
  stripe_subscription_id TEXT, -- extra field
  plan_tier TEXT,           -- extra field
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Field Mapping (Code Implementation):

| Prompt Field | Actual DB Column | Usage |
|--------------|------------------|-------|
| `role` | `role` | Direct match ✅ |
| `business_name` | `company` | Use `company` column |
| `onboarding_completed` | `onboarded_at` | Check if NOT NULL (completed) vs NULL (not completed) |
| `email` | `email` | Direct match ✅ |
| `id` | `id` | Direct match ✅ |

---

## Kits Table Mapping

### Prompt Expects:
```sql
kits (
  id UUID,
  owner_id UUID,
  name TEXT,
  created_at TIMESTAMPTZ
)
```

### What We Actually Have:
```sql
media_kits (
  id UUID,
  owner_id UUID,
  name TEXT,
  brand_color TEXT,        -- extra field
  is_public BOOLEAN,       -- extra field
  public_id TEXT,          -- extra field
  published_at TIMESTAMPTZ, -- extra field
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Table Name Mapping:

| Prompt Reference | Actual Table Name |
|------------------|-------------------|
| `kits` | `media_kits` |

---

## Code Implementation Strategy

### 1. Server Actions / API Routes

**When the prompt says:**
```typescript
// Prompt example
await supabase
  .from('kits')
  .select('*')
```

**We write:**
```typescript
// Actual implementation
await supabase
  .from('media_kits')
  .select('*')
```

### 2. Profile Updates

**When the prompt says:**
```typescript
// Prompt example
await supabase
  .from('profiles')
  .update({ 
    business_name: 'Acme Inc',
    onboarding_completed: true 
  })
```

**We write:**
```typescript
// Actual implementation
await supabase
  .from('profiles')
  .update({ 
    company: 'Acme Inc',           // Maps to business_name
    onboarded_at: new Date().toISOString() // Maps to onboarding_completed
  })
```

### 3. Checking Onboarding Status

**When the prompt says:**
```typescript
// Prompt example
if (!profile.onboarding_completed) {
  // Show onboarding modal
}
```

**We write:**
```typescript
// Actual implementation
if (!profile.onboarded_at) {
  // Show onboarding modal
}
```

---

## TypeScript Types

### Profile Type Definition

```typescript
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  role: 'brand' | 'agency' | null;
  onboarded_at: string | null; // ISO timestamp or null
  logo_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_tier: 'free' | 'starter' | 'pro' | 'business';
  created_at: string;
  updated_at: string;
}
```

### Helper Functions

```typescript
// Check if onboarding is complete
function isOnboardingComplete(profile: Profile): boolean {
  return profile.onboarded_at !== null;
}

// Mark onboarding as complete
function completeOnboarding() {
  return {
    onboarded_at: new Date().toISOString()
  };
}
```

---

## Migration Applied

**File:** `supabase/migrations/20251022_add_role_to_profiles.sql`

```sql
-- Add role to profiles (nullable, constrained)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('brand','agency'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
```

**What this adds:**
- `role` column (text, nullable)
- Constraint: only allows 'brand' or 'agency' values
- Index for efficient role-based queries

---

## Agency Kit Limit Logic

The prompt requires a 3-kit limit for agencies. Since we have `media_kits` table:

```typescript
// Check agency kit count
async function canCreateKit(userId: string, userRole: string): Promise<boolean> {
  if (userRole !== 'agency') return true; // No limit for brands
  
  const { count } = await supabase
    .from('media_kits')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId);
  
  return (count || 0) < 3;
}
```

---

## Summary

✅ **No breaking changes** - We keep all existing columns  
✅ **Backward compatible** - Extra fields (Stripe, brand_color, etc.) remain  
✅ **Minimal migration** - Only added `role` column  
✅ **Code adaptation** - Map prompt's expected fields to actual DB columns  

This approach lets us implement the onboarding flow without disrupting existing functionality or data.


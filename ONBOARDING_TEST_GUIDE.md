# Onboarding Flow - Testing Guide

## Pre-Test Setup

### 1. Run the Migration (If Not Done Yet)
In Supabase SQL Editor, run:
```sql
-- Add role to profiles (nullable, constrained)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('brand','agency'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
```

### 2. Start Dev Server
```bash
cd /Users/davidbrantley/kittie
pnpm dev
```

### 3. Clear Existing Data (Optional - Fresh Test)
In Supabase SQL Editor:
```sql
-- Clear all profiles to test from scratch
UPDATE profiles SET role = NULL, company = NULL, onboarded_at = NULL;
-- Or delete test users entirely
DELETE FROM auth.users WHERE email LIKE 'test%';
```

---

## Test Scenario 1: Brand User - Complete Flow

### Expected Flow:
`Signup → Dashboard → Onboarding Modal → Role → Company Name → Import → Dashboard`

### Steps:

1. **Navigate to Signup**
   - Go to: `http://localhost:3002/signup`
   - **Expected:** See signup form

2. **Create Account**
   - Email: `test-brand@example.com`
   - Password: `password123`
   - Click "Create account"
   - **Expected:** Redirects to `/dashboard`

3. **Onboarding Modal Opens**
   - **Expected:** Modal appears immediately (because `onboarded_at` is NULL)
   - **Title:** "How will you use Kittie?"
   - **Options:** Brand / Agency buttons

4. **Select Brand**
   - Click "Brand" button
   - **Expected:** 
     - Button shows loading state
     - Modal transitions to "What's your business name?"
     - Database: `profiles.role = 'brand'`

5. **Enter Company Name**
   - Enter: "Acme Corporation"
   - Click "Continue"
   - **Expected:**
     - Button shows "Saving..."
     - Modal transitions to "Import your brand assets?"
     - Database: `profiles.company = 'Acme Corporation'`

6. **Skip Import**
   - Click "Skip for now"
   - **Expected:**
     - Modal closes
     - Dashboard shows empty state: "Create your first kit"
     - Database: `profiles.onboarded_at` is now set

7. **Verify Completed State**
   - Refresh page
   - **Expected:** Modal does NOT reopen
   - **See:** "Complete setup" button is gone
   - **See:** "Create Kit" button is visible

---

## Test Scenario 2: Agency User - Complete Flow

### Expected Flow:
`Signup → Dashboard → Onboarding Modal → Role → Agency Message → Dashboard`

### Steps:

1. **Navigate to Signup**
   - Go to: `http://localhost:3002/signup`
   - Email: `test-agency@example.com`
   - Password: `password123`

2. **Create Account**
   - Click "Create account"
   - **Expected:** Redirects to `/dashboard`

3. **Onboarding Modal Opens**
   - **Expected:** Modal appears
   - Select "Agency" button

4. **Agency Step**
   - **Expected:**
     - Title: "Agencies are almost here"
     - Body: "Agency support is launching soon. For now, you can create up to 3 kits for client brands."
     - Buttons: "Create a kit for a brand" / "Maybe later"

5. **Click "Maybe Later"**
   - **Expected:**
     - Modal closes
     - Dashboard shows: "Create kits for your clients"
     - Message: "You can create up to 3 kits today. Full agency support is coming soon."
     - Database: `profiles.role = 'agency'`, `profiles.onboarded_at` is set

6. **Verify Completed**
   - Refresh page
   - **Expected:** Modal does NOT reopen

---

## Test Scenario 3: Dismiss & Reopen Modal

### Steps:

1. **Create new user** (test-dismiss@example.com)

2. **When modal opens, press ESC**
   - **Expected:** Modal closes
   - **See:** "Complete setup" button appears in header

3. **Refresh page**
   - **Expected:** Modal reopens (because `onboarded_at` still NULL)

4. **Click "Complete setup" button**
   - **Expected:** Modal reopens

5. **Complete onboarding**
   - Choose role → Complete steps
   - **Expected:** "Complete setup" button disappears

---

## Test Scenario 4: Agency 3-Kit Limit

### Steps:

1. **Log in as agency user** (test-agency@example.com)

2. **Create Kit 1**
   - Go to: `/dashboard/new-kit` (we'll create this page next)
   - Or use the "Create Client Kit" button
   - **Expected:** Kit created successfully

3. **Create Kit 2**
   - **Expected:** Kit created successfully

4. **Create Kit 3**
   - **Expected:** Kit created successfully

5. **Try to create Kit 4**
   - **Expected:** Error: "AGENCY_LIMIT_REACHED"
   - **Message:** "You've reached the 3-kit limit for agencies"

6. **Log in as brand user**
   - Create 10+ kits
   - **Expected:** No limit enforced

---

## Test Scenario 5: Validation Tests

### Company Name Validation:

1. **Too short (< 2 chars)**
   - Enter: "A"
   - Click Continue
   - **Expected:** Error: "Please enter at least 2 characters"

2. **Too long (> 60 chars)**
   - Enter: 61+ character string
   - **Expected:** Error: "Keep it under 60 characters"

3. **Empty**
   - Leave blank
   - Click Continue
   - **Expected:** Error shown

### Email/Password Validation:

1. **Invalid email**
   - Email: "notanemail"
   - **Expected:** Error on signup

2. **Short password**
   - Password: "12345" (< 6 chars)
   - **Expected:** Error on signup

---

## Test Scenario 6: Already Authenticated User

### Steps:

1. **Log in as existing user**

2. **Navigate to `/signup`**
   - **Expected:** Should redirect to `/dashboard` (if middleware configured)
   - Or stay on signup but show error

3. **Access `/dashboard` directly**
   - **Expected:** Shows dashboard, no redirect to signup

---

## Verification Checklist

After running tests, verify in Supabase:

### Check Profiles Table:
```sql
SELECT id, email, role, company, onboarded_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:**
- Brand users have `role = 'brand'`, `company` filled
- Agency users have `role = 'agency'`, `company` may be NULL
- All completed users have `onboarded_at` timestamp

### Check Media Kits:
```sql
SELECT mk.id, mk.name, mk.owner_id, p.role, COUNT(*) OVER (PARTITION BY mk.owner_id) as kit_count
FROM media_kits mk
JOIN profiles p ON p.id = mk.owner_id
ORDER BY mk.created_at DESC;
```

**Expected:**
- Agency users have ≤ 3 kits
- Brand users can have unlimited kits

---

## Common Issues & Fixes

### ❌ Modal doesn't open
**Check:**
- `onboarded_at` in database (should be NULL for new users)
- Console errors in browser DevTools
- Component rendered on page

**Fix:**
```sql
UPDATE profiles SET onboarded_at = NULL WHERE email = 'test@example.com';
```

### ❌ Role doesn't save
**Check:**
- Network tab shows POST to server action
- Console for errors
- Database `role` column exists

**Fix:**
Run the migration again

### ❌ Company name doesn't save
**Check:**
- Field name is `company` in database (not `business_name`)
- Server action logs

### ❌ "Complete setup" button doesn't appear
**Check:**
- `onboarded_at` is NULL
- Page is rendering the button conditionally

### ❌ Page crashes or shows error
**Check:**
- Browser console for JavaScript errors
- Terminal for Next.js build errors
- Missing dependencies

---

## Success Criteria

✅ **All scenarios complete without errors**  
✅ **Database updates correctly after each step**  
✅ **Modal reopens if dismissed without completing**  
✅ **Modal stays closed after onboarding complete**  
✅ **Agency limit enforced at 3 kits**  
✅ **Brand users have no kit limit**  
✅ **Form validation works correctly**  
✅ **Loading states show during saves**  
✅ **Error messages display when things fail**  

---

## Next Step After Testing

Once testing passes, you'll need to create:
- `/dashboard/new-kit` page for kit creation
- Integration with existing kit editor
- Email verification UI (Phase 6)

**Ready to test!** 🚀


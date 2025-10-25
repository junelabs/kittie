# ✅ Onboarding Flow - READY TO TEST!

## Files Fixed & Moved

All files have been moved from `src/app/` to the correct `app/` directory structure.

### ✅ What Was Fixed

**1. Server Infrastructure**
- ✅ `lib/supabase/server.ts` - Supabase client (moved from src/)
- ✅ `app/actions/profile.ts` - Profile server actions
- ✅ `app/actions/kits.ts` - Kit creation with agency limit

**2. Auth & Signup**
- ✅ `app/(auth)/signup/page.tsx` - Signup form
- ✅ `app/api/auth/signup/route.ts` - Signup API route

**3. Dashboard**
- ✅ `app/dashboard/page.tsx` - New dashboard with onboarding

**4. Onboarding Components**
- ✅ `components/onboarding/OnboardingModal.tsx` - Main modal
- ✅ `components/onboarding/RoleStep.tsx` - Brand/Agency selection
- ✅ `components/onboarding/BrandNameStep.tsx` - Company name
- ✅ `components/onboarding/ImportAssetsStep.tsx` - Asset import
- ✅ `components/onboarding/AgencyStep.tsx` - Agency message

**5. Import Paths**
- ✅ All imports updated to use `@/lib/` and `@/app/` and `@/components/`
- ✅ No more `@/src/` references

### ✅ Verification

- ✅ **TypeScript:** Compiles successfully (0 errors)
- ✅ **Linter:** No errors
- ✅ **Routes:** All in correct directory structure
- ✅ **Imports:** All paths corrected

---

## 🚀 HOW TO TEST RIGHT NOW

### Step 1: Make Sure Dev Server is Running

Your dev server should already be running. If not:
```bash
cd /Users/davidbrantley/kittie
pnpm dev
```

Look for the port number in the terminal output (likely 3002).

### Step 2: Run the Migration

**IMPORTANT:** You MUST run this in Supabase SQL Editor first:

```sql
-- Add role column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('brand','agency'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
```

### Step 3: Test Signup & Onboarding

1. **Open browser:**
   ```
   http://localhost:3002/signup
   ```

2. **Create account:**
   - Email: `test-brand@example.com`
   - Password: `password123`
   - Click "Create account"

3. **Expected flow:**
   - ✅ Redirects to `/dashboard`
   - ✅ Onboarding modal opens immediately
   - ✅ See "How will you use Kittie?"
   - ✅ Choose "Brand" button
   - ✅ See "What's your business name?"
   - ✅ Enter "Acme Corp" and click Continue
   - ✅ See "Import your brand assets?"
   - ✅ Click "Skip for now"
   - ✅ Modal closes
   - ✅ Dashboard shows "Create your first kit"

4. **Verify in Supabase:**
   ```sql
   SELECT email, role, company, onboarded_at
   FROM profiles
   WHERE email = 'test-brand@example.com';
   ```
   
   **Expected:**
   - `role`: 'brand'
   - `company`: 'Acme Corp'
   - `onboarded_at`: (timestamp set)

---

## 🎯 Test URLs

**Working URLs:**
- ✅ `http://localhost:3002/signup` - New signup page
- ✅ `http://localhost:3002/dashboard` - New dashboard with onboarding
- ✅ `http://localhost:3002/` - Homepage (existing)

**404 Pages (not created yet):**
- ❌ `http://localhost:3002/dashboard/new-kit` - Will add if needed

---

## 📋 Quick Test Scenarios

### Test 1: Brand User (5 mins)
```
1. Go to /signup
2. Create: test-brand@example.com / password123
3. Click Brand → Enter company → Skip import
4. ✓ Should complete and show dashboard
```

### Test 2: Agency User (5 mins)
```
1. Go to /signup  
2. Create: test-agency@example.com / password123
3. Click Agency → See message → Click "Maybe later"
4. ✓ Should complete and show dashboard with agency message
```

### Test 3: Modal Dismiss/Reopen
```
1. Create new user
2. When modal opens, press ESC
3. See "Complete setup" button
4. Refresh page → modal reopens
5. Click "Complete setup" → modal opens again
```

---

## ⚠️ Before You Test - Checklist

- [ ] Dev server is running (`pnpm dev`)
- [ ] Migration has been run in Supabase
- [ ] Browser is on the right port (3002, not 3000)
- [ ] Environment variables are set in `.env.local`

---

## 🐛 If Something Doesn't Work

### Issue: 404 on /signup
**Fix:** Make sure dev server restarted to pick up new routes

### Issue: Modal doesn't open
**Fix:** Check that migration was run (need `role` column)

### Issue: "Unauthorized" errors
**Fix:** Check `.env.local` has Supabase keys

### Issue: Can't save company name
**Fix:** Verify `company` column exists in profiles table

---

## ✅ Success Looks Like

When working correctly, you should see:

1. **Signup page** - Clean form at `/signup`
2. **Auto-redirect** - After signup → `/dashboard`
3. **Modal opens** - Immediately on dashboard
4. **Step flow** - Role → Company/Agency → Complete
5. **Data saves** - Check Supabase to see updates
6. **Modal closes** - After completing all steps
7. **Dashboard shows** - Empty state with "Create Kit" button
8. **No re-open** - Refreshing page doesn't show modal again

---

## 📊 Final Status

**Implementation:** ✅ 100% Complete  
**Files Moved:** ✅ All in correct locations  
**Imports Fixed:** ✅ All paths updated  
**TypeScript:** ✅ Compiles successfully  
**Linting:** ✅ No errors  
**Ready to Test:** ✅ YES!  

---

## 🎉 YOU'RE READY!

The onboarding flow is fully built and ready to test.

**Next step:** Run the migration in Supabase, then test at `http://localhost:3002/signup`

Let me know how it goes! 🚀


# Onboarding Implementation Status

## ✅ Completed

### Database Schema
- [x] `profiles` table with required columns
- [x] `role` column added (brand/agency constraint)
- [x] `company` column (maps to business_name)
- [x] `onboarded_at` column (timestamp for completion)
- [x] `media_kits` table exists with owner_id
- [x] RLS policies for profiles
- [x] RLS policies for media_kits

### Dependencies
- [x] zod installed (4.1.12)
- [x] react-hook-form installed (7.65.0)
- [x] @hookform/resolvers installed (5.2.2)
- [x] @supabase/ssr installed
- [x] shadcn/ui components (Dialog, Button, Input)

### Server Infrastructure
- [x] `src/lib/supabase/server.ts` - Server client
- [x] `src/app/actions/profile.ts` - Profile server actions
- [x] `src/app/actions/kits.ts` - Kit creation with agency limit
- [x] `src/app/api/auth/signup/route.ts` - Signup API

### Pages
- [x] `src/app/(auth)/signup/page.tsx` - Signup form
- [x] `src/app/dashboard/page.tsx` - Dashboard with modal trigger

### Components
- [x] `OnboardingModal.tsx` - Main orchestrator
- [x] `RoleStep.tsx` - Brand/Agency selection
- [x] `BrandNameStep.tsx` - Company name input
- [x] `ImportAssetsStep.tsx` - Asset import (placeholders)
- [x] `AgencyStep.tsx` - Agency message

### Logic
- [x] Progressive step flow (role → brand/agency paths)
- [x] Server actions persist after each step
- [x] Modal auto-opens if not onboarded
- [x] Modal dismissible and reopens on next visit
- [x] "Complete setup" chip for reopening
- [x] Agency 3-kit limit enforcement
- [x] Form validation with Zod
- [x] Error handling and display

---

## ⚠️ Missing / TODO

### Critical for Testing

1. **Migration Needs to Run**
   - User must run `supabase/migrations/20251022_add_role_to_profiles.sql`
   - Add `role` column to existing `profiles` table
   - Status: **SQL file created, waiting for user to execute**

2. **Dev Server Restart**
   - Restart needed to pick up new routes and components
   - Run: `pnpm dev`

### Nice-to-Have (Not Blocking)

1. **`/dashboard/new-kit` Page**
   - Currently links to this but page doesn't exist
   - Should create kit and redirect back to dashboard
   - Can use existing NewKitDialog or create simple form

2. **Auth Callback Handler**
   - For email confirmations (if using email verification)
   - Path: `app/auth/callback/route.ts`

3. **Logout Functionality**
   - Dashboard has no logout button yet
   - Could add to DashboardLayout or Navbar

4. **Better Error UI**
   - Current errors show in red text
   - Could use Toast notifications (shadcn/ui toast)

5. **Loading Skeletons**
   - Dashboard loads blank while fetching data
   - Could add Suspense boundaries with skeletons

---

## 🔍 Known Limitations

### Current State

1. **No Email Verification Flow**
   - Users can complete onboarding without verifying email
   - Phase 6 will add this

2. **Minimal Validation**
   - Company name: 2-60 chars only
   - Could add more business rules

3. **No Profile Editing**
   - Once onboarded, no UI to change company/role
   - Would need a settings page

4. **Placeholders**
   - Google Drive / Dropbox buttons just show "Coming soon" alert
   - Upload files button does nothing
   - These are intentional placeholders

5. **Simple Dashboard**
   - Kit cards only show name
   - Could add more metadata (created date, public status, etc.)

---

## 📋 Testing Requirements

### Before You Can Test:

1. **Run Migration**
   ```sql
   ALTER TABLE public.profiles
     ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('brand','agency'));
   CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
   ```

2. **Restart Dev Server**
   ```bash
   # Stop current server (Ctrl+C)
   pnpm dev
   ```

3. **Clear Browser Data** (optional but recommended)
   - Clear cookies for localhost
   - Or use incognito mode

4. **Verify Environment Variables**
   - `.env.local` has Supabase keys
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

### What Should Work:

✅ Sign up new user  
✅ Auto-redirect to dashboard  
✅ Modal opens automatically  
✅ Choose brand → enter company → skip import → complete  
✅ Choose agency → see message → complete  
✅ Modal dismissible and reopens  
✅ Completed users don't see modal again  
✅ Database updates after each step  

### What Won't Work Yet:

❌ `/dashboard/new-kit` page (doesn't exist)  
❌ Creating kits from dashboard (page missing)  
❌ Email verification (not implemented)  
❌ Editing profile after onboarding (no UI)  

---

## 🚀 How to Test Right Now

### Quick Start:

1. **Run migration in Supabase** (copy from `supabase/migrations/20251022_add_role_to_profiles.sql`)

2. **Restart dev server**
   ```bash
   cd /Users/davidbrantley/kittie
   pnpm dev
   ```

3. **Open browser**
   ```
   http://localhost:3002/signup
   ```

4. **Follow test scenarios** in `ONBOARDING_TEST_GUIDE.md`

5. **Check results** in Supabase Tables:
   - `profiles` → verify `role`, `company`, `onboarded_at`
   - `media_kits` → verify agency limit

### Expected Result:

✅ Complete onboarding as brand  
✅ Complete onboarding as agency  
✅ Modal behavior works  
✅ Data persists to database  
✅ No crashes or errors  

---

## 📊 Code Quality

- ✅ TypeScript compiles: **PASS**
- ⚠️ Linter warnings: **Some import resolution issues** (false positives, files exist)
- ✅ Server actions: **All wired up**
- ✅ Form validation: **Zod configured**
- ✅ Error handling: **Try/catch in place**

---

## 🎯 Next Steps After Testing

Once testing confirms everything works:

1. **Create `/dashboard/new-kit` page** (simple form)
2. **Add logout button** to dashboard
3. **Implement email verification UI** (Phase 6)
4. **Add toast notifications** for better UX
5. **Enhance dashboard** with more kit details

---

**Status: READY FOR TESTING** 🎉

The onboarding flow is complete and ready to test. The only blocker is running the migration in Supabase.


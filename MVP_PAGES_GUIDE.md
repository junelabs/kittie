# MVP Pages Implementation Guide

This document explains the three new MVP pages that have been created: `/account`, `/settings`, and `/billing`.

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Pages Overview](#pages-overview)
3. [Implementation Details](#implementation-details)
4. [Testing Guide](#testing-guide)
5. [Next Steps](#next-steps)

---

## 🗄️ Database Setup

### Run the Migration

Before using these pages, you must run the migration to add the required database fields and tables:

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/003_add_user_settings_and_profile_fields.sql`
4. Click **Run** or press `Cmd+Enter`

### What Gets Created

**New Columns in `profiles` table:**
- `full_name` TEXT - User's display name
- `avatar_url` TEXT - URL to user's profile picture
- `role` TEXT - User type ('brand' or 'agency')
- `company` TEXT - Company/workspace name

**New Table: `user_settings`**
- `id` UUID - Primary key
- `user_id` UUID - Foreign key to auth.users
- `theme` TEXT - Theme preference ('system', 'light', 'dark')
- `email_notifications` BOOLEAN - Email notification preference
- `default_workspace` UUID - Default workspace/kit ID
- `language` TEXT - Language preference
- `created_at` TIMESTAMPTZ
- `updated_at` TIMESTAMPTZ

**Storage Bucket: `avatars`**
- Public bucket for user avatar images
- Organized by user ID: `{user_id}/avatar.{ext}`
- RLS policies ensure users can only upload/delete their own avatars

---

## 📄 Pages Overview

### 1. `/account` - Profile Settings

**Purpose:** Let users manage their basic profile information.

**Features:**
- ✅ Avatar upload (JPEG, PNG, WebP, max 5MB)
- ✅ Avatar removal
- ✅ Full name editing
- ✅ Email display (read-only)
- ✅ Account deletion with confirmation modal

**Files:**
- `app/account/page.tsx` - Server component, fetches user data
- `components/account/AccountForm.tsx` - Client component with forms
- `app/actions/profile-actions.ts` - Server actions for profile operations

**Server Actions:**
- `updateProfile(formData)` - Update user's display name
- `uploadAvatar(formData)` - Upload avatar to Supabase Storage
- `removeAvatar()` - Delete avatar from storage
- `deleteAccount()` - Soft-delete user account

### 2. `/settings` - App Preferences

**Purpose:** Manage application settings and preferences.

**Features:**
- ✅ Theme selection (System, Light, Dark)
- ✅ Email notifications toggle
- ✅ Default workspace selection
- ✅ Language selection (English only for now)
- ✅ Real-time theme application

**Files:**
- `app/settings/page.tsx` - Server component, fetches settings
- `components/settings/SettingsForm.tsx` - Client component with settings controls
- `app/actions/settings-actions.ts` - Server actions for settings operations

**Server Actions:**
- `updateSettings(formData)` - Update user preferences (upsert)
- `getSettings()` - Fetch current settings with defaults

### 3. `/billing` - Subscription Management

**Purpose:** One-button access to Stripe Customer Portal for billing management.

**Features:**
- ✅ Current plan display with features list
- ✅ "Manage Billing" button (opens Stripe portal)
- ✅ "Upgrade to Pro" button for free users
- ✅ Plan features breakdown
- ✅ Support contact information

**Files:**
- `app/billing/page.tsx` - Server component, fetches billing data
- `components/billing/BillingCard.tsx` - Client component with billing UI
- `app/actions/billing-actions.ts` - Server actions for Stripe integration

**Server Actions:**
- `createBillingPortalSession()` - Creates Stripe portal session (stub for now)
- `createCheckoutSession()` - Creates checkout session for upgrades (stub for now)

**Note:** Stripe integration is stubbed out. To activate:
1. Install Stripe: `pnpm add stripe`
2. Set environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`
3. Uncomment Stripe code in `billing-actions.ts`
4. Set up Stripe webhooks for subscription events

---

## 🔧 Implementation Details

### Navigation Integration

All three pages are already linked in the `TopBar` navigation:
- **Account Settings** → `/account` (in user dropdown)
- **Billing & Plans** → `/billing` (in user dropdown)
- **Workspace Settings** → `/settings` (in workspace dropdown)

### Security

All pages and actions:
- ✅ Require authentication (redirect to `/signup` if not logged in)
- ✅ Use Row Level Security (RLS) policies
- ✅ Validate all inputs with Zod schemas
- ✅ Only allow users to modify their own data

### Form Validation

**Zod Schemas:**
- Profile: `full_name` (1-100 chars required)
- Avatar: File type (JPEG/PNG/WebP), size (<5MB)
- Settings: Theme enum, workspace UUID, etc.

### Error Handling

All server actions return:
```typescript
{ success: true } | { error: string }
```

All forms display:
- ✅ Error messages (red banner)
- ✅ Success messages (green banner)
- ✅ Loading states on buttons

---

## 🧪 Testing Guide

### Test Account Page

1. Navigate to `/account`
2. **Test Avatar Upload:**
   - Click "Upload" button
   - Select a valid image (<5MB)
   - Verify avatar displays
   - Try uploading invalid files (should show error)
3. **Test Name Update:**
   - Change full name
   - Click "Save Changes"
   - Verify success message
   - Refresh page - name should persist
4. **Test Avatar Removal:**
   - Click "Remove" button
   - Verify avatar disappears
5. **Test Account Deletion:**
   - Click "Delete Account"
   - Verify confirmation modal appears
   - Click "Cancel" - should close
   - Click "Delete Account" again → "Delete Account" in modal
   - Should sign out and redirect to home

### Test Settings Page

1. Navigate to `/settings`
2. **Test Theme:**
   - Select "Light" - page should lighten
   - Select "Dark" - page should darken (if dark mode implemented)
   - Select "System" - should follow OS preference
3. **Test Email Notifications:**
   - Toggle checkbox
   - Click "Save Settings"
   - Refresh page - state should persist
4. **Test Default Workspace:**
   - If you have kits, select one from dropdown
   - Save and verify persistence
5. **Test Language:**
   - Select "English" (only option for now)
   - Save settings

### Test Billing Page

1. Navigate to `/billing`
2. **For Free Users:**
   - Should see "Free" badge
   - Should see "Upgrade to Pro" button
   - Click button - should show "Stripe integration pending" error
3. **For Pro Users (with stripe_customer_id):**
   - Should see "Pro" badge
   - Should see "Manage Billing" button
   - Click button - should show stub message
4. **Verify plan features list:**
   - Should show appropriate features for current plan

---

## 🚀 Next Steps

### Immediate (Must Do)

1. **Run the database migration** in Supabase (see [Database Setup](#database-setup))
2. **Test all three pages** with a real user account
3. **Verify avatar upload** works with Supabase Storage
4. **Check RLS policies** are correctly applied

### Short Term (Optional for MVP)

1. **Implement Sign Out:**
   - Add server action to sign out user
   - Wire up to "Sign out" in user dropdown
   - Clear session and redirect to home

2. **Add Change Password:**
   - Add modal or section in `/account`
   - Use Supabase `updateUser({ password })` method

3. **Improve Theme Switching:**
   - Add CSS for dark mode
   - Persist theme preference across pages
   - Add smooth transition animation

### Long Term (Post-MVP)

1. **Stripe Integration:**
   - Set up Stripe account
   - Create Pro plan product and pricing
   - Implement webhooks for subscription events
   - Test full billing flow

2. **Team/Workspace Management:**
   - Create `/settings` page for workspace settings
   - Implement team invitations
   - Add role-based permissions

3. **Advanced Settings:**
   - Two-factor authentication
   - Session management
   - API keys section
   - Data export

---

## 📚 Code Structure

```
app/
├── account/
│   └── page.tsx              # Account settings page
├── settings/
│   └── page.tsx              # App preferences page
├── billing/
│   └── page.tsx              # Billing & plans page
└── actions/
    ├── profile-actions.ts     # Profile CRUD operations
    ├── settings-actions.ts    # Settings CRUD operations
    └── billing-actions.ts     # Stripe integration

components/
├── account/
│   └── AccountForm.tsx       # Profile form with avatar upload
├── settings/
│   └── SettingsForm.tsx      # Settings form with theme/notifications
└── billing/
    └── BillingCard.tsx       # Plan display & billing portal button

supabase/
└── migrations/
    └── 003_add_user_settings_and_profile_fields.sql
```

---

## 🔍 Troubleshooting

### Avatar upload fails

- **Check:** Supabase Storage bucket `avatars` exists and is public
- **Check:** RLS policies allow authenticated users to upload
- **Check:** File size is <5MB and type is JPEG/PNG/WebP

### Settings don't persist

- **Check:** `user_settings` table exists
- **Check:** RLS policies allow user to insert/update own settings
- **Check:** Browser console for error messages

### Billing button shows error

- **Expected:** Stripe integration is stubbed for MVP
- **To Fix:** Install Stripe SDK and configure environment variables

### Theme doesn't change

- **Check:** Dark mode CSS is implemented in `globals.css`
- **Check:** `documentElement.classList` is being updated
- **Note:** Light/System themes should work out of the box

---

## ✅ Checklist

Before deploying to production:

- [ ] Run database migration
- [ ] Test all forms with valid/invalid data
- [ ] Verify avatar upload/removal works
- [ ] Test account deletion flow
- [ ] Verify settings persistence
- [ ] Check theme switching
- [ ] Ensure all navigation links work
- [ ] Test on mobile responsive design
- [ ] Verify RLS policies are secure
- [ ] Add proper error logging/monitoring
- [ ] (Optional) Set up Stripe integration

---

**Questions or Issues?**

If you encounter any problems or have questions about these MVP pages, please check:
1. Supabase logs for database errors
2. Browser console for client-side errors
3. Server logs for action errors
4. Ensure migration was run successfully

Good luck! 🚀


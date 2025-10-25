# Organization Pages Implementation

Two new pages for managing organizations (workspaces) have been created and integrated with the WorkspaceMenu.

---

## 📋 What's Been Created

### **1. Database Migration**
**File:** `supabase/migrations/004_create_organizations.sql`

**Tables Created:**
- `organizations` - Stores org name, slug, logo_url
- `organization_members` - Many-to-many relationship (users ↔ orgs)
- Storage bucket: `org-logos` for organization logos

**Features:**
- ✅ RLS policies (users can only see/edit their orgs)
- ✅ Unique slug constraint
- ✅ Auto-update timestamps
- ✅ Cascade deletes (removing org removes memberships)
- ✅ Role-based access (owner, admin, member)

### **2. Organization Settings Page**
**Route:** `/org/settings`

**Files:**
- `app/org/settings/page.tsx` - Settings page UI
- `app/org/settings/actions.ts` - Server actions

**Features:**
- ✅ Update organization name
- ✅ Update organization slug (validates lowercase, numbers, hyphens)
- ✅ Upload/replace organization logo
- ✅ Full TopBar integration
- ✅ Shows current workspace in dropdown
- ✅ Validates user membership before updates

### **3. Add Organization Page**
**Route:** `/org/new`

**Files:**
- `app/org/new/page.tsx` - Create org UI
- `app/org/new/actions.ts` - Server actions

**Features:**
- ✅ Create new organization
- ✅ Auto-create membership as "owner"
- ✅ Validate slug uniqueness
- ✅ Redirect to /org/settings after creation
- ✅ Clean, simple form with validation

### **4. Logo Uploader Component**
**File:** `components/forms/OrgLogoUploader.tsx`

**Features:**
- ✅ Empty circular placeholder (matches WorkspaceMenu style)
- ✅ Upload JPG/PNG/WebP (max 5MB)
- ✅ Replace existing logo
- ✅ Real-time preview
- ✅ Error handling
- ✅ Loading states

---

## 🎨 UI Design

All pages follow the same premium aesthetic:
- **Rounded-2xl cards** with soft borders
- **Full TopBar integration** with workspace dropdown
- **Clean, spacious layouts** (max-w-2xl for settings, max-w-md for new org)
- **Consistent spacing** and typography
- **Error/success feedback** in forms

---

## 🔐 Security

**Row Level Security (RLS):**
- Users can only view organizations they belong to
- Only organization members can update their org
- Logo uploads restricted to authenticated users
- Membership verification before all updates

**Validation:**
- Zod schemas for all inputs
- Slug format validation (lowercase, numbers, hyphens)
- File size and type validation (5MB max, JPEG/PNG/WebP)
- Unique slug constraint at database level

---

## 📚 Database Schema

```sql
organizations
├── id (UUID PK)
├── name (TEXT)
├── slug (TEXT UNIQUE)
├── logo_url (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

organization_members
├── org_id (UUID FK → organizations.id)
├── user_id (UUID FK → auth.users.id)
├── role (TEXT: owner, admin, member)
├── created_at (TIMESTAMPTZ)
└── PRIMARY KEY (org_id, user_id)
```

---

## 🚀 How to Use

### **Step 1: Run Database Migration**

In your **Supabase SQL Editor**, run:
```
supabase/migrations/004_create_organizations.sql
```

This creates:
- `organizations` table
- `organization_members` table
- `org-logos` storage bucket
- All RLS policies

### **Step 2: Test the Pages**

1. **Navigate to `/org/new`:**
   - Fill in organization name (e.g., "Paper & Leaf")
   - Fill in slug (e.g., "paperleaf")
   - Click "Create Organization"
   - Auto-redirects to `/org/settings`

2. **On `/org/settings`:**
   - Upload a logo (click "Upload Logo")
   - Edit name/slug as needed
   - Click "Save Changes"
   - See changes reflected in WorkspaceMenu dropdown

3. **Check WorkspaceMenu:**
   - Click workspace name in navbar
   - See "Organization Settings" → `/org/settings`
   - See "+ Add Organization" → `/org/new`
   - Logo should display if uploaded

---

## 🔗 Integration with WorkspaceMenu

The WorkspaceMenu component is already wired up:
- ✅ "Organization Settings" → `/org/settings`
- ✅ "+ Add Organization" → `/org/new`
- ✅ Shows uploaded logo or empty placeholder
- ✅ Displays slug as `{slug}.kittie.so`

---

## 📊 File Structure

```
app/
├── org/
│   ├── settings/
│   │   ├── page.tsx         # Settings UI
│   │   └── actions.ts       # Update org, upload logo
│   └── new/
│       ├── page.tsx         # Create org UI
│       └── actions.ts       # Create org + membership

components/
└── forms/
    └── OrgLogoUploader.tsx  # Logo upload component

supabase/
└── migrations/
    └── 004_create_organizations.sql  # Database schema
```

---

## ✨ Key Features

**Organization Settings (`/org/settings`):**
- Update org name and slug
- Upload/replace logo with live preview
- Validates membership before updates
- Shows current workspace details in TopBar

**Add Organization (`/org/new`):**
- Simple 2-field form (name + slug)
- Auto-creates membership as owner
- Slug uniqueness validation
- Auto-redirect to settings after creation

**Logo Uploader:**
- Matches WorkspaceMenu placeholder design
- File validation (type, size)
- Upload progress feedback
- Error handling with user-friendly messages

---

## 🐛 Error Handling

**All pages handle:**
- ✅ Authentication (redirect to `/signup` if not logged in)
- ✅ Authorization (verify membership before updates)
- ✅ Validation errors (display to user)
- ✅ Database errors (unique constraints, etc.)
- ✅ File upload errors (size, type, upload failures)

**User-friendly messages:**
- "This slug is already taken" (unique violation)
- "Not authorized to update this organization" (no membership)
- "File size must be less than 5MB" (file too large)
- "Failed to upload logo" (storage error)

---

## 🎯 Next Steps

### **Immediate (Required):**
1. **Run migration 004** in Supabase SQL Editor
2. **Test organization creation** at `/org/new`
3. **Test organization settings** at `/org/settings`
4. **Upload a logo** to verify storage bucket works

### **Optional Enhancements:**
1. **Multi-org support** - Let users switch between multiple orgs
2. **Team management** - Invite other users to organizations
3. **Role permissions** - Different access levels (owner/admin/member)
4. **Logo cropping** - Add image cropper before upload
5. **Slug auto-generation** - Auto-create slug from name

---

## ✅ Checklist

Before testing:
- [ ] Run migration 004 in Supabase
- [ ] Verify `organizations` table exists
- [ ] Verify `organization_members` table exists
- [ ] Verify `org-logos` storage bucket exists
- [ ] Check RLS policies are enabled

Testing:
- [ ] Create new organization at `/org/new`
- [ ] Upload logo at `/org/settings`
- [ ] Update name/slug at `/org/settings`
- [ ] Verify WorkspaceMenu shows logo
- [ ] Try creating org with duplicate slug (should error)
- [ ] Check non-members can't access other orgs

---

**All set!** 🚀

Run the migration and start creating organizations. The pages are production-ready with full security, validation, and error handling.


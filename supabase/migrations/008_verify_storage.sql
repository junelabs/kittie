-- =====================================================
-- Diagnostic: Verify Storage Bucket and Policies
-- =====================================================

-- Check if bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'kit-assets';

-- Check storage policies
SELECT 
  schemaname,
  tablename, 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%kit%'
ORDER BY policyname;

-- If bucket doesn't exist or policies are missing, recreate them:

-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kit-assets', 
  'kit-assets', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Drop and recreate storage policies
DROP POLICY IF EXISTS "Kit assets are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can upload kit assets" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can update kit assets" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can delete kit assets" ON storage.objects;

-- Public read access
CREATE POLICY "Kit assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'kit-assets');

-- Authenticated users can upload
CREATE POLICY "Workspace members can upload kit assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kit-assets' 
  AND auth.uid() IS NOT NULL
);

-- Authenticated users can update
CREATE POLICY "Workspace members can update kit assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kit-assets' 
  AND auth.uid() IS NOT NULL
);

-- Authenticated users can delete
CREATE POLICY "Workspace members can delete kit assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kit-assets' 
  AND auth.uid() IS NOT NULL
);

-- Verify policies were created
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%kit%';

-- =====================================================
-- Run this in Supabase SQL Editor to verify/fix storage
-- =====================================================


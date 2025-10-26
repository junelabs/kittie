'use client';

import { useState } from 'react';
import { sbBrowser } from '@/lib/supabase/browser';
import { slugFile } from '@/lib/slug';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamAvatarUploaderProps {
  memberId: string;
  kitId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export default function TeamAvatarUploader({
  memberId,
  kitId,
  currentAvatarUrl,
  onUploadComplete,
}: TeamAvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = sbBrowser();
      
      // Create unique filename
      const slug = slugFile(file.name);
      const filename = `${memberId}-${Date.now()}.${slug.split('.').pop()}`;
      const path = `${kitId}/${filename}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('kit-assets')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kit-assets')
        .getPublicUrl(path);

      // Call the callback to update the team member
      onUploadComplete(publicUrl);
      
    } catch (err: unknown) {
      console.error('Team avatar upload failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={`avatar-${memberId}`}>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={uploading}
          className="w-full cursor-pointer"
          asChild
        >
          <span>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
              </>
            )}
          </span>
        </Button>
      </label>
      <input
        id={`avatar-${memberId}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}


'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { uploadOrgLogo } from '@/app/org/settings/actions';
import { Upload } from 'lucide-react';

export default function OrgLogoUploader({
  orgId,
  initialUrl,
}: {
  orgId: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    startTransition(async () => {
      const result = await uploadOrgLogo(orgId, file);
      
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Empty placeholder until uploaded */}
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/40">
          {url ? (
            <Image 
              src={url} 
              alt="Organization logo" 
              width={64} 
              height={64} 
              className="h-full w-full object-cover" 
            />
          ) : null}
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={pending}
          />
          <Button 
            type="button"
            variant="outline" 
            disabled={pending}
            asChild
          >
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {pending ? 'Uploading...' : url ? 'Replace Logo' : 'Upload Logo'}
            </span>
          </Button>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        JPG, PNG or WebP. Max 5MB. Recommended: 256×256px square.
      </p>
    </div>
  );
}


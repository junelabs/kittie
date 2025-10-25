'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Cloud, HardDrive, ArrowRight } from 'lucide-react';
import { markOnboarded } from '@/app/actions/profile';

export default function ImportAssetsStep({ onComplete }: { onComplete: () => void }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function complete() {
    setErr(null);
    startTransition(async () => {
      try {
        await markOnboarded();
        onComplete();
        // console.log('onboarding_completed');
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to complete onboarding');
      }
    });
  }

  function comingSoon() {
    // Replace with integrations later
    alert('Coming soon');
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Connect a source or skip for now—you can always add assets later.
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          onClick={comingSoon} 
          disabled={pending}
          className="w-full h-auto p-4 flex items-center space-x-3 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <Cloud className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Connect Google Drive</div>
            <div className="text-sm text-gray-600">Import from your Google Drive</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          onClick={comingSoon} 
          disabled={pending}
          className="w-full h-auto p-4 flex items-center space-x-3 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <HardDrive className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Connect Dropbox</div>
            <div className="text-sm text-gray-600">Import from your Dropbox</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          onClick={comingSoon} 
          disabled={pending}
          className="w-full h-auto p-4 flex items-center space-x-3 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            <Upload className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Upload files</div>
            <div className="text-sm text-gray-600">Upload directly from your computer</div>
          </div>
        </Button>
      </div>

      {err && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}

      <Button 
        onClick={complete} 
        disabled={pending}
        className="w-full flex items-center justify-center space-x-2"
      >
        <span>Skip for now</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}


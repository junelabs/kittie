'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Clock } from 'lucide-react';
import { markOnboarded } from '@/app/actions/profile';

export default function AgencyStep({ onComplete }: { onComplete: () => void }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function finish() {
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Agencies are almost here</h2>
          <p className="text-sm text-muted-foreground">
            Agency support is launching soon. For now, you can create up to 3 kits for client brands.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
          <div className="space-y-1">
            <div className="font-medium text-purple-900">What's coming for agencies:</div>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Unlimited client kits</li>
              <li>• Team collaboration tools</li>
              <li>• Client management dashboard</li>
              <li>• White-label options</li>
            </ul>
          </div>
        </div>
      </div>

      {err && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button 
          onClick={finish} 
          disabled={pending}
          className="w-full flex items-center justify-center space-x-2"
        >
          <span>Create a kit for a brand</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={finish} 
          disabled={pending}
          className="w-full"
        >
          Maybe later
        </Button>
      </div>
    </div>
  );
}


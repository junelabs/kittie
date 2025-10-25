'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Users } from 'lucide-react';
import { upsertRole } from '@/app/actions/profile';

export default function RoleStep({ onSelectRole }: { onSelectRole: (r: 'brand' | 'agency') => void }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function choose(r: 'brand' | 'agency') {
    setErr(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('role', r);
      try {
        await upsertRole(fd);
        onSelectRole(r);
        // optional telemetry: console.log('role_selected', r);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to save role');
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Choose the option that best describes you.
        </p>
      </div>
      
      <div className="grid gap-4">
        <Button 
          variant="outline" 
          disabled={pending} 
          onClick={() => choose('brand')}
          className="h-auto p-6 flex flex-col items-start space-y-3 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Brand</div>
              <div className="text-sm text-gray-600">I'm organizing assets for my brand</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          disabled={pending} 
          onClick={() => choose('agency')}
          className="h-auto p-6 flex flex-col items-start space-y-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Agency</div>
              <div className="text-sm text-gray-600">I manage assets for multiple client brands</div>
            </div>
          </div>
        </Button>
      </div>
      
      {err && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}
    </div>
  );
}


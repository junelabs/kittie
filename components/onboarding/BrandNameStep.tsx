'use client';

import { useTransition, useState } from 'react';
import { upsertCompany } from '@/app/actions/profile';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';

const schema = z.object({
  company: z.string().min(2, 'Please enter at least 2 characters').max(60, 'Keep it under 60 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function BrandNameStep({ onNext, onCompanySaved }: { onNext: () => void; onCompanySaved: () => void }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { company: '' },
    mode: 'onChange',
  });

  const companyValue = watch('company');
  const characterCount = companyValue?.length || 0;
  const isNearLimit = characterCount > 50;
  const isAtLimit = characterCount >= 60;

  const submit = (values: FormValues) => {
    setErr(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('company', values.company);
      try {
        await upsertCompany(fd);
        onCompanySaved();
        onNext();
        // optional telemetry: console.log('brand_named');
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to save name');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          This will help us personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Input 
              placeholder="e.g., Paper & Leaf" 
              {...register('company')}
              className={`pr-12 ${errors.company ? 'border-red-300 focus:border-red-500' : isValid && companyValue ? 'border-green-300 focus:border-green-500' : ''}`}
            />
            {isValid && companyValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
          
          {/* Character count and validation */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {errors.company ? (
                <>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-red-600">{errors.company.message}</span>
                </>
              ) : isValid && companyValue ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">Looks good!</span>
                </>
              ) : null}
            </div>
            <div className={`text-xs ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'}`}>
              {characterCount}/60
            </div>
          </div>
        </div>

        {err && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={pending || !isValid}
          className="w-full"
        >
          {pending ? 'Saving…' : 'Continue'}
        </Button>
      </form>
    </div>
  );
}


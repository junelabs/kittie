'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createKit } from '@/app/actions/kits';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(2, 'Please enter at least 2 characters').max(80, 'Keep it under 80 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function NewKitPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const submit = (values: FormValues) => {
    setErr(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set('name', values.name);
        await createKit(fd);
        router.replace('/dashboard');
      } catch (e: any) {
        if (String(e?.message).includes('KIT_LIMIT_REACHED')) {
          setErr("You've reached the 3-kit limit. Delete a kit to create a new one.");
        } else {
          setErr(e?.message ?? 'Failed to create kit');
        }
      }
    });
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Create a new kit</h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input placeholder="Kit name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? 'Creating…' : 'Create'}
        </Button>
      </form>
    </div>
  );
}


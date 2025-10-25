import * as React from 'react';
import { cn } from '@/lib/utils';
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-2xl border px-3 py-2 text-sm outline-none', className)} {...props} />;
}

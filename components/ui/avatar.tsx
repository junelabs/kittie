import * as React from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative inline-flex items-center justify-center overflow-hidden rounded-full', className)}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  if (!src) return null;
  return (
    <img 
      src={src} 
      alt={alt || 'Avatar'} 
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

export function AvatarFallback({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center', className)}>
      {children}
    </div>
  );
}


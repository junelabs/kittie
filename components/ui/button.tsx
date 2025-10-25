import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function Button({
  className, variant='default', size='md', asChild, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:'default'|'outline'|'ghost'|'secondary'; 
  size?:'sm'|'md'|'lg'|'icon';
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-2xl border text-sm font-medium transition cursor-pointer',
        variant==='default'   && 'bg-foreground text-background hover:opacity-90',
        variant==='outline'   && 'bg-background text-foreground hover:bg-muted',
        variant==='secondary' && 'bg-muted text-foreground',
        variant==='ghost'     && 'bg-transparent hover:bg-muted',
        size==='sm'           && 'px-3 py-1.5 text-xs',
        size==='md'           && 'px-4 py-2',
        size==='lg'           && 'px-6 py-3',
        size==='icon'         && 'h-10 w-10',
        className
      )}
      {...props}
    />
  );
}

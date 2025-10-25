import { cn } from '@/lib/utils';
export function Badge({ children, className, variant='default' }: {children:React.ReactNode; className?:string; variant?:'default'|'secondary';}) {
  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs', variant==='secondary' && 'bg-muted', className)}>{children}</span>;
}

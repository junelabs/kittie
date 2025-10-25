import Link from 'next/link';

export function KitCard({ id, name, empty=false }: { id:string; name:string; empty?:boolean; }) {
  return (
    <Link href={`/kits/${id}/edit`} className="block">
      <div className="rounded-2xl border bg-[rgb(var(--kittie-muted))] shadow-sm transition hover:shadow-md">
        <div className="h-32 rounded-t-2xl bg-[rgb(var(--kittie-accent))]/25" />
        <div className="p-4">
          <div className="font-medium">{name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{empty?'No assets yet':'Open kit'}</div>
        </div>
      </div>
    </Link>
  );
}


'use client';

import { MoreHorizontal, Pencil, Archive, Undo2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { renameKit, archiveKit, restoreKit, deleteKit } from '@/app/actions/kits';
import { useState, useTransition, useOptimistic } from 'react';
import { Input } from '@/components/ui/input';

type Kit = {
  id: string;
  name: string;
  archived: boolean;
  updated_at: string;
  logo_url?: string | null;
};

export default function KitsGrid({ kits }: { kits: Kit[] }) {
  if (!kits.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No kits yet. Create your first kit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kits.map((k) => (
        <KitCard key={k.id} kit={k} />
      ))}
    </div>
  );
}

function KitCard({ kit }: { kit: Kit }) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(kit.name);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const [optimisticKit, setOptimisticKit] = useState<Kit & { _deleted?: boolean }>(kit);

  const handleRename = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Optimistic update
    setOptimisticKit({ ...optimisticKit, name: name.trim() });

    start(async () => {
      try {
        await renameKit(kit.id, name.trim());
        setRenaming(false);
      } catch (err: any) {
        setError(err.message || 'Failed to rename kit');
        // Revert optimistic update on error
        setOptimisticKit(kit);
      }
    });
  };

  const handleArchive = () => {
    // Optimistic update
    setOptimisticKit({ ...optimisticKit, archived: true });

    start(async () => {
      try {
        await archiveKit(kit.id);
      } catch (err: any) {
        console.error('Failed to archive kit:', err);
        // Revert optimistic update on error
        setOptimisticKit(kit);
      }
    });
  };

  const handleRestore = () => {
    // Optimistic update
    setOptimisticKit({ ...optimisticKit, archived: false });

    start(async () => {
      try {
        await restoreKit(kit.id);
      } catch (err: any) {
        console.error('Failed to restore kit:', err);
        // Revert optimistic update on error
        setOptimisticKit(kit);
      }
    });
  };

  const handleDelete = () => {
    const confirmed = confirm(
      'Delete this kit permanently? This cannot be undone.'
    );
    if (!confirmed) return;

    // Optimistic update - hide the card immediately
    setOptimisticKit({ ...optimisticKit, _deleted: true });

    start(async () => {
      try {
        await deleteKit(kit.id);
      } catch (err: any) {
        console.error('Failed to delete kit:', err);
        // Revert optimistic update on error
        setOptimisticKit(kit);
      }
    });
  };

  // Hide card if deleted
  if (optimisticKit._deleted) {
    return null;
  }

  return (
    <Card className="group relative overflow-hidden rounded-xl transition-shadow hover:shadow-lg">
      {/* Preview Area */}
      <Link href={`/kits/${optimisticKit.id}/edit`} className="block cursor-pointer">
        <div className="relative h-32 bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          {optimisticKit.logo_url ? (
            <Image
              src={optimisticKit.logo_url}
              alt={optimisticKit.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="text-gray-400 dark:text-gray-600 text-sm font-medium">
              No logo
            </div>
          )}
        </div>
      </Link>

      {/* Kit Name & Actions */}
      <div className="space-y-2 p-4">
        {renaming ? (
          <form onSubmit={handleRename} className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
              autoFocus
              disabled={pending}
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={pending || !name.trim()}
                className="flex-1"
              >
                {pending ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRenaming(false);
                  setName(optimisticKit.name);
                  setError('');
                }}
                disabled={pending}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link href={`/kits/${optimisticKit.id}/edit`} className="cursor-pointer">
                    <h3 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-[var(--brand)] transition-colors">
                      {optimisticKit.name}
                    </h3>
                  </Link>
              {optimisticKit.archived && (
                <p className="text-xs text-muted-foreground mt-1">Archived</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-muted"
                  disabled={pending}
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  <span className="sr-only">Kit actions</span>
                </Button>
              </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-52 rounded-xl border border-gray-200 bg-[radial-gradient(100%_100%_at_50%_0%,#ffffff_0%,#fafafa_100%)] dark:bg-[radial-gradient(100%_100%_at_50%_0%,#0B0B0F_0%,#0A0A0C_100%)] dark:border-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-2"
                    sideOffset={8}
                  >
                <DropdownMenuItem 
                  onClick={() => setRenaming(true)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-muted active:bg-muted/80 cursor-pointer transition-colors"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                  <span className="flex-1">Rename</span>
                </DropdownMenuItem>

                {!kit.archived ? (
                  <DropdownMenuItem 
                    onClick={handleArchive}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-muted active:bg-muted/80 cursor-pointer transition-colors"
                  >
                    <Archive className="h-4 w-4 text-gray-500" />
                    <span className="flex-1">Archive</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={handleRestore}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-muted active:bg-muted/80 cursor-pointer transition-colors"
                  >
                    <Undo2 className="h-4 w-4 text-gray-500" />
                    <span className="flex-1">Restore</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-800" />

                <DropdownMenuItem
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/30 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="flex-1">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </Card>
  );
}


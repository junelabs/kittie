'use client';

import Link from 'next/link';
import { Archive } from 'lucide-react';
import NewKitButton from './NewKitButton';

interface ToolbarProps {
  showArchived?: boolean;
}

export function Toolbar({ showArchived = false }: ToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {showArchived ? 'Archived Kits' : 'My Kits'}
        </h2>
        <Link
          href={showArchived ? '/dashboard' : '/dashboard?view=archived'}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
        >
          <Archive className="size-4" />
          {showArchived ? 'View Active' : 'View Archived'}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <NewKitButton />
      </div>
    </div>
  );
}


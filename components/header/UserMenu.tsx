'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, CreditCard, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    initials: string;
    plan: string;
    avatarUrl?: string;
  };
  unreadCount?: number;
  onSignOut?: () => void;
}

export default function UserMenu({ user, unreadCount = 0, onSignOut }: UserMenuProps) {
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      console.log('Sign out clicked');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-muted transition-colors"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      >
        <Bell className="size-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--brand)] ring-2 ring-white dark:ring-gray-950" />
        )}
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 rounded-full border border-gray-200',
              'px-2 py-1 transition-all hover:bg-muted hover:border-gray-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
              'dark:border-gray-800 dark:hover:border-gray-700'
            )}
          >
            <Avatar className="size-7">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-black">
                <span className="text-white text-xs font-semibold leading-none select-none">{user.initials}</span>
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden min-[361px]:inline">
              Hi, {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="size-4 text-gray-500 hidden min-[361px]:inline" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            'w-80 max-w-[90vw] rounded-2xl border border-gray-200',
            'bg-[radial-gradient(100%_100%_at_50%_0%,#ffffff_0%,#fafafa_100%)]',
            'dark:bg-[radial-gradient(100%_100%_at_50%_0%,#0B0B0F_0%,#0A0A0C_100%)]',
            'dark:border-gray-800',
            'shadow-xl ring-1 ring-black/5 dark:ring-white/10',
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'p-0'
          )}
          sideOffset={8}
        >
          {/* Header: User Identity */}
          <div className="p-3.5 pb-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-12 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-black">
                  <span className="text-white font-semibold text-base leading-none select-none">{user.initials}</span>
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </div>
                <Badge 
                  className={cn(
                    'mt-1.5 text-xs font-medium',
                    'bg-[var(--brand)]/10 text-[var(--brand)]',
                    'ring-1 ring-[var(--brand)]/20',
                    'hover:bg-[var(--brand)]/10'
                  )}
                >
                  {user.plan}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

          {/* Section Label */}
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Your account
          </div>

          {/* Primary Actions */}
          <div className="px-2 pb-2">
            <DropdownMenuItem asChild>
              <Link
                href="/account"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-sm font-medium text-gray-700 dark:text-gray-300',
                  'hover:bg-muted active:bg-muted/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
                  'cursor-pointer transition-colors'
                )}
              >
                <UserRound className="size-4 text-gray-500" />
                <span className="flex-1">Account</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400">
                  ⌘A
                </kbd>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/billing"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-sm font-medium text-gray-700 dark:text-gray-300',
                  'hover:bg-muted active:bg-muted/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
                  'cursor-pointer transition-colors'
                )}
              >
                <CreditCard className="size-4 text-gray-500" />
                <span className="flex-1">Billing & Plans</span>
              </Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

          {/* Footer: Sign Out */}
          <div className="p-2">
            <DropdownMenuItem asChild>
              <button
                onClick={handleSignOut}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-sm font-medium text-gray-700 dark:text-gray-300',
                  'hover:bg-red-50 hover:text-red-600',
                  'dark:hover:bg-red-950/50 dark:hover:text-red-400',
                  'active:bg-red-100 dark:active:bg-red-950',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1',
                  'cursor-pointer transition-colors'
                )}
              >
                <LogOut className="size-4" />
                <span className="flex-1 text-left">Sign out</span>
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * Usage example in a Header component:
 * 
 * ```tsx
 * import UserMenu from '@/components/header/UserMenu';
 * 
 * export function Header() {
 *   const user = {
 *     name: "David Brantley",
 *     email: "david@kittie.so",
 *     initials: "DB",
 *     plan: "Pro",
 *     avatarUrl: "", // optional
 *   };
 * 
 *   const handleSignOut = async () => {
 *     // Your sign out logic
 *     await signOut();
 *   };
 * 
 *   return (
 *     <header className="border-b border-gray-200">
 *       <div className="mx-auto max-w-7xl px-4 py-3">
 *         <div className="flex items-center justify-between">
 *           <div className="flex items-center gap-4">
 *             <Logo />
 *             <Nav />
 *           </div>
 *           
 *           <div className="flex items-center gap-3">
 *             <Button variant="outline" className="rounded-xl">
 *               <Crown className="mr-2 size-4" /> Upgrade
 *             </Button>
 *             <UserMenu 
 *               user={user} 
 *               unreadCount={3} 
 *               onSignOut={handleSignOut}
 *             />
 *           </div>
 *         </div>
 *       </div>
 *     </header>
 *   );
 * }
 * ```
 */


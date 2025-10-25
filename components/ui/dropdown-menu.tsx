'use client';
import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export function DropdownMenuContent(props: React.ComponentProps<typeof Dropdown.Content>) {
  return <Dropdown.Portal><Dropdown.Content sideOffset={12} className={cn('z-50 min-w-[12rem] rounded-2xl border border-gray-200 !bg-white p-2 shadow-xl', props.className)} style={{ backgroundColor: '#ffffff', ...props.style }} {...props} /></Dropdown.Portal>;
}
export function DropdownMenuItem(props: React.ComponentProps<typeof Dropdown.Item>) {
  return <Dropdown.Item className={cn('cursor-pointer select-none rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:bg-gray-50 hover:text-gray-900 [&>a]:block [&>a]:w-full', props.className)} {...props} />;
}
export function DropdownMenuLabel(props: React.ComponentProps<'div'>) {
  return <div className={cn('px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500', props.className)} {...props} />;
}
export const DropdownMenuSeparator = (props: React.ComponentProps<'div'>)=> <div className={cn('my-2 h-px bg-gray-100', props.className)} />;

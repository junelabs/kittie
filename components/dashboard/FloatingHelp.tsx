'use client';
import { MessageCircle } from 'lucide-react';
export function FloatingHelp() {
  return (
    <button
      className="fixed bottom-6 right-6 grid size-12 place-items-center rounded-full bg-[rgb(var(--kittie-accent))] text-white shadow-lg hover:opacity-90"
      aria-label="Help"
    >
      <MessageCircle className="size-6" />
    </button>
  );
}


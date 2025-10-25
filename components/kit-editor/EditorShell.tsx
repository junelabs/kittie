'use client';

import { ReactNode } from 'react';

interface EditorShellProps {
  kitId: string;
  outline: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
}

export default function EditorShell({
  kitId,
  outline,
  canvas,
  inspector,
}: EditorShellProps) {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Outline */}
      <aside className="w-64 border-r bg-white">
        {outline}
      </aside>

      {/* Center: Canvas */}
      <main className="flex-1 overflow-hidden">
        {canvas}
      </main>

      {/* Right: Inspector */}
      <aside className="w-80 border-l bg-white">
        {inspector}
      </aside>
    </div>
  );
}


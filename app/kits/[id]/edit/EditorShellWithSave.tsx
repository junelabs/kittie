'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SaveConfirmModal from './SaveConfirmModal';
import { saveKit } from '../save';
import KitEditorClient from './client';
import type { KitData } from '../actions';

type Props = {
  kitData: KitData;
  userPlan: string;
};

export default function EditorShellWithSave({ kitData, userPlan }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const handleSave = () => {
    start(async () => {
      await saveKit(kitData.kit.id);
      setOpen(true);
    });
  };

  // Handle Cmd+S / Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [kitData.kit.id]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
          >
            ← Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="text-sm font-semibold text-gray-700">Kit Editor</h1>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={pending} 
          size="md" 
          className="min-w-[100px] font-medium cursor-pointer"
          style={{ 
            backgroundColor: '#000000', 
            color: 'white',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            if (!pending) {
              e.currentTarget.style.backgroundColor = '#333333';
            }
          }}
          onMouseLeave={(e) => {
            if (!pending) {
              e.currentTarget.style.backgroundColor = '#000000';
            }
          }}
        >
          {pending ? 'Saving…' : 'Save'}
        </Button>
      </header>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <KitEditorClient kitData={kitData} />
      </div>

      {/* Save Confirmation Modal */}
      <SaveConfirmModal
        kitId={kitData.kit.id}
        kitName={kitData.kit.name}
        isOpen={open}
        onOpenChange={setOpen}
        initialIsPublic={kitData.kit.is_public}
        initialSlug={kitData.kit.slug}
        initialHideBranding={kitData.kit.hide_branding}
        userPlan={userPlan}
      />
    </div>
  );
}


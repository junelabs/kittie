'use client';

import Link from "next/link";
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTransition, useState } from 'react';
import { publishKit } from '../share-actions';
import { Copy, Check, ExternalLink, Lock } from 'lucide-react';

type Props = {
  kitId: string;
  kitName: string;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  initialIsPublic: boolean;
  initialSlug?: string | null;
  initialHideBranding: boolean;
  userPlan?: string;
};

export default function SaveConfirmModal({
  kitId,
  kitName,
  isOpen,
  onOpenChange,
  initialIsPublic,
  initialSlug,
  initialHideBranding,
  userPlan = 'free',
}: Props) {
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(initialSlug ?? '');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [embedMode, setEmbedMode] = useState<'inline' | 'modal' | 'fullpage'>('inline');

  const isFreeUser = userPlan === 'free';
  const [brandSlug, setBrandSlug] = useState('brand'); // Will be updated when kit is published
  const kitSlug = slug || kitName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const publicUrl = `https://kittie.so/${brandSlug}/${kitSlug}`;
  
  // Generate embed code based on mode
  const getEmbedCode = () => {
    const baseUrl = publicUrl;
    
    switch (embedMode) {
      case 'inline':
        return `<div id="kittie-${kitId}"></div>
<script async src="https://kittie.so/embed.js" data-kit="${kitId}" data-mode="inline"></script>`;
      
      case 'modal':
        return `<button onclick="window.KittieEmbed.open('${kitId}')">View Press Kit</button>
<script async src="https://kittie.so/embed.js" data-kit="${kitId}" data-mode="modal"></script>`;
      
      case 'fullpage':
        return `<script async src="https://kittie.so/embed.js" data-kit="${kitId}" data-mode="fullpage"></script>`;
      
      default:
        return `<script async src="https://kittie.so/embed.js" data-kit="${kitId}"></script>`;
    }
  };

  const embedCode = getEmbedCode();

  // Auto-publish on mount if not already public
  React.useEffect(() => {
    if (!initialIsPublic && isOpen) {
      start(async () => {
        const { slug: s, brandSlug: bs } = await publishKit(kitId, kitName);
        setSlug(s);
        setBrandSlug(bs);
      });
    } else if (initialSlug) {
      setSlug(initialSlug);
    }
  }, [isOpen, initialIsPublic, kitId, kitName, initialSlug]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[540px] rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <DialogHeader className="pb-4 pt-2">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            Your media kit is live!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-hidden">
          {/* Public URL Section */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-gray-700">View it at:</label>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <code className="text-xs font-mono text-gray-900 whitespace-nowrap">{publicUrl}</code>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyUrl}
                className="shrink-0 rounded-xl h-[38px] w-[38px] p-0"
              >
                {copiedUrl ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Open in new tab <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Embed Code Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Embed code</label>
              
              {/* Mode selector */}
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setEmbedMode('inline')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    embedMode === 'inline'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inline
                </button>
                <button
                  onClick={() => setEmbedMode('modal')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    embedMode === 'modal'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Modal
                </button>
                <button
                  onClick={() => setEmbedMode('fullpage')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    embedMode === 'fullpage'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Full Page
                </button>
              </div>
            </div>

            {/* Description for each mode */}
            <p className="text-xs text-muted-foreground">
              {embedMode === 'inline' && 'Embeds directly in your page content'}
              {embedMode === 'modal' && 'Opens in a popup overlay when triggered'}
              {embedMode === 'fullpage' && 'Takes over the entire page'}
            </p>

            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide px-3.5 py-2.5">
                  <code className="text-xs font-mono text-gray-900 leading-tight whitespace-pre-wrap block">{embedCode}</code>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 rounded-xl h-[38px] w-[38px] p-0"
                onClick={handleCopyEmbed}
              >
                {copiedEmbed ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Branding Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {isFreeUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900">Remove Kittie branding</p>
                  <p className="text-xs text-muted-foreground">
                    {isFreeUser 
                      ? 'Hide "Powered by Kittie" footer' 
                      : 'No branding on your kit'}
                  </p>
                </div>
              </div>
              <Switch
                checked={!isFreeUser && initialHideBranding}
                disabled={isFreeUser}
                className={isFreeUser ? 'opacity-40 cursor-not-allowed' : ''}
              />
            </div>

            {/* Upgrade CTA for Free Users */}
            {isFreeUser && (
              <Button
                className="w-full rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium border border-orange-200 hover:border-orange-300 transition-colors"
                asChild
              >
                <Link href="/billing">
                  Upgrade to Starter — $19/mo
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="mt-8 flex-row gap-3 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl"
          >
            Continue editing
          </Button>
          <Button 
            asChild 
            variant="default"
            className="flex-1 rounded-xl"
          >
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


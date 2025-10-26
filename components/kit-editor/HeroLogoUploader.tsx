"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { sbBrowser } from "@/lib/supabase/browser";
import { slugFile } from "@/lib/slug";
import { setHeroLogo } from "@/app/kits/[id]/actions";
import { Button } from "@/components/ui/button";

type Props = { 
  kitId: string; 
  initialUrl?: string;
  onLogoUpdate?: (url: string) => void;
};

export default function HeroLogoUploader({ kitId, initialUrl, onLogoUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string | undefined>(initialUrl);
  const [progress, setProgress] = useState<string>("");
  const [pending, start] = useTransition();

  // Sync URL state with initialUrl prop changes
  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  async function handleFile(file: File) {
    const supabase = sbBrowser();
    const path = `kits/${kitId}/hero/${crypto.randomUUID()}-${slugFile(file.name)}`;

    setProgress("Uploading…");
    const { error } = await supabase.storage.from("kit-assets").upload(path, file, { upsert: true });
    if (error) {
      setProgress(error.message);
      return;
    }

    const { data } = supabase.storage.from("kit-assets").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    start(async () => {
      try {
        console.log('[HeroLogo] Calling setHeroLogo with:', { kitId, publicUrl });
        await setHeroLogo(kitId, publicUrl);
        console.log('[HeroLogo] Success!');
        setUrl(publicUrl);
        setProgress("Saved");
        setTimeout(() => setProgress(""), 1200);
        
        // Notify parent component of logo update
        if (onLogoUpdate) {
          onLogoUpdate(publicUrl);
        }
      } catch (err: unknown) {
        console.error('[HeroLogo] Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setProgress(`Error: ${errorMessage}`);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-dashed p-4 text-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.currentTarget.files?.[0] && handleFile(e.currentTarget.files[0])}
        />
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={pending}>
          {pending ? "Uploading…" : url ? "Replace Logo" : "Upload Logo"}
        </Button>
        {progress && <div className="mt-2 text-xs text-muted-foreground">{progress}</div>}
      </div>

      {url ? (
        <div className="overflow-hidden rounded-xl border bg-card p-3">
          <Image
            src={url}
            alt="Brand logo"
            width={600}
            height={300}
            className="mx-auto h-28 w-auto object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}


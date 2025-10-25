"use client";

import { useRef, useState, useTransition } from "react";
import { sbBrowser } from "@/lib/supabase/browser";
import { slugFile } from "@/lib/slug";
import { recordUploadedAssets } from "@/app/kits/[id]/actions";
import { validateFileUpload, sanitizeFileName, getFileCategory } from "@/lib/file-security";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Props = {
  kitId: string;
  sectionId: string;
  onDone?: () => void;
  label?: string; // e.g., "Upload logos" or "Upload photos"
};

export default function MultiUpload({
  kitId,
  sectionId,
  onDone,
  label = "Upload files",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<string>("");

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const supabase = sbBrowser();

    console.log('[MultiUpload] Starting upload process for', list.length, 'files');
    const metas: { url: string }[] = [];
    setStatus(`Uploading ${list.length} file(s)…`);

    for (const file of Array.from(list)) {
      console.log('[MultiUpload] Uploading file:', file.name, 'Size:', file.size);
      
      // Security validation
      const fileCategory = getFileCategory(file.type);
      const validation = validateFileUpload(file, fileCategory);
      
      if (!validation.isValid) {
        console.error(`File validation failed for ${file.name}:`, validation.error);
        setStatus(`Error: ${validation.error}`);
        continue;
      }
      
      // Sanitize filename
      const sanitizedName = sanitizeFileName(file.name);
      const path = `kits/${kitId}/sections/${sectionId}/${crypto.randomUUID()}-${slugFile(
        sanitizedName
      )}`;
      console.log('[MultiUpload] Upload path:', path);
      
      const { error } = await supabase.storage
        .from("kit-assets")
        .upload(path, file, { upsert: false });
      if (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setStatus(`Error uploading ${file.name}: ${error.message}`);
        continue;
      }
      console.log('[MultiUpload] Successfully uploaded:', file.name);
      const { data } = supabase.storage.from("kit-assets").getPublicUrl(path);
      metas.push({ url: data.publicUrl });
    }

    start(async () => {
      try {
        console.log('[MultiUpload] Calling recordUploadedAssets with:', { sectionId, count: metas.length, metas });
        if (metas.length === 0) {
          setStatus("No files were uploaded successfully");
          return;
        }
        console.log('[MultiUpload] About to call recordUploadedAssets...');
        await recordUploadedAssets(sectionId, metas);
        console.log('[MultiUpload] recordUploadedAssets completed successfully!');
        setStatus("Saved");
        setTimeout(() => setStatus(""), 1200);
        onDone?.();
      } catch (err: any) {
        console.error('[MultiUpload] Error:', err);
        setStatus(`Error: ${err.message}`);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-gray-400"
        onClick={() => inputRef.current?.click()}
        style={{ cursor: pending ? "default" : "pointer" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.currentTarget.files)}
          disabled={pending}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Upload className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {pending ? "Uploading…" : "Drop files here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Multiple files supported · PNG, JPG, WEBP, SVG
            </p>
          </div>
        </div>
        {status && (
          <div className="mt-3 rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            {status}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
        >
          {pending ? "Uploading…" : label}
        </Button>
      </div>
    </div>
  );
}


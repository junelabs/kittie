"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { MediaKit } from "../../../types";

interface EmbedModalProps {
  kit: MediaKit;
  onClose: () => void;
}

export function EmbedModal({ kit, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  
  const embedCode = `<iframe src="https://kittie.so/embed/${kit.public_id}" style="width:100%;border:0;min-height:560px" loading="lazy"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Embed Kit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="embedCode">Embed Code</Label>
            <div className="relative">
              <Input
                id="embedCode"
                value={embedCode}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border border-amber-200 rounded-md p-4 bg-[#fcfcf0]">
              <p className="text-sm text-amber-700 mb-2">
                This is how your kit will appear when embedded:
              </p>
              <div className="border border-amber-200 rounded bg-white p-4 text-center">
                <p className="text-sm text-amber-600">
                  Kit: <strong>{kit.name}</strong>
                </p>
                <p className="text-xs text-amber-500 mt-1">
                  (Preview not available - use the embed code above)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

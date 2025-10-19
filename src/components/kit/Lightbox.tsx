"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Copy, ExternalLink } from "lucide-react";
import { Asset } from "../../../types";

interface LightboxProps {
  asset: Asset;
  onClose: () => void;
}

export function Lightbox({ asset, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.file_url;
    link.download = asset.label || 'asset';
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.file_url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Image */}
        <div className="relative">
          <img
            src={asset.file_url}
            alt={asset.alt_text || asset.label || 'Asset'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>

        {/* Actions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyLink}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(asset.file_url, '_blank')}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>

        {/* Asset info */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
          <p className="text-sm font-medium">{asset.label || 'Untitled Asset'}</p>
          {asset.size_bytes && (
            <p className="text-xs text-gray-300">
              {Math.round(asset.size_bytes / 1024)} KB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

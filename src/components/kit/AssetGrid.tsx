"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Copy, FileText, Image, Palette } from "lucide-react";
import { Asset } from "../../../types";

interface AssetGridProps {
  assetIds: string[];
  assetsById: Record<string, Asset>;
  onAssetClick: (asset: Asset) => void;
  onCopyLink: (asset: Asset) => void;
}

export function AssetGrid({ assetIds, assetsById, onAssetClick, onCopyLink }: AssetGridProps) {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const getAssetIcon = (asset: Asset) => {
    if (asset.mime?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-gray-400" />;
    } else if (asset.kind === 'logo') {
      return <Palette className="h-8 w-8 text-gray-400" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  if (assetIds.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardContent className="p-16 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-subtle flex items-center justify-center mx-auto mb-6">
            <Image className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-heading mb-3">No assets yet</h3>
          <p className="text-body">Upload your first asset to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {assetIds.map((assetId) => {
        const asset = assetsById[assetId];
        if (!asset) return null;

        const isHovered = hoveredAsset === asset.id;
        const isImage = asset.mime?.startsWith('image/');

        return (
          <Card
            key={asset.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-elevated border-gray-200 overflow-hidden"
            onMouseEnter={() => setHoveredAsset(asset.id)}
            onMouseLeave={() => setHoveredAsset(null)}
            onClick={() => onAssetClick(asset)}
          >
            <CardContent className="p-0">
              <div className="aspect-square relative overflow-hidden">
                {isImage ? (
                  <img
                    src={asset.file_url}
                    alt={asset.alt_text || asset.label || 'Asset'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {getAssetIcon(asset)}
                  </div>
                )}
                
                {/* Hover overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center space-x-3 backdrop-blur-sm">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-gray-900 shadow-elevated"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssetClick(asset);
                      }}
                    >
                      {isImage ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-gray-900 shadow-elevated"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyLink(asset);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {asset.label || 'Untitled Asset'}
                  </h3>
                  {!isImage && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
                      {getFileExtension(asset.file_path)}
                    </span>
                  )}
                </div>
                <p className="text-caption">
                  {asset.size_bytes ? `${Math.round(asset.size_bytes / 1024)} KB` : 'Unknown size'}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
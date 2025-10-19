"use client";

import { Asset } from "../../../types";
import { AssetGrid } from "./AssetGrid";

interface LegacyAssetGridProps {
  assets: Asset[];
  onReorder: (updates: { id: string; order_index: number; }[]) => void;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
}

export function LegacyAssetGrid({ assets, onReorder, onUpdate, onDelete }: LegacyAssetGridProps) {
  // Create lookup map for the new AssetGrid
  const assetsById = assets.reduce((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  }, {} as Record<string, Asset>);

  const assetIds = assets
    .sort((a, b) => a.order_index - b.order_index)
    .map(asset => asset.id);

  const handleAssetClick = (asset: Asset) => {
    // For now, just download the asset
    const link = document.createElement('a');
    link.href = asset.file_url;
    link.download = asset.label || 'asset';
    link.click();
  };

  const handleCopyLink = (asset: Asset) => {
    navigator.clipboard.writeText(asset.file_url);
  };

  return (
    <AssetGrid
      assetIds={assetIds}
      assetsById={assetsById}
      onAssetClick={handleAssetClick}
      onCopyLink={handleCopyLink}
    />
  );
}

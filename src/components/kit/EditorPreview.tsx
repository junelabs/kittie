"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, ExternalLink } from "lucide-react";
import { MediaKit, Section, Asset, TeamMember } from "../../../types";
import { getContrastTextColor } from "../../../lib/theme";
import { AssetGrid } from "./AssetGrid";
import { TeamGrid } from "./TeamGrid";
import { Lightbox } from "./Lightbox";

interface EditorPreviewProps {
  kit: MediaKit;
  sections: Section[];
  assets: Asset[];
  teamMembers: TeamMember[];
  assetsById: Record<string, Asset>;
  teamMembersById: Record<string, TeamMember>;
}

export function EditorPreview({ 
  kit, 
  sections, 
  assets, 
  teamMembers, 
  assetsById, 
  teamMembersById 
}: EditorPreviewProps) {
  const [lightboxAsset, setLightboxAsset] = useState<Asset | null>(null);

  const visibleSections = sections
    .filter(section => section.visible)
    .sort((a, b) => a.order_index - b.order_index);

  const handlePrimaryCta = () => {
    if (kit.primary_cta_action === 'downloadAll') {
      window.open(`/api/zip/${kit.public_id}`, '_blank');
    } else if (kit.primary_cta_action === 'openUrl' && kit.primary_cta_url) {
      window.open(kit.primary_cta_url, '_blank');
    }
  };

  const handleAssetClick = (asset: Asset) => {
    if (asset.mime?.startsWith('image/')) {
      setLightboxAsset(asset);
    } else {
      // Download non-image assets directly
      const link = document.createElement('a');
      link.href = asset.file_url;
      link.download = asset.label || 'asset';
      link.click();
    }
  };

  const handleCopyLink = (asset: Asset) => {
    navigator.clipboard.writeText(asset.file_url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-8">
        <h1 className="text-display mb-6">
          {kit.name}
        </h1>
        <p className="text-body text-lg mb-10 max-w-3xl mx-auto">
          {kit.description || "Add a short description to introduce your kit."}
        </p>
        {kit.primary_cta_label && (
          <Button
            size="lg"
            onClick={handlePrimaryCta}
            className="px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            style={{
              backgroundColor: kit.primary_cta_action === 'downloadAll' ? '#4f46e5' : (kit.brand_color || '#0f172a'),
              color: kit.primary_cta_action === 'downloadAll' ? '#ffffff' : getContrastTextColor(kit.brand_color || '#0f172a'),
            }}
          >
            {kit.primary_cta_action === 'downloadAll' ? (
              <Download className="mr-3 h-5 w-5" />
            ) : (
              <ExternalLink className="mr-3 h-5 w-5" />
            )}
            {kit.primary_cta_label}
          </Button>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-20 px-8">
        {visibleSections.map((section) => (
          <div key={section.id} className="space-y-8">
            <div className="text-center">
              <h2 className="text-heading mb-4">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-body max-w-3xl mx-auto">
                  {section.description}
                </p>
              )}
            </div>

            {section.kind === 'assets' ? (
              <AssetGrid
                assetIds={assets
                  .filter(asset => asset.section_id === section.id)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(asset => asset.id)
                }
                assetsById={assetsById}
                onAssetClick={handleAssetClick}
                onCopyLink={handleCopyLink}
              />
            ) : (
              <TeamGrid
                memberIds={teamMembers
                  .filter(member => member.section_id === section.id)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(member => member.id)
                }
                teamMembersById={teamMembersById}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      {kit.show_powered_by && (
        <div className="text-center py-16 px-8 border-t border-amber-100 mt-20">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-semibold mb-6 shadow-subtle hover:shadow-elevated transition-all duration-200 border-amber-200 hover:bg-[#fcfcf0] text-amber-700"
          >
            <Share className="mr-3 h-5 w-5" />
            Share Kit
          </Button>
          <p className="text-caption text-amber-600">
            Powered by <span className="font-semibold text-orange-800">Kittie</span>
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxAsset && (
        <Lightbox
          asset={lightboxAsset}
          onClose={() => setLightboxAsset(null)}
        />
      )}
    </div>
  );
}

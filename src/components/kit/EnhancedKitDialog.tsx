"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KitPreview } from "./KitPreview";
import { KitCreateEditForm } from "./KitCreateEditForm";
import { MediaKit, Section, Asset, TeamMember } from "../../../types";

interface EnhancedKitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedKitDialog({ open, onOpenChange }: EnhancedKitDialogProps) {
  const router = useRouter();
  const [, setIsLoading] = useState(false);
  
  // Initialize with default kit data
  const [kit, setKit] = useState<MediaKit>({
    id: `kit_${Date.now()}`,
    owner_id: '',
    name: '',
    description: null,
    brand_color: '#6366f1',
    public_id: '',
    is_public: false,
    primary_cta_label: 'Download All Assets',
    primary_cta_action: 'downloadAll',
    primary_cta_url: null,
    show_powered_by: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const handleKitChange = (newKit: MediaKit) => {
    setKit(newKit);
  };

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections);
  };

  const handleAssetsChange = (newAssets: Asset[]) => {
    setAssets(newAssets);
  };

  const handleTeamMembersChange = (newTeamMembers: TeamMember[]) => {
    setTeamMembers(newTeamMembers);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/kits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: kit.name.trim(),
          description: kit.description,
          brand_color: kit.brand_color,
          is_public: kit.is_public,
          primary_cta_label: kit.primary_cta_label,
          primary_cta_action: kit.primary_cta_action,
          primary_cta_url: kit.primary_cta_url,
          show_powered_by: kit.show_powered_by,
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create kit");
      }
    } catch (error) {
      console.error("Error creating kit:", error);
      alert("Failed to create kit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${kit.public_id}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-screen sm:max-h-[85vh] sm:h-[85vh] p-0 overflow-hidden sm:max-w-[90vw] lg:max-w-[85vw] [&>div]:p-0">
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Side - Preview */}
          <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-gray-200 flex flex-col min-h-0 bg-gradient-to-b from-gray-50 to-white">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-green-50 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  Live preview - Media Kit
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
              <KitPreview 
                kit={kit}
                sections={sections}
                assets={assets}
                teamMembers={teamMembers}
              />
            </div>
            <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0">
              <p className="text-xs text-gray-400 text-center">
                Powered by <span className="font-medium">Kittie</span>
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex flex-col min-h-0">
            <KitCreateEditForm
              kit={kit}
              sections={sections}
              assets={assets}
              teamMembers={teamMembers}
              onKitChange={handleKitChange}
              onSectionsChange={handleSectionsChange}
              onAssetsChange={handleAssetsChange}
              onTeamMembersChange={handleTeamMembersChange}
              onSave={handleSave}
              onCopyEmbed={handleCopyEmbed}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
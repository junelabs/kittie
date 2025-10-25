'use client';

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import ColorPicker from '@/components/ui/color-picker';
import HeroLogoUploader from './HeroLogoUploader';
import MultiUpload from './MultiUpload';
import AssetGrid from './AssetGrid';
import TeamEditor from './TeamEditor';
import type { Kit, KitSection, KitAsset, KitTeamMember } from '@/app/kits/[id]/actions';

interface InspectorProps {
  kit: Kit;
  selectedSection: KitSection | null;
  sectionAssets: KitAsset[];
  team: KitTeamMember[];
  onUpdateHero: (data: {
    name?: string;
    description?: string;
    buttonLabel?: string;
    buttonColor?: string;
    logoUrl?: string;
  }) => Promise<void>;
  onUpdateSection: (id: string, data: {
    title?: string;
    description?: string;
  }) => Promise<void>;
  onAddTeamMember: (data: { name: string; title?: string }) => Promise<void>;
  onUpdateTeamMember: (id: string, data: { name?: string; title?: string }) => Promise<void>;
  onReorderTeam: (orderedIds: string[]) => Promise<void>;
  onDeleteTeamMember: (id: string) => Promise<void>;
  onAssetsUpdated?: () => void;
  onAssetDeleted?: () => void;
}

export default function Inspector({
  kit,
  selectedSection,
  sectionAssets,
  team,
  onUpdateHero,
  onUpdateSection,
  onAddTeamMember,
  onUpdateTeamMember,
  onReorderTeam,
  onDeleteTeamMember,
  onAssetsUpdated,
  onAssetDeleted,
}: InspectorProps) {
  const [pending, startTransition] = useTransition();
  const [heroData, setHeroData] = useState({
    name: kit.name,
    description: kit.description || '',
    buttonLabel: kit.button_label || '',
    buttonColor: kit.button_color || '#FF6B6B',
  });

  const [sectionData, setSectionData] = useState({
    title: '',
    description: '',
  });

  // Refs for debounce timers
  const heroDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});
  const sectionDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Update hero data when kit changes
  useEffect(() => {
    setHeroData({
      name: kit.name,
      description: kit.description || '',
      buttonLabel: kit.button_label || '',
      buttonColor: kit.button_color || '#FF6B6B',
    });
  }, [kit]);

  // Update section data when selected section changes
  useEffect(() => {
    if (selectedSection) {
      setSectionData({
        title: selectedSection.title || '',
        description: selectedSection.description || '',
      });
    }
  }, [selectedSection]);

  // Debounced hero update
  const debouncedHeroUpdate = useCallback((field: keyof typeof heroData, value: string) => {
    // Clear existing timer for this field
    if (heroDebounceRef.current[field]) {
      clearTimeout(heroDebounceRef.current[field]);
    }

    // Set new timer
    heroDebounceRef.current[field] = setTimeout(() => {
      startTransition(async () => {
        await onUpdateHero({ [field]: value });
      });
    }, 600);
  }, [onUpdateHero]);

  // Debounced section update
  const debouncedSectionUpdate = useCallback((field: keyof typeof sectionData, value: string) => {
    if (!selectedSection) return;

    // Clear existing timer for this field
    if (sectionDebounceRef.current[field]) {
      clearTimeout(sectionDebounceRef.current[field]);
    }

    // Set new timer
    sectionDebounceRef.current[field] = setTimeout(() => {
      startTransition(async () => {
        await onUpdateSection(selectedSection.id, { [field]: value });
      });
    }, 600);
  }, [selectedSection, onUpdateSection]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(heroDebounceRef.current).forEach(clearTimeout);
      Object.values(sectionDebounceRef.current).forEach(clearTimeout);
    };
  }, []);

  if (!selectedSection) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a section to edit its properties
        </p>
      </div>
    );
  }

  const isHero = selectedSection.type === 'hero';
  const isTeam = selectedSection.type === 'team';
  const isAssetSection = selectedSection.type === 'logos' || selectedSection.type === 'gallery';

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">
          {isHero ? 'Kit Settings' : 'Section Settings'}
        </h2>
      </div>

      <div className="space-y-6 p-4">
        {isHero ? (
          <>
            {/* Hero / Kit Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kit-name">Kit Title</Label>
                <Input
                  id="kit-name"
                  value={heroData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHeroData({ ...heroData, name: value });
                    debouncedHeroUpdate('name', value);
                  }}
                  placeholder="e.g., Paper & Leaf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kit-description">Description</Label>
                <Textarea
                  id="kit-description"
                  value={heroData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHeroData({ ...heroData, description: value });
                    debouncedHeroUpdate('description', value);
                  }}
                  placeholder="Brief description of your brand..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kit-button">Download Button Label</Label>
                <Input
                  id="kit-button"
                  value={heroData.buttonLabel}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHeroData({ ...heroData, buttonLabel: value });
                    debouncedHeroUpdate('buttonLabel', value);
                  }}
                  placeholder="Download Brand Kit"
                />
              </div>

              <ColorPicker
                label="Button Color"
                value={heroData.buttonColor}
                onChange={(hex) => {
                  // Update local state immediately for smooth UI
                  setHeroData({ ...heroData, buttonColor: hex });
                }}
                onChangeComplete={(hex) => {
                  // Only save to database after user stops dragging
                  startTransition(async () => {
                    await onUpdateHero({ buttonColor: hex });
                  });
                }}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <HeroLogoUploader 
                kitId={kit.id} 
                initialUrl={kit.logo_url ?? undefined}
                onLogoUpdate={(url) => onUpdateHero({ logoUrl: url })}
              />
            </div>
          </>
        ) : isTeam ? (
          /* Team Section */
          <TeamEditor
            kitId={kit.id}
            team={team}
            onAdd={onAddTeamMember}
            onUpdate={onUpdateTeamMember}
            onReorder={onReorderTeam}
            onDelete={onDeleteTeamMember}
          />
        ) : (
          <>
            {/* Asset Section (Logos / Gallery) */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={sectionData.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSectionData({ ...sectionData, title: value });
                    debouncedSectionUpdate('title', value);
                  }}
                  placeholder={selectedSection.type === 'logos' ? 'Brand Logos' : 'Photo Gallery'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  value={sectionData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSectionData({ ...sectionData, description: value });
                    debouncedSectionUpdate('description', value);
                  }}
                  placeholder="Section description..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {isAssetSection && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload</Label>
                  <MultiUpload
                    kitId={kit.id}
                    sectionId={selectedSection.id}
                    label={selectedSection.type === 'logos' ? 'Upload Logos' : 'Upload Photos'}
                    onDone={onAssetsUpdated}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Assets</Label>
                  <AssetGrid
                    kitId={kit.id}
                    sectionId={selectedSection.id}
                    assets={sectionAssets}
                    onAssetDeleted={onAssetDeleted}
                    onAssetUpdated={onAssetsUpdated}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


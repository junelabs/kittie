'use client';

import { useState, useTransition } from 'react';
import EditorShell from '@/components/kit-editor/EditorShell';
import Outline from '@/components/kit-editor/Outline';
import Canvas from '@/components/kit-editor/Canvas';
import Inspector from '@/components/kit-editor/Inspector';
import type { KitData } from '../actions';
import {
  updateKitHero,
  addSection,
  updateSectionMeta,
  reorderSections,
  deleteSection,
  syncTeamFromWorkspace,
  addTeamMember,
  updateTeamMember,
  reorderTeamMembers,
  deleteTeamMember,
} from '../actions';

interface KitEditorClientProps {
  kitData: KitData;
}

export default function KitEditorClient({ kitData: initialData }: KitEditorClientProps) {
  const [kitData, setKitData] = useState(initialData);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialData.sections[0]?.id || null
  );
  const [pending, startTransition] = useTransition();

  const selectedSection = kitData.sections.find((s) => s.id === selectedSectionId) || null;
  const sectionAssets = selectedSection ? (kitData.assets[selectedSection.id] || []) : [];

  // Hero handlers
  const handleUpdateHero = async (data: {
    name?: string;
    description?: string;
    buttonLabel?: string;
    buttonColor?: string;
    logoUrl?: string;
  }) => {
    startTransition(async () => {
      await updateKitHero({ id: kitData.kit.id, ...data });
      setKitData((prev) => ({
        ...prev,
        kit: {
          ...prev.kit,
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.buttonLabel !== undefined && { button_label: data.buttonLabel }),
          ...(data.buttonColor !== undefined && { button_color: data.buttonColor }),
          ...(data.logoUrl !== undefined && { logo_url: data.logoUrl }),
        },
      }));
    });
  };

  // Hero logo upload now handled by HeroLogoUploader component

  // Section handlers
  const handleAddSection = async (type: 'logos' | 'gallery') => {
    const newSection = await addSection({ kitId: kitData.kit.id, type });
    setKitData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSectionId(newSection.id);
  };

  const handleUpdateSection = async (
    id: string,
    data: { title?: string; description?: string }
  ) => {
    startTransition(async () => {
      await updateSectionMeta({ id, ...data });
      setKitData((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === id
            ? {
                ...s,
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
              }
            : s
        ),
      }));
    });
  };

  const handleReorderSections = async (orderedIds: string[]) => {
    await reorderSections({ kitId: kitData.kit.id, orderedIds });
    setKitData((prev) => ({
      ...prev,
      sections: orderedIds
        .map((id) => prev.sections.find((s) => s.id === id)!)
        .filter(Boolean),
    }));
  };

  const handleDeleteSection = async (id: string) => {
    await deleteSection(id);
    setKitData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    if (selectedSectionId === id) {
      setSelectedSectionId(kitData.sections[0]?.id || null);
    }
  };

  // Asset handlers - now handled by AssetGrid component directly via client-side uploads

  // Team handlers
  const handleAddTeamMember = async (data: { name: string; title?: string; avatarUrl?: string }) => {
    const newMember = await addTeamMember({ kitId: kitData.kit.id, ...data });
    setKitData((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));
  };

  const handleUpdateTeamMember = async (
    id: string,
    data: { name?: string; title?: string; avatarUrl?: string }
  ) => {
    await updateTeamMember({ id, ...data });
    setKitData((prev) => ({
      ...prev,
      team: prev.team.map((m) =>
        m.id === id
          ? {
              ...m,
              ...(data.name !== undefined && { name: data.name }),
              ...(data.title !== undefined && { title: data.title }),
              ...(data.avatarUrl !== undefined && { avatar_url: data.avatarUrl }),
            }
          : m
      ),
    }));
  };

  const handleReorderTeam = async (orderedIds: string[]) => {
    await reorderTeamMembers({ kitId: kitData.kit.id, orderedIds });
    setKitData((prev) => ({
      ...prev,
      team: orderedIds.map((id) => prev.team.find((m) => m.id === id)!).filter(Boolean),
    }));
  };

  const handleDeleteTeamMember = async (id: string) => {
    await deleteTeamMember(id);
    setKitData((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }));
  };


  const handleAssetsUpdated = () => {
    // Use a more targeted approach - just reload the page for now
    // This ensures we get the latest data from the server
    window.location.reload();
  };

  return (
    <EditorShell
      kitId={kitData.kit.id}
      outline={
        <Outline
          sections={kitData.sections}
          selectedSectionId={selectedSectionId}
          onSelect={setSelectedSectionId}
          onReorder={handleReorderSections}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
        />
      }
      canvas={
        <Canvas
          kit={kitData.kit}
          sections={kitData.sections}
          assets={kitData.assets}
          team={kitData.team}
        />
      }
      inspector={
        <Inspector
          kit={kitData.kit}
          selectedSection={selectedSection}
          sectionAssets={sectionAssets}
          team={kitData.team}
          onUpdateHero={handleUpdateHero}
          onUpdateSection={handleUpdateSection}
          onAddTeamMember={handleAddTeamMember}
          onUpdateTeamMember={handleUpdateTeamMember}
          onReorderTeam={handleReorderTeam}
          onDeleteTeamMember={handleDeleteTeamMember}
          onAssetsUpdated={handleAssetsUpdated}
          onAssetDeleted={handleAssetsUpdated}
        />
      }
    />
  );
}


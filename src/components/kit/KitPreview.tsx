"use client";

import { EditorPreview } from "./EditorPreview";
import { MediaKit, Section, Asset, TeamMember } from "../../../types";

interface KitPreviewProps {
  kit: MediaKit;
  sections: Section[];
  assets: Asset[];
  teamMembers: TeamMember[];
}

export function KitPreview({ kit, sections, assets, teamMembers }: KitPreviewProps) {
  // Create lookup maps for efficient rendering
  const assetsById = assets.reduce((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  }, {} as Record<string, Asset>);

  const teamMembersById = teamMembers.reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {} as Record<string, TeamMember>);

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto">
      <EditorPreview
        kit={kit}
        sections={sections}
        assets={assets}
        teamMembers={teamMembers}
        assetsById={assetsById}
        teamMembersById={teamMembersById}
      />
    </div>
  );
}

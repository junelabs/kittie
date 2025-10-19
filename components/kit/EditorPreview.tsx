import React from 'react';

interface EditorPreviewProps {
  kit: unknown;
  sections?: unknown[];
  assets?: unknown[];
  teamMembers?: unknown[];
  assetsById?: unknown;
  teamMembersById?: unknown;
}

export function EditorPreview({ 
  kit: _kit, 
  sections: _sections, 
  assets: _assets, 
  teamMembers: _teamMembers, 
  assetsById: _assetsById, 
  teamMembersById: _teamMembersById 
}: EditorPreviewProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kit Preview</h1>
      <p className="text-gray-600">Preview component placeholder</p>
    </div>
  );
}

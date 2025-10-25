'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invariant } from '@/lib/safe';

// ========================================
// TYPES
// ========================================

export type Kit = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  button_label: string | null;
  button_color: string | null;
  logo_url: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
  status?: string;
  is_public: boolean;
  slug: string | null;
  hide_branding: boolean;
};

export type KitSection = {
  id: string;
  kit_id: string;
  type: 'hero' | 'gallery' | 'logos' | 'team';
  title: string | null;
  description: string | null;
  position: number;
};

export type KitAsset = {
  id: string;
  section_id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type KitTeamMember = {
  id: string;
  kit_id: string;
  name: string;
  title: string | null;
  avatar_url: string | null;
  position: number;
};

export type KitData = {
  kit: Kit;
  sections: KitSection[];
  assets: Record<string, KitAsset[]>;
  team: KitTeamMember[];
};

// ========================================
// LOAD KIT
// ========================================

export async function loadKit(id: string): Promise<KitData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Not authenticated');
    return null;
  }

  // Load kit with ownership check
  const { data: kit, error: kitError } = await supabase
    .from('kits')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (kitError || !kit) {
    console.error('Failed to load kit:', kitError);
    return null;
  }

  // Load sections (ordered)
  const { data: sections, error: sectionsError } = await supabase
    .from('kit_sections')
    .select('*')
    .eq('kit_id', id)
    .order('position');

  if (sectionsError) {
    console.error('Failed to load sections:', sectionsError);
    return null;
  }

  // Load all assets for all sections
  const sectionIds = sections?.map((s) => s.id) || [];
  const { data: allAssets } = await supabase
    .from('kit_assets')
    .select('*')
    .in('section_id', sectionIds)
    .order('position');

  // Group assets by section_id
  const assets: Record<string, KitAsset[]> = {};
  allAssets?.forEach((asset) => {
    if (!assets[asset.section_id]) {
      assets[asset.section_id] = [];
    }
    assets[asset.section_id].push(asset);
  });

  // Load team
  const { data: team } = await supabase
    .from('kit_team')
    .select('*')
    .eq('kit_id', id)
    .order('position');

  return {
    kit: kit as Kit,
    sections: (sections || []) as KitSection[],
    assets,
    team: (team || []) as KitTeamMember[],
  };
}

// ========================================
// KIT HERO (METADATA)
// ========================================

export async function updateKitHero({
  id,
  name,
  description,
  buttonLabel,
  buttonColor,
  logoUrl,
}: {
  id: string;
  name?: string;
  description?: string;
  buttonLabel?: string;
  buttonColor?: string;
  logoUrl?: string;
}) {
  invariant(id, 'Kit ID required');

  const supabase = await createClient();
  const updates: any = { updated_at: new Date().toISOString() };

  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description.trim();
  if (buttonLabel !== undefined) updates.button_label = buttonLabel.trim();
  if (buttonColor !== undefined) updates.button_color = buttonColor;
  if (logoUrl !== undefined) updates.logo_url = logoUrl;

  const { error } = await supabase
    .from('kits')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${id}/edit`);
}

/** HERO: persist uploaded image URL */
export async function setHeroLogo(kitId: string, url: string) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('setHeroLogo auth error:', authError);
    throw new Error('Not authenticated');
  }
  
  console.log('setHeroLogo: Updating kit', { kitId, url, userId: user.id });
  
  // First check if the kit exists and belongs to the user
  const { data: kit, error: fetchError } = await supabase
    .from('kits')
    .select('id, owner_id')
    .eq('id', kitId)
    .single();
    
  if (fetchError) {
    console.error('setHeroLogo fetch error:', fetchError);
    throw new Error(`Kit not found: ${fetchError.message}`);
  }
  
  if (kit.owner_id !== user.id) {
    console.error('setHeroLogo permission error:', { kitOwner: kit.owner_id, userId: user.id });
    throw new Error('Not authorized to update this kit');
  }
  
  const { error } = await supabase
    .from('kits')
    .update({ 
      logo_url: url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', kitId)
    .eq('owner_id', user.id);
  
  if (error) {
    console.error('setHeroLogo update error:', error);
    throw new Error(`Failed to update logo: ${error.message}`);
  }
  
  console.log('setHeroLogo: Successfully updated logo');
  revalidatePath(`/kits/${kitId}/edit`);
}

// ========================================
// SECTIONS
// ========================================

export async function addSection({
  kitId,
  type,
}: {
  kitId: string;
  type: 'logos' | 'gallery';
}) {
  const supabase = await createClient();

  // Get max position
  const { data: sections } = await supabase
    .from('kit_sections')
    .select('position')
    .eq('kit_id', kitId)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = (sections?.[0]?.position ?? 0) + 1;

  const { data: newSection, error } = await supabase
    .from('kit_sections')
    .insert({
      kit_id: kitId,
      type,
      title: 'New Section',
      description: '',
      position: nextPosition,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${kitId}/edit`);
  return newSection as KitSection;
}

export async function updateSectionMeta({
  id,
  title,
  description,
}: {
  id: string;
  title?: string;
  description?: string;
}) {
  const supabase = await createClient();
  const updates: any = {};

  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();

  const { error, data } = await supabase
    .from('kit_sections')
    .update(updates)
    .eq('id', id)
    .select('kit_id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${data.kit_id}/edit`);
}

export async function reorderSections({
  kitId,
  orderedIds,
}: {
  kitId: string;
  orderedIds: string[];
}) {
  const supabase = await createClient();

  // Update each section's position
  const updates = orderedIds.map((id, index) => ({
    id,
    position: index,
  }));

  for (const update of updates) {
    await supabase
      .from('kit_sections')
      .update({ position: update.position })
      .eq('id', update.id)
      .eq('kit_id', kitId);
  }

  revalidatePath(`/kits/${kitId}/edit`);
}

export async function deleteSection(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('kit_sections')
    .delete()
    .eq('id', id)
    .select('kit_id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${data.kit_id}/edit`);
}

// ========================================
// ASSETS
// ========================================

/** ASSETS: insert multiple uploaded assets for a section */
export async function recordUploadedAssets(
  sectionId: string,
  files: { url: string; alt?: string; positionHint?: number }[]
) {
  console.log('[recordUploadedAssets] Starting with:', { sectionId, filesCount: files.length });
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('[recordUploadedAssets] Authentication failed:', authError);
    throw new Error('Not authenticated');
  }
  console.log('[recordUploadedAssets] User authenticated:', user.id);

  const { data: last } = await supabase
    .from('kit_assets')
    .select('position')
    .eq('section_id', sectionId)
    .order('position', { ascending: false })
    .limit(1);

  let start = last?.[0]?.position ?? -1;

  const rows = files.map((f, i) => ({
    section_id: sectionId,
    url: f.url,
    alt: f.alt ?? '',
    position: (f.positionHint ?? 0) || (start + i + 1),
  }));

  console.log('[recordUploadedAssets] About to insert rows:', rows);
  const { error } = await supabase.from('kit_assets').insert(rows);
  if (error) {
    console.error('[recordUploadedAssets] Database insert error:', error);
    throw new Error(`Failed to insert assets: ${error.message}`);
  }
  console.log('[recordUploadedAssets] Successfully inserted assets');
  
  revalidatePath('/', 'layout');
}

export async function updateAsset({
  id,
  alt,
}: {
  id: string;
  alt?: string;
}) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  const updates: any = {};
  if (alt !== undefined) updates.alt = alt.trim() || null;

  const { error } = await supabase
    .from('kit_assets')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('updateAsset error:', error);
    throw new Error(`Failed to update asset: ${error.message}`);
  }

  // Get kit_id for revalidation
  const { data: asset } = await supabase
    .from('kit_assets')
    .select('section_id')
    .eq('id', id)
    .single();

  if (asset) {
    const { data: section } = await supabase
      .from('kit_sections')
      .select('kit_id')
      .eq('id', asset.section_id)
      .single();

    if (section) {
      revalidatePath(`/kits/${section.kit_id}/edit`);
    }
  }
}

export async function reorderAssets({
  sectionId,
  orderedIds,
}: {
  sectionId: string;
  orderedIds: string[];
}) {
  const supabase = await createClient();

  // Get kit_id for revalidation
  const { data: section } = await supabase
    .from('kit_sections')
    .select('kit_id')
    .eq('id', sectionId)
    .single();

  if (!section) throw new Error('Section not found');

  // Update each asset's position
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('kit_assets')
      .update({ position: i })
      .eq('id', orderedIds[i])
      .eq('section_id', sectionId);
  }

  revalidatePath(`/kits/${section.kit_id}/edit`);
}

export async function deleteAsset(id: string) {
  const supabase = await createClient();

  // Get asset to find kit_id
  const { data: asset } = await supabase
    .from('kit_assets')
    .select('section_id, url')
    .eq('id', id)
    .single();

  if (!asset) throw new Error('Asset not found');

  // Get section to find kit_id
  const { data: section } = await supabase
    .from('kit_sections')
    .select('kit_id')
    .eq('id', asset.section_id)
    .single();

  // Delete from storage
  const pathParts = asset.url.split('/');
  const fileName = pathParts.slice(-2).join('/'); // Get last two parts (kitId/filename)
  await supabase.storage.from('kit-assets').remove([fileName]);

  // Delete record
  const { error } = await supabase
    .from('kit_assets')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (section) {
    revalidatePath(`/kits/${section.kit_id}/edit`);
  }
}

// ========================================
// TEAM
// ========================================

export async function syncTeamFromWorkspace(kitId: string) {
  const supabase = await createClient();

  // Get kit's org_id
  const { data: kit } = await supabase
    .from('kits')
    .select('org_id')
    .eq('id', kitId)
    .single();

  if (!kit) throw new Error('Kit not found');

  // Delete existing kit team
  await supabase.from('kit_team').delete().eq('kit_id', kitId);

  // Get workspace team
  const { data: workspaceTeam } = await supabase
    .from('workspace_team')
    .select('*')
    .eq('org_id', kit.org_id)
    .order('position');

  if (!workspaceTeam || workspaceTeam.length === 0) {
    revalidatePath(`/kits/${kitId}/edit`);
    return [];
  }

  // Insert kit team snapshot
  const kitTeam = workspaceTeam.map((member) => ({
    kit_id: kitId,
    name: member.name,
    title: member.title,
    avatar_url: member.avatar_url,
    position: member.position,
  }));

  const { data: newTeam, error } = await supabase
    .from('kit_team')
    .insert(kitTeam)
    .select();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${kitId}/edit`);
  return newTeam as KitTeamMember[];
}

export async function addTeamMember({
  kitId,
  name,
  title,
  avatarUrl,
}: {
  kitId: string;
  name: string;
  title?: string;
  avatarUrl?: string;
}) {
  const supabase = await createClient();

  // Get next position
  const { data: team } = await supabase
    .from('kit_team')
    .select('position')
    .eq('kit_id', kitId)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = (team?.[0]?.position ?? -1) + 1;

  const { data: newMember, error } = await supabase
    .from('kit_team')
    .insert({
      kit_id: kitId,
      name: name.trim(),
      title: title?.trim() || null,
      avatar_url: avatarUrl || null,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${kitId}/edit`);
  return newMember as KitTeamMember;
}

export async function updateTeamMember({
  id,
  name,
  title,
  avatarUrl,
}: {
  id: string;
  name?: string;
  title?: string;
  avatarUrl?: string;
}) {
  const supabase = await createClient();
  const updates: any = {};

  if (name !== undefined) updates.name = name.trim();
  if (title !== undefined) updates.title = title.trim() || null;
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

  const { data, error } = await supabase
    .from('kit_team')
    .update(updates)
    .eq('id', id)
    .select('kit_id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${data.kit_id}/edit`);
}

export async function reorderTeamMembers({
  kitId,
  orderedIds,
}: {
  kitId: string;
  orderedIds: string[];
}) {
  const supabase = await createClient();

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('kit_team')
      .update({ position: i })
      .eq('id', orderedIds[i])
      .eq('kit_id', kitId);
  }

  revalidatePath(`/kits/${kitId}/edit`);
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('kit_team')
    .delete()
    .eq('id', id)
    .select('kit_id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/kits/${data.kit_id}/edit`);
}


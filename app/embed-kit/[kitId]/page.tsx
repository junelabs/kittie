import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EmbedKitViewer from '@/components/public/EmbedKitViewer';

interface KitData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  download_button_text?: string;
  download_button_color?: string;
  hide_branding: boolean;
  sections: Array<{
    id: string;
    type: 'hero' | 'gallery' | 'logos' | 'team';
    title?: string;
    description?: string;
    order: number;
    assets: Array<{
      id: string;
      url: string;
      alt_text?: string;
      order: number;
    }>;
    team_members: Array<{
      id: string;
      name: string;
      title?: string;
      avatar_url?: string;
      order: number;
    }>;
  }>;
}

async function getKitById(kitId: string): Promise<KitData | null> {
  const supabase = await createClient();
  
  // Get kit by ID
  const { data: kit, error: kitError } = await supabase
    .from('kits')
    .select(`
      id,
      name,
      description,
      logo_url,
      download_button_text,
      download_button_color,
      hide_branding,
      is_public
    `)
    .eq('id', kitId)
    .eq('is_public', true)
    .single();

  if (kitError || !kit) {
    return null;
  }

  // Get sections
  const { data: sections, error: sectionsError } = await supabase
    .from('kit_sections')
    .select(`
      id,
      type,
      title,
      description,
      order
    `)
    .eq('kit_id', kit.id)
    .order('order');

  if (sectionsError) {
    return null;
  }

  // Get assets for each section
  const sectionsWithAssets = await Promise.all(
    sections.map(async (section: { id: string; type: "hero" | "logos" | "gallery" | "team"; title: string; description: string; order: number }) => {
      const { data: assets } = await supabase
        .from('kit_assets')
        .select(`
          id,
          url,
          alt_text,
          order
        `)
        .eq('section_id', section.id)
        .order('order');

      const { data: teamMembers } = await supabase
        .from('kit_team')
        .select(`
          id,
          name,
          title,
          avatar_url,
          order
        `)
        .eq('section_id', section.id)
        .order('order');

      return {
        ...section,
        assets: assets || [],
        team_members: teamMembers || []
      };
    })
  );

  return {
    ...kit,
    sections: sectionsWithAssets
  };
}

export default async function EmbedKitPage({ 
  params 
}: { 
  params: Promise<{ kitId: string }> 
}) {
  const { kitId } = await params;
  const kit = await getKitById(kitId);
  
  if (!kit) {
    notFound();
  }

  return <EmbedKitViewer kit={kit} />;
}

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublicKitViewer from '@/components/public/PublicKitViewer';

interface KitData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  download_button_text?: string;
  download_button_color?: string;
  hide_branding: boolean;
  brand_slug: string;
  slug: string;
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

async function getKitByBrandAndSlug(brandSlug: string, kitSlug: string): Promise<KitData | null> {
  const supabase = await createClient();
  
  // Get kit by brand_slug and slug
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
      brand_slug,
      slug,
      is_public
    `)
    .eq('brand_slug', brandSlug)
    .eq('slug', kitSlug)
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

export default async function BrandKitPage({ 
  params 
}: { 
  params: { brand: string; kit: string } 
}) {
  const kit = await getKitByBrandAndSlug(params.brand, params.kit);
  
  if (!kit) {
    notFound();
  }

  return <PublicKitViewer kit={kit} />;
}

export async function generateMetadata({ 
  params 
}: { 
  params: { brand: string; kit: string } 
}) {
  const kit = await getKitByBrandAndSlug(params.brand, params.kit);
  
  if (!kit) {
    return {
      title: 'Kit Not Found',
      description: 'The requested media kit could not be found.'
    };
  }

  return {
    title: `${kit.name} - ${kit.brand_slug} Media Kit`,
    description: kit.description || `Media kit for ${kit.name} by ${kit.brand_slug}`,
    openGraph: {
      title: `${kit.name} - ${kit.brand_slug} Media Kit`,
      description: kit.description || `Media kit for ${kit.name} by ${kit.brand_slug}`,
      images: kit.logo_url ? [kit.logo_url] : [],
    },
  };
}

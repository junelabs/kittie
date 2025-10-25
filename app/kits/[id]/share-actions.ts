'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'brand-kit';
}

async function getPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'Free', userId: null, supabase };
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();
  
  return { plan: profile?.plan ?? 'Free', userId: user.id, supabase };
}

export async function publishKit(kitId: string, desiredSlug?: string) {
  const { supabase } = await getPlan();
  
  // Get current kit to check brand_slug
  const { data: kit } = await supabase
    .from('kits')
    .select('name, brand_slug')
    .eq('id', kitId)
    .single();
  
  // Derive slug if not provided
  let slug = desiredSlug?.trim();
  if (!slug) {
    slug = slugify(kit?.name ?? '');
  } else {
    slug = slugify(slug);
  }
  
  // Ensure brand_slug exists
  const brandSlug = kit?.brand_slug || 'brand';
  
  // Upsert visibility + slug + brand_slug
  const { error } = await supabase
    .from('kits')
    .update({ 
      is_public: true, 
      slug,
      brand_slug: brandSlug,
      updated_at: new Date().toISOString() 
    })
    .eq('id', kitId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath(`/kits/${kitId}/edit`);
  return { slug, brandSlug };
}

export async function unpublishKit(kitId: string) {
  const { supabase } = await getPlan();
  
  const { error } = await supabase
    .from('kits')
    .update({ 
      is_public: false, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', kitId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath(`/kits/${kitId}/edit`);
}

export async function setHideBranding(kitId: string, hide: boolean) {
  const { plan, supabase } = await getPlan();
  
  if (hide && plan !== 'Pro') {
    // Deny silently; client will show paywall CTA
    return { allowed: false, plan };
  }
  
  const { error } = await supabase
    .from('kits')
    .update({ 
      hide_branding: !!hide, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', kitId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath(`/kits/${kitId}/edit`);
  return { allowed: true, plan };
}


'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invariant } from '@/lib/safe';

const newKitSchema = z.object({
  name: z.string().min(2, 'Please enter at least 2 characters').max(80, 'Keep it under 80 characters'),
});

export async function createKit(formData: FormData): Promise<{ kitId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  const name = String(formData.get('name') ?? '').trim();
  const brandId = String(formData.get('brand_id') ?? '').trim();
  invariant(name.length >= 2, 'Name must be at least 2 characters');
  invariant(name.length <= 80, 'Name must be under 80 characters');

  // Get user's plan to determine kit limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier')
    .eq('id', user.id)
    .single();

  const planTier = profile?.plan_tier || 'free';
  
  // Define kit limits based on plan
  const kitLimits = {
    free: 1,
    starter: 3,
    pro: 10,
    business: 50,
  };
  
  const maxKits = kitLimits[planTier as keyof typeof kitLimits] || 1;

  // Enforce plan-based kit limit per user
  const { count, error: cErr } = await supabase
    .from('kits')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .eq('archived', false); // Only count non-archived kits

  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) >= maxKits) {
    if (planTier === 'free') {
      throw new Error('Free plan allows 1 kit. Upgrade to Starter for 3 kits.');
    } else {
      throw new Error(`Maximum ${maxKits} active kits per user`);
    }
  }

  // Get default brand if no brand_id provided
  let finalBrandId = brandId;
  if (!finalBrandId) {
    const { data: defaultBrand } = await supabase
      .from('brands')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (defaultBrand) {
      finalBrandId = defaultBrand.id;
    }
  }

  // Get brand slug if we have a brand_id
  let brandSlug = null;
  if (finalBrandId) {
    const { data: brand } = await supabase
      .from('brands')
      .select('slug')
      .eq('id', finalBrandId)
      .single();
    brandSlug = brand?.slug;
  }

  // Insert kit with user ownership and brand
  const { data: kit, error } = await supabase.from('kits').insert({
    name,
    owner_id: user.id,
    brand_id: finalBrandId,
    brand_slug: brandSlug,
    archived: false,
    status: 'draft',
  }).select('id').single();

  if (error) throw new Error(error.message);
  if (!kit) throw new Error('Failed to create kit');

  // Create default sections
  const sections = [
    { kit_id: kit.id, type: 'hero', title: null, description: '', position: 0 },
    { kit_id: kit.id, type: 'logos', title: 'Brand Logos', description: 'Download our logos in various formats', position: 1 },
    { kit_id: kit.id, type: 'gallery', title: 'Photo Gallery', description: 'High-resolution images for press and marketing', position: 2 },
    { kit_id: kit.id, type: 'team', title: 'Our Team', description: 'Meet the people behind the brand', position: 3 },
  ];

  const { error: sectionsError } = await supabase
    .from('kit_sections')
    .insert(sections);

  if (sectionsError) {
    console.error('Failed to create default sections:', sectionsError);
  }

  // Revalidate dashboard to show new kit
  revalidatePath('/');
  revalidatePath('/dashboard');
  
  // Return the kit ID so the client can redirect
  return { kitId: kit.id };
}

export async function renameKit(id: string, name: string) {
  invariant(name.trim().length >= 2, 'Name must be at least 2 characters');
  invariant(name.trim().length <= 80, 'Name must be under 80 characters');

  const supabase = await createClient();
  const { error } = await supabase
    .from('kits')
    .update({ 
      name: name.trim(), 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function archiveKit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('kits')
    .update({ 
      archived: true, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function restoreKit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('kits')
    .update({ 
      archived: false, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deleteKit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('kits')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/dashboard');
}


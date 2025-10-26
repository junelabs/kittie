'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invariant } from '@/lib/safe';
import { z } from 'zod';
import { slugFile } from '@/lib/slug';

const createBrandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(60, 'Brand name must be under 60 characters'),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
});

const updateBrandSchema = createBrandSchema.partial();

export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || undefined;
  const primary_color = String(formData.get('primary_color') ?? '#000000').trim();
  const logoFile = formData.get('logo') as File | null;

  const validated = createBrandSchema.safeParse({ name, description, primary_color });
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? 'Invalid brand data');
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Upload logo if provided
  let logo_url: string | undefined;
  if (logoFile && logoFile.size > 0) {
    const path = `brands/${user.id}/${crypto.randomUUID()}-${slugFile(logoFile.name)}`;
    const { error: uploadError } = await supabase.storage
      .from('kit-assets')
      .upload(path, logoFile, { upsert: true });
    
    if (uploadError) {
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }
    
    const { data } = supabase.storage.from('kit-assets').getPublicUrl(path);
    logo_url = data.publicUrl;
  }

  const { data: brand, error } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      name: validated.data.name,
      slug,
      description: validated.data.description,
      primary_color: validated.data.primary_color || '#000000',
      logo_url,
    })
    .select('id, name, slug')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('A brand with this name already exists');
    }
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/settings/brands');
  
  return { brandId: brand.id };
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || undefined;
  const primary_color = String(formData.get('primary_color') ?? '#000000').trim();
  const logoFile = formData.get('logo') as File | null;

  const validated = updateBrandSchema.safeParse({ name, description, primary_color });
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? 'Invalid brand data');
  }

  // Generate slug from name if name is being updated
  let slug;
  if (validated.data.name) {
    slug = validated.data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Upload logo if provided
  let logo_url: string | undefined;
  if (logoFile && logoFile.size > 0) {
    const path = `brands/${user.id}/${crypto.randomUUID()}-${slugFile(logoFile.name)}`;
    const { error: uploadError } = await supabase.storage
      .from('kit-assets')
      .upload(path, logoFile, { upsert: true });
    
    if (uploadError) {
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }
    
    const { data } = supabase.storage.from('kit-assets').getPublicUrl(path);
    logo_url = data.publicUrl;
  }

  const updateData: Record<string, unknown> = {};
  if (validated.data.name) updateData.name = validated.data.name;
  if (validated.data.description !== undefined) updateData.description = validated.data.description;
  if (validated.data.primary_color) updateData.primary_color = validated.data.primary_color;
  if (slug) updateData.slug = slug;
  if (logo_url) updateData.logo_url = logo_url;

  const { error } = await supabase
    .from('brands')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    if (error.code === '23505') {
      throw new Error('A brand with this name already exists');
    }
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/settings/brands');
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  // Check if brand has any kits
  const { count } = await supabase
    .from('kits')
    .select('id', { count: 'exact', head: true })
    .eq('brand_id', id);

  if (count && count > 0) {
    throw new Error('Cannot delete brand with existing kits. Please delete or move the kits first.');
  }

  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  revalidatePath('/settings/brands');
}

export async function getBrands() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, slug, logo_url, description, primary_color, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return brands || [];
}

export async function getBrand(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  invariant(user, 'Not authenticated');

  const { data: brand, error } = await supabase
    .from('brands')
    .select('id, name, slug, logo_url, description, primary_color, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return brand;
}

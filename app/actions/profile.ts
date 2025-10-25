'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const roleSchema = z.object({
  role: z.enum(['brand', 'agency']),
});

const companySchema = z.object({
  company: z.string().min(2, 'Please enter at least 2 characters').max(60, 'Keep it under 60 characters'),
});

export async function upsertRole(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error('Unauthorized');

  const parsed = roleSchema.safeParse({ role: formData.get('role') });
  if (!parsed.success) throw new Error('Invalid role');

  const { error } = await supabase
    .from('profiles')
    .update({ role: parsed.data.role })
    .eq('id', user.id);

  if (error) throw new Error(error.message);
}

export async function upsertCompany(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const parsed = companySchema.safeParse({ company: formData.get('company') });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid company');

  const { error } = await supabase
    .from('profiles')
    .update({ company: parsed.data.company })
    .eq('id', user.id);

  if (error) throw new Error(error.message);

  // Create first brand for the user
  const companyName = parsed.data.company;
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const { error: brandError } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      name: companyName,
      slug,
      description: `Brand assets for ${companyName}`,
      primary_color: '#000000',
    });

  if (brandError) {
    console.error('Failed to create brand:', brandError);
    // Don't throw error here as it's not critical for onboarding
  }
}

export async function markOnboarded() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) throw new Error(error.message);
}


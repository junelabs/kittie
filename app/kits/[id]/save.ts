'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveKit(kitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Touch updated_at and set status to 'published'
  const { error } = await supabase
    .from('kits')
    .update({ 
      updated_at: new Date().toISOString(), 
      status: 'published' 
    })
    .eq('id', kitId);

  if (error) {
    console.error('Save kit error:', error);
    throw new Error(`Failed to save kit: ${error.message}`);
  }

  // Revalidate dashboard and editor routes
  revalidatePath('/dashboard');
  revalidatePath(`/kits/${kitId}/edit`);
  revalidatePath('/');
}


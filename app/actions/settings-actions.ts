'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema
const updateSettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  email_notifications: z.boolean().optional(),
  default_workspace: z.string().uuid().nullable().optional(),
  language: z.string().optional(),
});

export async function updateSettings(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Parse form data
    const updates: any = {};
    
    if (formData.has('theme')) {
      updates.theme = formData.get('theme') as string;
    }
    if (formData.has('email_notifications')) {
      updates.email_notifications = formData.get('email_notifications') === 'true';
    }
    if (formData.has('default_workspace')) {
      updates.default_workspace = formData.get('default_workspace') as string || null;
    }
    if (formData.has('language')) {
      updates.language = formData.get('language') as string;
    }

    // Validate input
    const result = updateSettingsSchema.safeParse(updates);
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    // Check if settings exist
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Settings update error:', error);
        return { error: 'Failed to update settings' };
      }
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id, ...updates });

      if (error) {
        console.error('Settings insert error:', error);
        return { error: 'Failed to create settings' };
      }
    }

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Settings update error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getSettings() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Settings fetch error:', error);
      return { error: 'Failed to fetch settings' };
    }

    // Return default settings if none exist
    if (!settings) {
      return {
        data: {
          theme: 'system',
          email_notifications: true,
          default_workspace: null,
          language: 'en',
        }
      };
    }

    return { data: settings };
  } catch (error) {
    console.error('Settings fetch error:', error);
    return { error: 'An unexpected error occurred' };
  }
}


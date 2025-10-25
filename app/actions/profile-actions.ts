'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
});

const uploadAvatarSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'File must be JPEG, PNG, or WebP'
  ),
});

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const full_name = formData.get('full_name') as string;

    // Validate input
    const result = updateProfileSchema.safeParse({ full_name });
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({ full_name })
      .eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { error: 'Failed to update profile' };
    }

    // Also update auth metadata for consistency
    await supabase.auth.updateUser({
      data: { full_name }
    });

    // Small delay to ensure database update is committed
    await new Promise(resolve => setTimeout(resolve, 100));

    revalidatePath('/account');
    revalidatePath('/dashboard');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const file = formData.get('file') as File;
    
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file
    const result = uploadAvatarSchema.safeParse({ file });
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: 'Failed to upload avatar' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { error: 'Failed to update profile' };
    }

    revalidatePath('/account');
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function removeAvatar() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Get current avatar URL to delete from storage
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Remove from storage if exists
    if (profile?.avatar_url) {
      const fileName = `${user.id}/avatar`;
      await supabase.storage
        .from('avatars')
        .remove([fileName + '.jpg', fileName + '.png', fileName + '.webp']);
    }

    // Update profile to remove avatar_url
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { error: 'Failed to remove avatar' };
    }

    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    console.error('Avatar removal error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteAccount() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Soft delete: mark account for deletion
    // In a production app, you might want to anonymize data or schedule actual deletion
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: '[Deleted User]',
        email: null,
        avatar_url: null,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Account deletion error:', error);
      return { error: 'Failed to delete account' };
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { success: true };
  } catch (error) {
    console.error('Account deletion error:', error);
    return { error: 'An unexpected error occurred' };
  }
}


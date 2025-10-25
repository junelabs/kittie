'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  } catch (error) {
    // Next.js redirect throws an error, which is expected
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }
    console.error('Sign out error:', error);
    return { error: 'Failed to sign out' };
  }
}


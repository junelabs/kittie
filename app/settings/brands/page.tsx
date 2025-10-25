import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BrandSettingsPageClient from './client';

export const metadata = {
  title: 'Brand Settings',
  description: 'Manage your brands and their settings',
};

export default async function BrandSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signup');
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company, plan_tier')
    .eq('id', user.id)
    .single();

  // Fetch brands for the user
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, logo_url, primary_color')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  const userName = profile?.full_name || user.user_metadata?.full_name || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <BrandSettingsPageClient
      userName={userName}
      userEmail={user.email ?? ''}
      userPlan={profile?.plan_tier || 'free'}
      userInitials={userInitials}
      brands={brands || []}
    />
  );
}

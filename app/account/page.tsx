import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AccountPageClient from './client';

export const metadata = {
  title: 'Account Settings | Kittie',
  description: 'Manage your account settings',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, email, company, plan_tier')
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
    <AccountPageClient
      userName={userName}
      userEmail={user.email ?? ''}
      userPlan={profile?.plan_tier || 'free'}
      userInitials={userInitials}
      fullName={profile?.full_name || user.user_metadata?.full_name || ''}
      email={user.email || ''}
      avatarUrl={profile?.avatar_url || ''}
      brands={brands || []}
    />
  );
}


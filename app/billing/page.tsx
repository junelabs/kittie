import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BillingPageClient from './client';

export const metadata = {
  title: 'Billing & Plans | Kittie',
  description: 'Manage your subscription and billing',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signup');
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company, stripe_customer_id, plan_tier')
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
    <BillingPageClient
      userName={userName}
      userEmail={user.email ?? ''}
      userPlan={profile?.plan_tier || 'free'}
      userInitials={userInitials}
      planTier={profile?.plan_tier || 'free'}
      hasStripeCustomer={!!profile?.stripe_customer_id}
      brands={brands || []}
    />
  );
}


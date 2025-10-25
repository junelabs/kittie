import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardWithBrands from '@/components/dashboard/DashboardWithBrands';

type Kit = {
  id: string;
  name: string;
  archived: boolean;
  updated_at: string;
  created_at?: string;
  logo_url?: string | null;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signup');


  const params = await searchParams;
  const showArchived = params.view === 'archived';

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company, onboarded_at, full_name, plan_tier')
    .eq('id', user.id)
    .single();

  // Fetch kits - user-owned, no workspace filtering
  let kitsQuery = supabase
    .from('kits')
    .select('id, name, archived, updated_at, created_at, status, logo_url')
    .eq('owner_id', user.id)
    .in('status', ['draft', 'published'])
    .order('updated_at', { ascending: false });

  // Filter by archived status
  if (!showArchived) {
    kitsQuery = kitsQuery.eq('archived', false);
  } else {
    kitsQuery = kitsQuery.eq('archived', true);
  }

  const { data: kits } = await kitsQuery;

  const emailVerified = !!user.email_confirmed_at;
  const list = (kits ?? []) as Kit[];
  const notOnboarded = !profile?.onboarded_at;

  const userName = profile?.full_name || user.user_metadata?.full_name || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  // Calculate plan limits
  const planTier = profile?.plan_tier || 'free';
  const kitLimits = {
    free: 1,
    starter: 3,
    pro: 10,
    business: 50,
  };
  const maxKits = kitLimits[planTier as keyof typeof kitLimits] || 1;
  const currentKitCount = list.filter(kit => !kit.archived).length;

  // Fetch brands for the user
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, logo_url, primary_color')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  return (
    <DashboardWithBrands
      user={user}
      profile={profile}
      kits={list}
      showArchived={showArchived}
      emailVerified={emailVerified}
      notOnboarded={notOnboarded}
      userName={userName}
      userInitials={userInitials}
      planTier={planTier}
      maxKits={maxKits}
      currentKitCount={currentKitCount}
      brands={brands || []}
    />
  );
}

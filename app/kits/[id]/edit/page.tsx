import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loadKit } from '../actions';
import EditorShellWithSave from './EditorShellWithSave';

export default async function KitEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup');
  }

  const { id } = await params;

  // Load kit data
  const kitData = await loadKit(id);

  if (!kitData) {
    redirect('/dashboard');
  }

  // Get user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier')
    .eq('id', user.id)
    .single();

  const userPlan = profile?.plan_tier || 'free';

  return <EditorShellWithSave kitData={kitData} userPlan={userPlan} />;
}


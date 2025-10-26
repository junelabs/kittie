import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Signup attempt for:', email);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      console.error('Supabase signup error:', error);
      return new NextResponse(error.message, { status: 400 });
    }

    console.log('Signup successful for:', data.user?.email);

    // Ensure a profiles row exists (id matches auth user)
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
      }, { onConflict: 'id' });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error('Signup error:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}


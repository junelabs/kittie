import { NextResponse } from 'next/server';
import { supabaseServerMutating } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { name, email, company } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const supabase = await supabaseServerMutating();

    const { error } = await supabase
      .from('waitlist')
      .insert({
        name: name || null,
        email: email.toLowerCase(),
        company: company || null,
      });

    if (error) {
      // If table is missing, return a helpful message
      const isMissingTable = (error as { code?: string }).code === '42P01';
      return NextResponse.json(
        { 
          message: isMissingTable 
            ? 'Missing table: create a "waitlist" table with columns: id (uuid default uuid_generate_v4()), name text, email text unique, company text, created_at timestamp default now().' 
            : 'Failed to save waitlist entry'
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}



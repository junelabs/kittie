import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get all public kits
    const { data: kits, error } = await supabase
      .from('kits')
      .select('id, name, slug, brand_slug, is_public')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching public kits:', error);
      return NextResponse.json({ error: 'Failed to fetch kits' }, { status: 500 });
    }

    return NextResponse.json({ kits: kits || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

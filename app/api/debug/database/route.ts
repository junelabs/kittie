import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Check both tables
    const [kitsResult, mediaKitsResult] = await Promise.all([
      supabase
        .from('kits')
        .select('id, name, is_public, slug, brand_slug, status, created_at, updated_at, owner_id')
        .order('updated_at', { ascending: false })
        .limit(10),
      
      supabase
        .from('media_kits')
        .select('id, name, is_public, public_id, created_at, updated_at, owner_id')
        .order('updated_at', { ascending: false })
        .limit(10)
    ]);

    return NextResponse.json({
      auth: {
        user: user ? { id: user.id, email: user.email } : null,
        error: authError?.message
      },
      kits: {
        data: kitsResult.data,
        error: kitsResult.error?.message
      },
      mediaKits: {
        data: mediaKitsResult.data,
        error: mediaKitsResult.error?.message
      },
      publicKitsCount: kitsResult.data?.filter(k => k.is_public).length || 0,
      publicMediaKitsCount: mediaKitsResult.data?.filter(k => k.is_public).length || 0,
      totalKitsCount: kitsResult.data?.length || 0,
      totalMediaKitsCount: mediaKitsResult.data?.length || 0
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

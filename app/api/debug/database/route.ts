import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check both tables
    const [kitsResult, mediaKitsResult] = await Promise.all([
      supabase
        .from('kits')
        .select('id, name, is_public, slug, brand_slug, status, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10),
      
      supabase
        .from('media_kits')
        .select('id, name, is_public, public_id, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10)
    ]);

    return NextResponse.json({
      kits: {
        data: kitsResult.data,
        error: kitsResult.error?.message
      },
      mediaKits: {
        data: mediaKitsResult.data,
        error: mediaKitsResult.error?.message
      },
      publicKitsCount: kitsResult.data?.filter(k => k.is_public).length || 0,
      publicMediaKitsCount: mediaKitsResult.data?.filter(k => k.is_public).length || 0
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

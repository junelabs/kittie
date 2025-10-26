import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kitId = searchParams.get('kitId');
    
    if (!kitId) {
      return NextResponse.json({ error: 'kitId required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Check both old and new table structures
    const [kitsResult, mediaKitsResult] = await Promise.all([
      // New kits table
      supabase
        .from('kits')
        .select('*')
        .eq('id', kitId)
        .single(),
      
      // Old media_kits table  
      supabase
        .from('media_kits')
        .select('*')
        .eq('id', kitId)
        .single()
    ]);

    return NextResponse.json({
      kitId,
      newKitsTable: {
        data: kitsResult.data,
        error: kitsResult.error?.message
      },
      oldMediaKitsTable: {
        data: mediaKitsResult.data,
        error: mediaKitsResult.error?.message
      },
      allPublicKits: await supabase
        .from('kits')
        .select('id, name, is_public')
        .eq('is_public', true)
        .limit(5)
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

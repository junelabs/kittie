import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', { hasUrl, hasAnonKey });
    
    if (!hasUrl || !hasAnonKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase environment variables',
        hasUrl,
        hasAnonKey 
      }, { status: 500 });
    }

    // Test Supabase connection
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    return NextResponse.json({
      success: true,
      supabaseConnected: !error,
      session: !!data.session,
      error: error?.message
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // do not pre-render/evaluate at build

// This route is kept for potential future direct API usage
// Currently, checkout sessions are handled through billing-actions.ts

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const plan = formData.get('plan') as 'starter' | 'pro';
    
    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // For now, return a simple response - the actual checkout logic should be in billing-actions
    // This route can be used for direct API calls if needed
    return NextResponse.json({ 
      message: 'Use the billing actions for checkout sessions',
      plan: plan 
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

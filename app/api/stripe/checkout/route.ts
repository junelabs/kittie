import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/app/actions/billing-actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const plan = formData.get('plan') as 'starter' | 'pro';
    
    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const result = await createCheckoutSession(plan);
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    // createCheckoutSession redirects, so this won't be reached
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

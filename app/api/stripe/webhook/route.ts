// Temporarily commented out Stripe webhook
// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/server';
// import { stripe } from '@/lib/stripe';
// import Stripe from 'stripe';

export async function POST(request: Request) {
  // Mock webhook response for development
  console.log('Mock: Stripe webhook called');
  return Response.json({ received: true });
}

// Original webhook code commented out:
/*
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId || !planType) {
          console.error('Missing user_id or plan_type in session metadata');
          break;
        }

        // Update user's plan tier
        const planTierMap = {
          starter: 'starter',
          pro: 'pro',
        };

        await supabase
          .from('profiles')
          .update({ 
            plan_tier: planTierMap[planType as keyof typeof planTierMap] || 'starter',
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId);

        console.log(`User ${userId} upgraded to ${planType} plan`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.error('No profile found for customer:', customerId);
          break;
        }

        // Update subscription status
        await supabase
          .from('profiles')
          .update({ 
            stripe_subscription_id: subscription.id,
            plan_tier: subscription.status === 'active' ? 'starter' : 'free', // Simplified for now
          })
          .eq('id', profile.id);

        console.log(`Subscription updated for user ${profile.id}:`, subscription.status);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.error('No profile found for customer:', customerId);
          break;
        }

        // Downgrade to free plan
        await supabase
          .from('profiles')
          .update({ 
            plan_tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', profile.id);

        console.log(`User ${profile.id} downgraded to free plan`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
*/
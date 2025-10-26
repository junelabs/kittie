import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/rate-limit';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Rate limit webhook requests (Stripe sends many events)
const rateLimitedHandler = withRateLimit({
  maxRequests: 1000, // Allow more requests for webhooks
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Webhook rate limit exceeded'
});

export const POST = rateLimitedHandler(async function webhookHandler(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId || !planType) {
          console.error('Missing metadata in checkout session:', session.id);
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Update user's plan in database
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan_tier: planType === 'pro' ? 'starter' : planType, // Both are starter plans
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId);

        if (error) {
          console.error('Failed to update user plan:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`Updated user ${userId} to plan ${planType}`);
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
        const { error } = await supabase
          .from('profiles')
          .update({ 
            stripe_subscription_id: subscription.id,
            plan_tier: subscription.status === 'active' ? 'starter' : 'free',
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Failed to update subscription:', error);
        }

        console.log(`Updated subscription for user ${profile.id}:`, subscription.status);
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
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan_tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Failed to downgrade user:', error);
        }

        console.log(`Downgraded user ${profile.id} to free plan`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
});

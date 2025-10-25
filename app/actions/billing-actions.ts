'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';

export async function createBillingPortalSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return { error: 'No billing account found. Please upgrade to a paid plan first.' };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
    });

    redirect(session.url);
  } catch (error) {
    console.error('Billing portal error:', error);
    return { error: 'Failed to create billing portal session' };
  }
}

export async function createCheckoutSession(planType: 'starter' | 'pro' = 'starter') {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const plan = STRIPE_CONFIG[planType];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
      metadata: { 
        user_id: user.id,
        plan_type: planType,
      },
    });

    redirect(session.url!);
  } catch (error) {
    console.error('Checkout session error:', error);
    return { error: 'Failed to create checkout session' };
  }
}


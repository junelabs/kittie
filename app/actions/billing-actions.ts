'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type StripeType = typeof import("stripe");

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  const { default: Stripe }: StripeType = (await import("stripe")) as StripeType;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

// Move STRIPE_CONFIG here to avoid importing from lib/stripe
const STRIPE_CONFIG = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    name: 'Starter',
    amount: 1900, // $19.00
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    name: 'Pro', 
    amount: 7900, // $79.00
  },
} as const;

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

    const stripe = await getStripe();
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

    const stripe = await getStripe();
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


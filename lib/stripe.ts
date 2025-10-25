import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const STRIPE_CONFIG = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1SMGS7AEOlE5oX6ABDGHSvOV',
    name: 'Starter',
    amount: 1900, // $19.00
  },
  pro: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_1SMGS7AEOlE5oX6AVYCoEkoV',
    name: 'Starter Annual', 
    amount: 7900, // $79.00
  },
} as const;

export type PlanType = keyof typeof STRIPE_CONFIG;
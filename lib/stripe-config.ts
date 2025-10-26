// Stripe configuration constants only
// No top-level Stripe initialization to avoid build-time errors

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
# Stripe Integration Setup Guide

## ✅ What's Already Done

1. **Stripe Configuration Updated** - `lib/stripe.ts` now uses real Stripe instead of mocks
2. **Webhook Handler Created** - `app/api/webhooks/stripe/route.ts` handles payment events
3. **Setup Script Created** - `scripts/setup-stripe.js` to create products and get price IDs
4. **Package.json Updated** - Added Stripe dependency and setup script

## 🔧 Next Steps

### 1. Install Stripe Package
```bash
npm install stripe@latest
```

### 2. Set Up Stripe Products
Run the setup script to create products and get price IDs:
```bash
npm run setup-stripe
```

This will create:
- **Starter Monthly**: $19/month
- **Starter Annual**: $79/year (Early Launch Offer)

### 3. Update Environment Variables
Add these to your `.env.local` file:
```bash
# Stripe Keys (you already have these)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (from step 2)
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...

# Webhook Secret (from step 4)
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3003
```

### 4. Set Up Stripe Webhook
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Test the Integration
1. Start your dev server: `npm run dev`
2. Go to `/billing` page
3. Click "Upgrade to Starter" buttons
4. Complete test payment in Stripe checkout
5. Verify user plan updates in database

## 🎯 How It Works

### Payment Flow:
1. User clicks "Upgrade to Starter" button
2. `createCheckoutSession()` creates Stripe checkout session
3. User redirected to Stripe payment page
4. After payment, webhook updates user plan in database
5. User redirected back to dashboard with success message

### Webhook Events:
- **checkout.session.completed**: Updates user to paid plan
- **customer.subscription.updated**: Syncs subscription status
- **customer.subscription.deleted**: Downgrades user to free plan

## 🔍 Troubleshooting

### If npm install fails:
Try using yarn instead:
```bash
yarn add stripe
```

### If webhook doesn't work:
1. Check webhook URL is accessible
2. Verify webhook secret matches
3. Check server logs for errors
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3003/api/webhooks/stripe`

### If checkout doesn't work:
1. Verify price IDs are correct
2. Check Stripe keys are valid
3. Ensure NEXT_PUBLIC_SITE_URL is set correctly

## 📝 Database Schema

The webhook updates these fields in the `profiles` table:
- `plan_tier`: 'free' | 'starter'
- `stripe_customer_id`: Stripe customer ID
- `stripe_subscription_id`: Stripe subscription ID

## 🚀 Production Deployment

1. Use live Stripe keys (sk_live_...)
2. Update webhook URL to production domain
3. Test with real payment methods
4. Monitor webhook delivery in Stripe Dashboard

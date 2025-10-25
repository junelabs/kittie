const Stripe = require('stripe');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('Environment check:');
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Please set STRIPE_SECRET_KEY in your .env.local file');
  console.error('Make sure the file exists and contains: STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log('Setting up Stripe prices for existing products...\n');

    // Create price for existing Starter Monthly Product
    const starterPrice = await stripe.prices.create({
      product: 'prod_TGuMDuUWwSYGa6', // Your $19 product ID
      unit_amount: 1900, // $19.00
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    console.log('✅ Starter Monthly Price Created:');
    console.log(`   Product ID: prod_TGuMDuUWwSYGa6`);
    console.log(`   Price ID: ${starterPrice.id}`);
    console.log(`   Amount: $19.00/month\n`);

    // Create price for existing Starter Annual Product
    const annualPrice = await stripe.prices.create({
      product: 'prod_TGuNR8edEyO1Za', // Your $79 product ID
      unit_amount: 7900, // $79.00
      currency: 'usd',
      recurring: { interval: 'year' },
    });

    console.log('✅ Starter Annual Price Created:');
    console.log(`   Product ID: prod_TGuNR8edEyO1Za`);
    console.log(`   Price ID: ${annualPrice.id}`);
    console.log(`   Amount: $79.00/year\n`);

    console.log('🔧 Add these to your .env.local file:');
    console.log(`STRIPE_STARTER_PRICE_ID=${starterPrice.id}`);
    console.log(`STRIPE_ANNUAL_PRICE_ID=${annualPrice.id}\n`);

    console.log('🎉 Stripe prices setup complete!');
    console.log('Next steps:');
    console.log('1. Add the price IDs to your .env.local file');
    console.log('2. Set up webhook endpoint in Stripe Dashboard:');
    console.log('   URL: https://yourdomain.com/api/webhooks/stripe');
    console.log('   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted');
    console.log('3. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env.local');

  } catch (error) {
    console.error('Error setting up Stripe prices:', error.message);
  }
}

setupStripeProducts();

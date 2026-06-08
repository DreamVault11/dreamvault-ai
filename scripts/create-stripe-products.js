#!/usr/bin/env node
/**
 * DreamScape AI — Stripe Products Setup
 * Run: node scripts/create-stripe-products.js
 * 
 * Creates the Monthly ($14.99) and Yearly ($99) subscription products
 * and prints the price IDs to add to your .env.local
 */
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || require('fs').readFileSync('.env.local','utf8').match(/STRIPE_SECRET_KEY=(.+)/)?.[1]);

async function run() {
  console.log('Creating Stripe products...\n');
  
  const monthly = await stripe.products.create({
    name: 'DreamScape Pro Monthly',
    description: 'Unlimited dream movies, HD video, Dream Universe, analytics, monthly reports, annual dream book'
  });
  const monthlyPrice = await stripe.prices.create({
    product: monthly.id, unit_amount: 1499, currency: 'usd',
    recurring: { interval: 'month' }
  });
  console.log(`✅ Monthly ($14.99): ${monthlyPrice.id}`);

  const yearly = await stripe.products.create({
    name: 'DreamScape Pro Yearly',
    description: 'Everything in Monthly, save $80/year'
  });
  const yearlyPrice = await stripe.prices.create({
    product: yearly.id, unit_amount: 9900, currency: 'usd',
    recurring: { interval: 'year' }
  });
  console.log(`✅ Yearly ($99/yr): ${yearlyPrice.id}\n`);

  console.log('Add these to your .env.local:');
  console.log(`STRIPE_PRICE_MONTHLY=${monthlyPrice.id}`);
  console.log(`STRIPE_PRICE_YEARLY=${yearlyPrice.id}`);
}
run().catch(e => console.error('Error:', e.message));

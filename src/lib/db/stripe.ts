// Stripe server-side client
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing env.STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // latest stable
  typescript: true,
});

export default stripe;

// Stripe price IDs - configure these in Stripe Dashboard
export const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || '',
  yearly: process.env.STRIPE_PRICE_YEARLY || '',
} as const;

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

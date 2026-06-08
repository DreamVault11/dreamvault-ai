// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody } from '@/lib/db/api-helpers';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import stripe, { PRICE_IDS } from '@/lib/db/stripe';

/**
 * POST /api/stripe/create-checkout
 * Create a Stripe Checkout Session for subscription
 */
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { data: body, error: parseError } = await parseBody<{
    price_id?: string;
    plan?: 'monthly' | 'yearly';
    success_url: string;
    cancel_url: string;
  }>(request);

  if (parseError) return parseError;

  if (!body?.success_url || !body?.cancel_url) {
    return errorResponse('success_url and cancel_url are required');
  }

  // Determine price ID
  let priceId = body.price_id;
  if (!priceId) {
    if (body.plan === 'yearly') {
      priceId = PRICE_IDS.yearly;
    } else {
      priceId = PRICE_IDS.monthly;
    }
  }

  if (!priceId) {
    return errorResponse(
      'No price ID configured. Set STRIPE_PRICE_MONTHLY and STRIPE_PRICE_YEARLY environment variables.'
    );
  }

  // Get or create Stripe customer
  const supabase = getSupabaseAdmin();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email || user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
    customerId = customer.id;

    // Save Stripe customer ID
    await supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: body.success_url,
    cancel_url: body.cancel_url,
    metadata: {
      supabase_user_id: user.id,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
      },
    },
  });

  if (!session.url) {
    return errorResponse('Failed to create checkout session', 500);
  }

  return successResponse({
    url: session.url,
    session_id: session.id,
  });
}
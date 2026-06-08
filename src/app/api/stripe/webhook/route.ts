// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/db/api-helpers';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import stripe, { STRIPE_WEBHOOK_SECRET } from '@/lib/db/stripe';

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events for subscription lifecycle management
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return errorResponse('Missing stripe-signature header or webhook secret', 400);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return errorResponse('Invalid signature', 400);
  }

  const supabase = getSupabaseAdmin();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata?.supabase_user_id;
      const subscriptionId = session.subscription;

      if (!userId || !subscriptionId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: subscription.items.data[0]?.price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan: subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      }, { onConflict: 'user_id' });

      await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'premium' })
        .eq('id', userId);

      console.log(`Subscription activated for user ${userId}`);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription;

      if (!subscriptionId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const subscriptionData = subscription.items.data[0];

      // Update subscription period
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          stripe_price_id: subscriptionData?.price.id,
        })
        .eq('stripe_subscription_id', subscriptionId);

      break;
    }

    case 'customer.subscription.updated': {
      const updatedSubscription = event.data.object as any;

      await supabase
        .from('subscriptions')
        .update({
          status: updatedSubscription.status,
          current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', updatedSubscription.id);

      break;
    }

    case 'customer.subscription.deleted': {
      const deletedSubscription = event.data.object as any;
      const deletedUserId = deletedSubscription.metadata?.supabase_user_id;

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', deletedSubscription.id);

      if (deletedUserId) {
        await supabase
          .from('user_profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', deletedUserId);
      }

      console.log(`Subscription canceled for user ${deletedUserId}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return successResponse({ received: true });
}
// User and authentication types

export type SubscriptionTier = 'free' | 'premium';
export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  dream_reminder_time?: string; // HH:mm format
  email_digest?: 'never' | 'weekly' | 'monthly';
}

export interface UpdateProfileRequest {
  display_name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
  settings?: UserSettings;
}

export interface ProfileResponse {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  onboarding_completed: boolean;
  settings: UserSettings;
  created_at: string;
}

// Stripe checkout
export interface CreateCheckoutRequest {
  price_id: string; // Stripe price ID
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  url: string;
  session_id: string;
}

export interface BillingInfo {
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null;
  payment_method: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
}

# DreamScape AI — Supabase Setup Guide

> *"Watch your dreams after you wake up."*

This document explains how to set up the Supabase backend for DreamScape AI. Follow these steps to configure the database, authentication, and storage.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Name it `dreamscape-ai`
4. Set a secure database password
5. Choose a region close to your users
6. Wait for the database to provision (~2 minutes)

## 2. Get Your API Credentials

In your Supabase dashboard → **Project Settings** → **API**:

| Variable | Location |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (e.g., `https://abc123.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret!) |

Copy these into `.env.local`

## 3. Run the Database Migration

### Option A: Supabase SQL Editor (Recommended for initial setup)

1. In Supabase Dashboard → **SQL Editor**
2. Open `supabase/migrations/00001_initial_schema.sql`
3. Copy the entire file content
4. Paste into SQL Editor
5. Click **Run**

### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## 4. Configure Authentication

### Enable Auth Providers

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email/Password** (default)
3. Enable **Google**:
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Enable **Apple** (optional, for iOS users):
   - Configure Apple Sign-In in Apple Developer Portal
   - Add the Service ID and redirect URLs

### Configure Site URL

1. Settings → **Authentication** → **URL Configuration**
2. Set **Site URL** to your app's URL (e.g., `http://localhost:3000` for dev)
3. Add redirect URLs in **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback`
   - `https://yourdomain.com/api/auth/callback`

## 5. Configure Storage Buckets

Create a bucket for dream audio recordings:

```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('dream-recordings', 'dream-recordings', false);
```

Create a storage policy for authenticated users:

```sql
-- Allow authenticated users to upload their dream recordings
CREATE POLICY "Users can upload their own recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dream-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own recordings
CREATE POLICY "Users can read their own recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dream-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 6. Configure the Database Schema

The full schema is in `supabase/migrations/00001_initial_schema.sql` and includes:

### Tables
| Table | Purpose |
|-------|---------|
| `user_profiles` | Extends Supabase Auth with subscription and profile data |
| `dreams` | Core dream records with AI processing fields |
| `dream_alternate_endings` | User-created alternate dream endings |
| `dream_universe_entities` | Recurring characters, locations, and symbols |
| `dream_streaks` | Gamification streak tracking |
| `monthly_reports` | Monthly dream analytics reports |
| `subscriptions` | Stripe subscription records |
| `alarms` | Smart alarm system for dream recording |

### Row Level Security (RLS)
All tables have RLS enabled. Policies ensure users can only access their own data. The `user_profiles` table auto-creates a profile row when a new user signs up via the `handle_new_user()` trigger.

### Indexes
Performance indexes are created on frequently queried columns (user_id, dream_date, etc.).

## 7. Set up Stripe (Payments)

### Stripe Dashboard Setup

1. Create a [Stripe account](https://stripe.com)
2. Go to **Products** → **Add Product**
3. Create two subscription products:

**Monthly Plan** ($14.99/month):
- Price: $14.99
- Billing: Monthly
- Price ID looks like: `price_xxxxxxxxxxxxx`

**Yearly Plan** ($99/year):
- Price: $99.00
- Billing: Yearly
- Price ID looks like: `price_yyyyyyyyyyyyy`

### Webhook Configuration

1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint**: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (`whsec_...`) to your `.env.local`

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_monthly
STRIPE_PRICE_YEARLY=price_yearly
```

## 8. Verify Setup

Run the development server:

```bash
npm run dev
```

### API Health Check

```bash
# Test that the API is responding
curl http://localhost:3000/api/dreams
# Should return: { "success": false, "error": "Unauthorized" }
# (401 is expected without auth token)
```

### Test Database Connection

```sql
-- In Supabase SQL Editor, verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

Expected output: `user_profiles`, `dreams`, `dream_alternate_endings`, `dream_universe_entities`, `dream_streaks`, `monthly_reports`, `subscriptions`, `alarms`

## 9. Troubleshooting

| Problem | Solution |
|---------|----------|
| `relation "user_profiles" does not exist` | Run the migration SQL file again |
| `jwt token expired` | Refresh the auth token or sign in again |
| `new row violates row-level security policy` | Check the RLS policies allow the operation |
| Stripe webhook returns 400 | Verify the webhook secret in `.env.local` matches Stripe Dashboard |
| Auth callback shows "Invalid Host header" | Add your localhost URL to Supabase Auth URL configuration |
| `column "stripe_customer_id" of relation "user_profiles" does not exist` | Migration wasn't fully applied; re-run the SQL |

---

## API Routes Overview

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/auth/callback` | Handle auth redirect |
| GET | `/api/dreams` | List dreams (paginated) |
| POST | `/api/dreams` | Create dream |
| GET | `/api/dreams/[id]` | Get dream details |
| PUT | `/api/dreams/[id]` | Update dream |
| POST | `/api/dreams/[id]/reconstruct` | Trigger AI reconstruction |
| POST | `/api/dreams/[id]/generate-movie` | Generate AI movie |
| GET/POST | `/api/dreams/[id]/alternate-endings` | Manage alternate endings |
| GET | `/api/universe` | Get dream universe entities |
| GET | `/api/analytics` | Get dream analytics |
| POST | `/api/stripe/create-checkout` | Start subscription checkout |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET | `/api/reports/monthly` | Get monthly report |
| GET/POST | `/api/alarms` | List/Create alarms |
| PUT/DELETE | `/api/alarms/[id]` | Update/Delete alarm |

---

## Development

**Free tier limits:**
- 3 dream movies per month
- Standard definition (SD) video
- Basic interpretation

**Premium unlocks:**
- Unlimited dream movies
- HD video quality
- Dream Universe visualization
- Alternate endings with movies
- Monthly analytics reports
- Annual Dream Book (PDF)
# DreamScape AI — Deployment Guide

> *"Watch your dreams after you wake up."*

This guide covers deploying DreamScape AI to production. The stack: **Next.js 16** (App Router) on **Vercel**, **Supabase** for database/auth, **Stripe** for payments.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Database Deployment](#3-database-deployment)
4. [Stripe Configuration](#4-stripe-configuration)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Custom Domain](#6-custom-domain)
7. [Post-Deployment Checks](#7-post-deployment-checks)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

| Service | Account Needed | Purpose |
|---------|---------------|---------|
| [Vercel](https://vercel.com) | Free tier | Host Next.js app |
| [Supabase](https://supabase.com) | Free tier | Database + Auth + Storage |
| [Stripe](https://stripe.com) | Free tier | Payment processing |
| [OpenAI](https://platform.openai.com) | API credits | Dream reconstruction & interpretation |
| [Anthropic](https://console.anthropic.com) | API credits | Dream interpretation (optional) |
| [GitHub](https://github.com) | Free | Source control |

**Local tooling:**
- Node.js 20+
- npm, git, and a code editor

---

## 2. Environment Setup

### 2.1 Clone & Install

```bash
git clone <your-repo-url>
cd dreamscape-app
npm install
```

### 2.2 Verify Environment

```bash
# Check all required vars are set
node scripts/verify-env.js
```

### 2.3 Required Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# ── Supabase (REQUIRED) ─────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Stripe (needed for payments) ────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_monthly_id
STRIPE_PRICE_YEARLY=price_yearly_id

# ── AI Providers (needed for dream pipelines) ──────────────
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# ── Site (optional, defaults to localhost) ─────────────────
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 3. Database Deployment

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name: `dreamscape-ai`
3. Set a secure database password
4. Choose region closest to your users

### 3.2 Run Migrations

**Option A: SQL Editor (quickest)**

1. Supabase Dashboard → **SQL Editor**
2. Open `supabase/migrations/00001_initial_schema.sql`
3. Copy and paste the entire file
4. Click **Run**

**Option B: Supabase CLI (for CI/CD)**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### 3.3 Configure Auth Providers

1. **Settings** → **Authentication** → **Providers**
2. Enable **Email/Password** (default)
3. Enable **Google**:
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Enable **Apple** (optional for iOS):
   - Configure in Apple Developer Portal

### 3.4 Configure Site URL

1. **Authentication** → **URL Configuration**
2. Set **Site URL** to `https://yourdomain.com`
3. Add redirect URLs:
   - `https://yourdomain.com/api/auth/callback`
   - `https://yourdomain.com/login`

### 3.5 Configure Storage

Create a bucket for dream audio recordings:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('dream-recordings', 'dream-recordings', false);
```

---

## 4. Stripe Configuration

### 4.1 Create Products

1. Stripe Dashboard → **Products** → **Add Product**
2. Create **Premium Monthly** ($14.99/month)
3. Create **Premium Yearly** ($99/year)
4. Copy the **Price IDs** (start with `price_`)

### 4.2 Set Webhook Endpoint

1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint**: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (`whsec_...`)

---

## 5. Vercel Deployment

### 5.1 Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 5.2 Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Configure **Environment Variables** (all from `.env.local`)
5. Deploy

### 5.3 Environment Variables in Vercel

Add each environment variable in:

Vercel Dashboard → **Project Settings** → **Environment Variables**

| Variable | Type | Note |
|----------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Secret | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Secret | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | ⚠️ Server-only, never client |
| `STRIPE_SECRET_KEY` | Secret | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Secret | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Secret | Webhook signing secret |
| `STRIPE_PRICE_MONTHLY` | Secret | Monthly price ID |
| `STRIPE_PRICE_YEARLY` | Secret | Yearly price ID |
| `OPENAI_API_KEY` | Secret | OpenAI API key |
| `ANTHROPIC_API_KEY` | Secret | Anthropic API key |
| `NEXT_PUBLIC_SITE_URL` | Secret | Production URL |

### 5.4 Build Configuration

The `next.config.ts` is pre-configured. Key settings:

```typescript
const nextConfig: NextConfig = {
  // No special config needed — defaults work for this app
};
```

The build command is: `next build`  
The output directory is: `.next` (default)

---

## 6. Custom Domain

1. Vercel Dashboard → **Project** → **Domains**
2. Add your domain (e.g., `dreamscape-ai.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` env var
5. Update Supabase Auth → **URL Configuration** → **Site URL**

---

## 7. Post-Deployment Checks

### 7.1 Health Check

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-08T...",
  "environment": { "node": "v20.x", "runtime": "production" },
  "env": [ ... ],
  "checks": {
    "required_vars": { "status": "passed" },
    "supabase": { "configured": true },
    "stripe": { "configured": true },
    "ai": { "openai": true, "anthropic": true }
  }
}
```

### 7.2 Test Auth Flow

1. Visit `https://yourdomain.com/signup`
2. Create an account with email + password
3. Check email for confirmation
4. Sign in at `https://yourdomain.com/login`
5. Test Google sign-in

### 7.3 Test Dream Recording

1. Navigate to dream capture page
2. Record a dream via text or voice
3. Call `/api/dreams/[id]/reconstruct` to process it
4. Call `/api/dreams/[id]/generate-movie` to create a storyboard

### 7.4 Test Subscription

1. Visit `/settings/billing`
2. Click "Subscribe Monthly"
3. Complete Stripe Checkout (use test card: `4242 4242 4242 4242`)
4. Verify Stripe webhook created the subscription in DB

---

## 8. Monitoring & Maintenance

### 8.1 Vercel Analytics

- **Vercel Dashboard → Analytics** — Monitor traffic, performance, errors
- **Vercel Dashboard → Logs** — View server-side logs (for Pro teams)

### 8.2 Supabase Monitoring

- **Supabase Dashboard → Database → Reports** — Query performance
- **Supabase Dashboard → Auth → Users** — User growth and activity
- **Supabase Dashboard → Logs** — Database logs

### 8.3 Stripe Monitoring

- **Stripe Dashboard → Payments** — Revenue tracking
- **Stripe Dashboard → Subscriptions** — Active subscribers, churn

### 8.4 AI Provider Monitoring

- **OpenAI Dashboard → Usage** — API costs and tokens
- **Anthropic Console → Usage** — API costs and tokens

### 8.5 Regular Maintenance

```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Re-deploy
vercel --prod
```

---

## 9. Database Migrations

To add new migrations:

```bash
# Create a new migration file
touch supabase/migrations/00002_add_new_feature.sql

# Write your SQL, then apply it
# Option 1: SQL Editor (copy-paste)
# Option 2: Supabase CLI
supabase db push
```

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Health check returns 503` | Missing required env vars — check Vercel environment settings |
| `Auth callback shows error` | Verify Supabase redirect URLs match your domain |
| `Stripe checkout doesn't redirect` | Check `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY` env vars |
| `Stripe webhook returns 400` | Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard |
| `AI reconstruction fails` | Verify `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set |
| `Dreams not saving` | Check Supabase RLS policies in `00001_initial_schema.sql` |
| `Build fails with Turbopack error` | Try `next build --no-turbo` or contact AI engineer for SDK issues |
| `"Module not found" errors` | Run `npm install` and ensure all dependencies are installed |

---

## Architecture Overview

```
┌───────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Browser     │────→│   Vercel/Next.js  │────→│   Supabase   │
│  (React SPA)  │     │   (API Routes)    │     │  (DB + Auth)  │
└───────┬───────┘     └────────┬─────────┘     └──────┬───────┘
        │                      │                      │
        │                      ▼                      │
        │              ┌──────────────┐               │
        ├─────────────→│   Stripe     │←──────────────┘
        │              │  (Payments)  │
        │              └──────────────┘
        │                      │
        ▼                      ▼
  ┌──────────┐         ┌──────────────┐
  │  OpenAI  │         │  Anthropic   │
  │  (GPT-4) │         │  (Claude 3)  │
  └──────────┘         └──────────────┘
```

**Data Flow:**
1. User signs up → Supabase Auth → `user_profiles` created
2. User records dream → saved to `dreams` table
3. Dream reconstructed → calls OpenAI/Anthropic → updates dream record
4. Movie generated → AI creates storyboard → saved as `movie_prompts`
5. User subscribes → Stripe Checkout → webhook updates subscription status
6. User views analytics → computed from dream data

---

## Performance Considerations

- **API Routes**: All API routes are serverless functions on Vercel Edge/Serverless
- **Database**: Indexed on `user_id` and `dream_date` for fast queries
- **AI Calls**: OpenAI/Anthropic calls may take 3-10 seconds — use loading states on frontend
- **Movie Generation**: Most expensive operation — consider queueing for free tier users
- **Caching**: Health endpoint uses `no-store`; add caching headers to GET endpoints as needed

---

## Security Checklist

- [ ] All Supabase tables have RLS enabled
- [ ] Stripe webhook secret is not exposed to client
- [ ] Supabase service role key is server-only env var
- [ ] AI API keys are server-only env vars
- [ ] CORS middleware restricts origins
- [ ] Auth session refresh is configured
- [ ] HTTPS is enforced (Vercel default)
- [ ] Database backups are configured (Supabase auto-backups for Pro tier)
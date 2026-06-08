-- DreamScape AI - Initial Database Schema
-- Requires: pgcrypto extension (for gen_random_uuid)
-- Run in Supabase SQL Editor or via `supabase db push`

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. User Profiles (extends Supabase Auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Dreams
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  dream_date DATE NOT NULL,

  -- Raw capture
  audio_url TEXT,
  raw_transcript TEXT,
  capture_method TEXT CHECK (capture_method IN ('voice', 'text', 'upload')),

  -- AI processed
  reconstructed_story TEXT,
  summary TEXT,
  dream_duration_min INTEGER,
  dream_duration_max INTEGER,
  completeness_score INTEGER CHECK (completeness_score >= 0 AND completeness_score <= 100),

  -- Structured data (JSONB for flexibility)
  characters JSONB DEFAULT '[]'::jsonb,
  locations JSONB DEFAULT '[]'::jsonb,
  emotions JSONB DEFAULT '[]'::jsonb,
  symbols JSONB DEFAULT '[]'::jsonb,
  sensory_details JSONB DEFAULT '[]'::jsonb,

  -- Movie generation
  movie_style TEXT CHECK (movie_style IN ('cinematic', 'fantasy', 'surreal', 'horror', 'sci-fi', 'animated', 'realistic')),
  movie_duration_seconds INTEGER CHECK (movie_duration_seconds IN (30, 60, 90)),
  movie_url TEXT,
  movie_status TEXT DEFAULT 'pending' CHECK (movie_status IN ('pending', 'generating', 'ready', 'failed')),
  movie_prompts JSONB DEFAULT '[]'::jsonb,
  storyboard JSONB DEFAULT '[]'::jsonb,

  -- Interpretation
  psychological_interpretation TEXT,
  symbolic_interpretation TEXT,
  archetypal_interpretation TEXT,
  reflection_questions JSONB DEFAULT '[]'::jsonb,
  personal_insights TEXT,

  -- Ending
  chosen_ending TEXT,
  alternate_endings JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  wake_feeling TEXT,
  alert_method TEXT CHECK (alert_method IN ('natural', 'alarm')),
  lucid BOOLEAN DEFAULT FALSE,
  nightmare BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dreams
CREATE INDEX idx_dreams_user_id ON dreams(user_id);
CREATE INDEX idx_dreams_dream_date ON dreams(dream_date);
CREATE INDEX idx_dreams_movie_status ON dreams(movie_status);
CREATE INDEX idx_dreams_created_at ON dreams(created_at);
CREATE INDEX idx_dreams_user_date ON dreams(user_id, dream_date DESC);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dreams_updated_at
  BEFORE UPDATE ON dreams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. Dream Alternate Endings
CREATE TABLE dream_alternate_endings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  ending_type TEXT CHECK (ending_type IN ('continue', 'face_threat', 'explore_door', 'change_ending', 'ai_continue', 'custom')),
  custom_text TEXT,
  generated_story TEXT,
  movie_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alternate_endings_dream_id ON dream_alternate_endings(dream_id);

-- 4. Dream Universe Entities
CREATE TABLE dream_universe_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('character', 'location', 'symbol', 'storyline')),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  appearance_count INTEGER DEFAULT 1,
  first_appearance TIMESTAMPTZ,
  last_appearance TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_universe_user_id ON dream_universe_entities(user_id);
CREATE INDEX idx_universe_type ON dream_universe_entities(entity_type);
CREATE INDEX idx_universe_user_type ON dream_universe_entities(user_id, entity_type);

-- 5. Dream Streaks
CREATE TABLE dream_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_dream_date DATE,
  total_dreams INTEGER DEFAULT 0
);

CREATE INDEX idx_streaks_user_id ON dream_streaks(user_id);

-- 6. Monthly Reports
CREATE TABLE monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  total_dreams INTEGER,
  top_emotions JSONB,
  top_symbols JSONB,
  top_characters JSONB,
  top_locations JSONB,
  insights TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

CREATE INDEX idx_reports_user_id ON monthly_reports(user_id);

-- 7. Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  plan TEXT CHECK (plan IN ('monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 8. Alarms
CREATE TABLE alarms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  time TEXT NOT NULL, -- HH:mm format
  days JSONB DEFAULT '[]'::jsonb, -- ['mon', 'tue', ...]
  enabled BOOLEAN DEFAULT TRUE,
  dream_recording_prompt BOOLEAN DEFAULT TRUE,
  sound TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alarms_user_id ON alarms(user_id);

CREATE TRIGGER alarms_updated_at
  BEFORE UPDATE ON alarms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_alternate_endings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_universe_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own dreams"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dreams"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own dream endings"
  ON dream_alternate_endings FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM dreams WHERE id = dream_id));

CREATE POLICY "Users can create own dream endings"
  ON dream_alternate_endings FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM dreams WHERE id = dream_id));

CREATE POLICY "Users can manage own universe"
  ON dream_universe_entities FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks"
  ON dream_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON dream_streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports"
  ON monthly_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alarms"
  ON alarms FOR ALL
  USING (auth.uid() = user_id);

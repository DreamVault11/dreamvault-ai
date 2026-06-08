// Database row types matching the Supabase PostgreSQL schema

export interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'premium';
  stripe_customer_id: string | null;
  created_at: string;
  onboarding_completed: boolean;
}

export interface Dream {
  id: string;
  user_id: string;
  recorded_at: string;
  dream_date: string;

  // Raw capture
  audio_url: string | null;
  raw_transcript: string | null;
  capture_method: 'voice' | 'text' | 'upload' | null;

  // AI processed
  reconstructed_story: string | null;
  summary: string | null;
  dream_duration_min: number | null;
  dream_duration_max: number | null;
  completeness_score: number | null;

  // Structured data
  characters: string[];
  locations: string[];
  emotions: string[];
  symbols: string[];
  sensory_details: string[];

  // Movie generation
  movie_style: 'cinematic' | 'fantasy' | 'surreal' | 'horror' | 'sci-fi' | 'animated' | 'realistic' | null;
  movie_duration_seconds: 30 | 60 | 90 | null;
  movie_url: string | null;
  movie_status: 'pending' | 'generating' | 'ready' | 'failed';
  movie_prompts: string[];
  storyboard: StoryboardFrame[];

  // Interpretation
  psychological_interpretation: string | null;
  symbolic_interpretation: string | null;
  archetypal_interpretation: string | null;
  reflection_questions: string[];
  personal_insights: string | null;

  // Ending
  chosen_ending: string | null;
  alternate_endings: AlternateEnding[];

  // Metadata
  wake_feeling: string | null;
  alert_method: 'natural' | 'alarm' | null;
  lucid: boolean;
  nightmare: boolean;

  created_at: string;
  updated_at: string;
}

export interface StoryboardFrame {
  scene_number: number;
  description: string;
  visual_prompt: string;
  duration_seconds: number;
  camera_angle?: string;
  mood?: string;
}

export interface AlternateEnding {
  id: string;
  dream_id: string;
  ending_type: 'continue' | 'face_threat' | 'explore_door' | 'change_ending' | 'ai_continue' | 'custom';
  custom_text: string | null;
  generated_story: string | null;
  movie_url: string | null;
  created_at: string;
}

export interface DreamUniverseEntity {
  id: string;
  user_id: string;
  entity_type: 'character' | 'location' | 'symbol' | 'storyline';
  name: string;
  description: string | null;
  image_url: string | null;
  appearance_count: number;
  first_appearance: string | null;
  last_appearance: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DreamStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_dream_date: string | null;
  total_dreams: number;
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_dreams: number | null;
  top_emotions: Record<string, number> | null;
  top_symbols: Record<string, number> | null;
  top_characters: Record<string, number> | null;
  top_locations: Record<string, number> | null;
  insights: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | null;
  current_period_start: string | null;
  current_period_end: string | null;
  plan: 'monthly' | 'yearly' | null;
  created_at: string;
}

export interface Alarm {
  id: string;
  user_id: string;
  title: string;
  time: string; // HH:mm format
  days: string[]; // ['mon', 'tue', ...]
  enabled: boolean;
  dream_recording_prompt: boolean;
  sound: string | null;
  created_at: string;
  updated_at: string;
}

// Supabase Database type definitions for DreamScape AI
// This file provides types for all tables so supabase.from() works correctly

export interface Json {
  [key: string]: unknown | null | string | number | boolean | Json[] | { [key: string]: Json };
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          email: string | null;
          avatar_url: string | null;
          subscription_tier: string;
          stripe_customer_id: string | null;
          created_at: string;
          onboarding_completed: boolean;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          onboarding_completed?: boolean;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          onboarding_completed?: boolean;
        };
      };
      dreams: {
        Row: {
          id: string;
          user_id: string;
          recorded_at: string;
          dream_date: string;
          audio_url: string | null;
          raw_transcript: string | null;
          capture_method: string | null;
          reconstructed_story: string | null;
          summary: string | null;
          dream_duration_min: number | null;
          dream_duration_max: number | null;
          completeness_score: number | null;
          characters: Json;
          locations: Json;
          emotions: Json;
          symbols: Json;
          sensory_details: Json;
          movie_style: string | null;
          movie_duration_seconds: number | null;
          movie_url: string | null;
          movie_status: string;
          movie_prompts: Json;
          storyboard: Json;
          psychological_interpretation: string | null;
          symbolic_interpretation: string | null;
          archetypal_interpretation: string | null;
          reflection_questions: Json;
          personal_insights: string | null;
          chosen_ending: string | null;
          alternate_endings: Json;
          wake_feeling: string | null;
          alert_method: string | null;
          lucid: boolean;
          nightmare: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recorded_at?: string;
          dream_date: string;
          audio_url?: string | null;
          raw_transcript?: string | null;
          capture_method?: string | null;
          reconstructed_story?: string | null;
          summary?: string | null;
          dream_duration_min?: number | null;
          dream_duration_max?: number | null;
          completeness_score?: number | null;
          characters?: Json;
          locations?: Json;
          emotions?: Json;
          symbols?: Json;
          sensory_details?: Json;
          movie_style?: string | null;
          movie_duration_seconds?: number | null;
          movie_url?: string | null;
          movie_status?: string;
          movie_prompts?: Json;
          storyboard?: Json;
          psychological_interpretation?: string | null;
          symbolic_interpretation?: string | null;
          archetypal_interpretation?: string | null;
          reflection_questions?: Json;
          personal_insights?: string | null;
          chosen_ending?: string | null;
          alternate_endings?: Json;
          wake_feeling?: string | null;
          alert_method?: string | null;
          lucid?: boolean;
          nightmare?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recorded_at?: string;
          dream_date?: string;
          audio_url?: string | null;
          raw_transcript?: string | null;
          capture_method?: string | null;
          reconstructed_story?: string | null;
          summary?: string | null;
          dream_duration_min?: number | null;
          dream_duration_max?: number | null;
          completeness_score?: number | null;
          characters?: Json;
          locations?: Json;
          emotions?: Json;
          symbols?: Json;
          sensory_details?: Json;
          movie_style?: string | null;
          movie_duration_seconds?: number | null;
          movie_url?: string | null;
          movie_status?: string;
          movie_prompts?: Json;
          storyboard?: Json;
          psychological_interpretation?: string | null;
          symbolic_interpretation?: string | null;
          archetypal_interpretation?: string | null;
          reflection_questions?: Json;
          personal_insights?: string | null;
          chosen_ending?: string | null;
          alternate_endings?: Json;
          wake_feeling?: string | null;
          alert_method?: string | null;
          lucid?: boolean;
          nightmare?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      dream_alternate_endings: {
        Row: {
          id: string;
          dream_id: string;
          ending_type: string;
          custom_text: string | null;
          generated_story: string | null;
          movie_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          dream_id: string;
          ending_type: string;
          custom_text?: string | null;
          generated_story?: string | null;
          movie_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          dream_id?: string;
          ending_type?: string;
          custom_text?: string | null;
          generated_story?: string | null;
          movie_url?: string | null;
          created_at?: string;
        };
      };
      dream_universe_entities: {
        Row: {
          id: string;
          user_id: string;
          entity_type: string;
          name: string;
          description: string | null;
          image_url: string | null;
          appearance_count: number;
          first_appearance: string | null;
          last_appearance: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          appearance_count?: number;
          first_appearance?: string | null;
          last_appearance?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entity_type?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          appearance_count?: number;
          first_appearance?: string | null;
          last_appearance?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      dream_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_dream_date: string | null;
          total_dreams: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_dream_date?: string | null;
          total_dreams?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_dream_date?: string | null;
          total_dreams?: number;
        };
      };
      monthly_reports: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          month: number;
          total_dreams: number | null;
          top_emotions: Json | null;
          top_symbols: Json | null;
          top_characters: Json | null;
          top_locations: Json | null;
          insights: string | null;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          month: number;
          total_dreams?: number | null;
          top_emotions?: Json | null;
          top_symbols?: Json | null;
          top_characters?: Json | null;
          top_locations?: Json | null;
          insights?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number;
          month?: number;
          total_dreams?: number | null;
          top_emotions?: Json | null;
          top_symbols?: Json | null;
          top_characters?: Json | null;
          top_locations?: Json | null;
          insights?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          status: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          plan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          plan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          plan?: string | null;
          created_at?: string;
        };
      };
      alarms: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          time: string;
          days: Json;
          enabled: boolean;
          dream_recording_prompt: boolean;
          sound: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          time: string;
          days?: Json;
          enabled?: boolean;
          dream_recording_prompt?: boolean;
          sound?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          time?: string;
          days?: Json;
          enabled?: boolean;
          dream_recording_prompt?: boolean;
          sound?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
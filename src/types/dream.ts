// Dream-specific API types

export type CaptureMethod = 'voice' | 'text' | 'upload';
export type MovieStyle = 'cinematic' | 'fantasy' | 'surreal' | 'horror' | 'sci-fi' | 'animated' | 'realistic';
export type MovieDuration = 30 | 60 | 90;
export type MovieStatus = 'pending' | 'generating' | 'ready' | 'failed';
export type AlertMethod = 'natural' | 'alarm';
export type EndingType = 'continue' | 'face_threat' | 'explore_door' | 'change_ending' | 'ai_continue' | 'custom';

// Request types
export interface CreateDreamRequest {
  dream_date: string;
  raw_transcript?: string;
  capture_method?: CaptureMethod;
  audio_url?: string;
  wake_feeling?: string;
  alert_method?: AlertMethod;
  lucid?: boolean;
  nightmare?: boolean;
}

export interface UpdateDreamRequest {
  reconstructed_story?: string;
  summary?: string;
  dream_duration_min?: number;
  dream_duration_max?: number;
  completeness_score?: number;
  characters?: string[];
  locations?: string[];
  emotions?: string[];
  symbols?: string[];
  sensory_details?: string[];
  movie_style?: MovieStyle;
  movie_duration_seconds?: MovieDuration;
  movie_url?: string;
  movie_status?: MovieStatus;
  movie_prompts?: string[];
  storyboard?: StoryboardFrame[];
  psychological_interpretation?: string;
  symbolic_interpretation?: string;
  archetypal_interpretation?: string;
  reflection_questions?: string[];
  personal_insights?: string;
  chosen_ending?: string;
  alternate_endings?: AlternateEndingInput[];
  wake_feeling?: string;
  alert_method?: AlertMethod;
  lucid?: boolean;
  nightmare?: boolean;
}

export interface CreateAlternateEndingRequest {
  ending_type: EndingType;
  custom_text?: string;
  generated_story?: string;
  movie_url?: string;
}

export interface StoryboardFrame {
  scene_number: number;
  description: string;
  visual_prompt: string;
  duration_seconds: number;
  camera_angle?: string;
  mood?: string;
}

export interface AlternateEndingInput {
  ending_type: EndingType;
  custom_text?: string;
  generated_story?: string;
  movie_url?: string;
}

// Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface DreamListQuery {
  page?: number;
  page_size?: number;
  from_date?: string;
  to_date?: string;
  sort_by?: 'dream_date' | 'created_at' | 'recorded_at';
  sort_order?: 'asc' | 'desc';
}

export interface AnalyticsResponse {
  total_dreams: number;
  current_streak: number;
  longest_streak: number;
  top_emotions: Array<{ name: string; count: number }>;
  top_symbols: Array<{ name: string; count: number }>;
  top_characters: Array<{ name: string; count: number }>;
  top_locations: Array<{ name: string; count: number }>;
  dream_frequency: Array<{ date: string; count: number }>;
  lucid_dreams_percentage: number;
  nightmare_percentage: number;
  movie_generations: number;
}
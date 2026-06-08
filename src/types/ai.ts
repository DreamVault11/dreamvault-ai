// ============================================================
// DreamScape AI — Shared Type Definitions
// All AI pipeline inputs/outputs are typed here.
// ============================================================

// ── Providers ──────────────────────────────────────────────
export type AIProvider = "openai" | "anthropic";

export type AIModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307";

// ── Streaming ─────────────────────────────────────────────
export interface StreamChunk {
  delta: string;
  finishReason: "stop" | "length" | "error" | null;
}

export type StreamCallback = (chunk: StreamChunk) => void;

// ── Token Tracking ────────────────────────────────────────
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number; // estimated USD
}

// ── Recall Assistant ──────────────────────────────────────
export type RecallQuestionCategory =
  | "location"
  | "people"
  | "sensory"
  | "emotion"
  | "story"
  | "symbol"
  | "wake-up";

export interface RecallQuestion {
  id: string;
  category: RecallQuestionCategory;
  question: string;
  options?: string[];
}

export interface RecallSessionState {
  sessionId: string;
  currentStep: number;
  totalSteps: number;
  category: RecallQuestionCategory;
  answers: RecallAnswer[];
  isComplete: boolean;
}

export interface RecallAnswer {
  questionId: string;
  category: RecallQuestionCategory;
  question: string;
  answer: string;
  timestamp: string;
}

export interface RecallAssistantResponse {
  question: RecallQuestion;
  sessionState: RecallSessionState;
  rawTranscript?: string; // accumulated transcript so far
}

// ── Dream Reconstruction ──────────────────────────────────
export interface DreamCharacter {
  name: string;
  role: string; // e.g. "protagonist", "antagonist", "guide", "stranger", "family"
  description: string;
}

export interface DreamLocation {
  name: string;
  description: string;
}

export interface DreamTimeline {
  scene: string;
  order: number; // 0-based sequence
}

export interface DreamReconstruction {
  summary: string;
  story: string; // full narrative
  keySymbols: string[];
  emotionalThemes: string[];
  characters: DreamCharacter[];
  locations: DreamLocation[];
  timeline: DreamTimeline[];
  sensoryDetails: string[];
  completenessScore: number; // 0-100
  estimatedDuration: {
    min: number; // minutes
    max: number; // minutes
  };
}

// ── Interpretation ────────────────────────────────────────
export type InterpretationPerspective =
  | "psychological"
  | "symbolic"
  | "archetypal";

export interface SymbolInterpretation {
  symbol: string;
  meaning: string;
  confidence: number; // 0-1
  perspective: InterpretationPerspective;
}

export interface InterpretationInsight {
  perspective: InterpretationPerspective;
  title: string;
  content: string;
  symbols: SymbolInterpretation[];
}

export interface DreamInterpretation {
  dreamId: string;
  insights: InterpretationInsight[];
  reflectionQuestions: string[];
  personalPatternInsights: string[];
  disclaimer: string;
}

// ── Movie Generation ──────────────────────────────────────
export type AspectRatio = "9:16" | "16:9";

export type MovieStyle =
  | "cinematic"
  | "realistic"
  | "fantasy"
  | "surreal"
  | "horror"
  | "sci-fi"
  | "animated";

export interface ScenePrompt {
  sceneNumber: number;
  sceneTitle: string;
  visualPrompt: string; // detailed prompt for video AI
  duration: number; // seconds
  style: string;
  aspectRatio: AspectRatio;
  description: string;
  mood: string;
  cameraDirection?: string; // e.g. "wide shot", "close-up", "tracking"
  characterFocus?: string[];
}

export interface Storyboard {
  scenes: ScenePrompt[];
}

export interface MovieGenerationInput {
  dreamReconstruction: DreamReconstruction;
  style: MovieStyle;
  aspectRatio: AspectRatio;
  userPreferences?: {
    narrationStyle?: string;
    musicGenre?: string;
  };
}

export interface MovieGenerationOutput {
  title: string;
  tagline: string;
  storyboard: Storyboard;
  totalDuration: number; // seconds
  style: MovieStyle;
  aspectRatio: AspectRatio;
  narrationPrompt?: string;
}

// ── Alternate Endings ─────────────────────────────────────
export type AlternateEndingType =
  | "continue-dream"
  | "face-the-threat"
  | "explore-the-door"
  | "change-the-ending"
  | "ai-continue"
  | "write-custom";

export interface AlternateEndingInput {
  dreamReconstruction: DreamReconstruction;
  endingType: AlternateEndingType;
  originalDream: string; // full story text
  userWriting?: string; // for "write-custom" mode
}

export interface AlternateEndingOutput {
  type: AlternateEndingType;
  title: string;
  narrative: string;
  keyChanges: string[]; // what changed from original
  emotionalTone: string;
  sceneBreakdown: ScenePrompt[];
}

// ── Pattern Analytics ─────────────────────────────────────
export interface SymbolFrequency {
  symbol: string;
  count: number;
  percentage: number;
  firstAppearance: string; // ISO date
  lastAppearance: string; // ISO date
}

export interface EmotionCorrelation {
  emotion: string;
  frequency: number;
  associatedSymbols: string[];
  typicalCompletenessScore: number;
}

export interface CharacterRecurrence {
  name: string;
  role: string;
  appearances: number;
  dreamIds: string[];
}

export interface LocationAnalytics {
  name: string;
  frequency: number;
  dreamIds: string[];
}

export interface MoodDreamCorrelation {
  moodTag: string;
  totalDreams: number;
  commonSymbols: string[];
  averageCompleteness: number;
}

export interface AnalyticsInput {
  userId: string;
  dreams: DreamReconstruction[];
  dreamIds: string[];
  dreamDates: string[];
}

export interface PatternAnalytics {
  userId: string;
  totalDreamsAnalyzed: number;
  dateRange: { start: string; end: string };
  symbolFrequency: SymbolFrequency[];
  emotionCorrelations: EmotionCorrelation[];
  characterRecurrences: CharacterRecurrence[];
  locationPatterns: LocationAnalytics[];
  moodCorrelations: MoodDreamCorrelation[];
  topInsights: string[];
}

// ── Monthly Report ────────────────────────────────────────
export interface MonthlyStat {
  label: string;
  value: number | string;
  change?: number; // % change from previous month
}

export interface MonthlyDreamSummary {
  month: string; // "YYYY-MM"
  totalDreams: number;
  averageCompleteness: number;
  mostCommonEmotion: string;
  mostRecurringSymbol: string;
  dreamStreak: number; // longest streak in days
}

export interface MonthlyReport {
  userId: string;
  month: string;
  generatedAt: string;
  summary: MonthlyDreamSummary;
  stats: MonthlyStat[];
  topSymbols: SymbolFrequency[];
  emotionalJourney: string; // narrative
  notableDreams: string[]; // dream IDs or titles
  insightsAndPatterns: string; // narrative
  recommendation: string; // one-sentence advice
  nextMonthGoal: string;
  chartData: {
    emotionsOverTime: { date: string; emotion: string; intensity: number }[];
    symbolsOverTime: { date: string; symbol: string; count: number }[];
    completenessTrend: { date: string; score: number }[];
  };
}

// ── Generic AI Response ───────────────────────────────────
export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokenUsage?: TokenUsage;
}

// ── Error Types ───────────────────────────────────────────
export class AIPipelineError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider,
    public readonly pipeline: string,
    public readonly recoverable: boolean = false
  ) {
    super(message);
    this.name = "AIPipelineError";
  }
}

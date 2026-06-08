// ============================================================
// DreamScape AI — Hooks Barrel Export
// Import all AI hooks from a single path:
//   import { useRecallAssistant, useDreamReconstruction, ... } from "@/lib/hooks";
// ============================================================

export { useRecallAssistant } from "./use-recall-assistant";
export type { UseRecallAssistantReturn } from "./use-recall-assistant";

export { useDreamReconstruction } from "./use-dream-reconstruction";
export type { UseDreamReconstructionReturn } from "./use-dream-reconstruction";

export { useDreamInterpretation } from "./use-dream-interpretation";
export type { UseDreamInterpretationReturn } from "./use-dream-interpretation";

export { useMovieGeneration } from "./use-movie-generation";
export type { UseMovieGenerationReturn } from "./use-movie-generation";

export { usePatternAnalytics } from "./use-pattern-analytics";
export type { UsePatternAnalyticsReturn } from "./use-pattern-analytics";

export { useAlternateEnding } from "./use-alternate-ending";
export type { UseAlternateEndingReturn } from "./use-alternate-ending";

export { useMonthlyReport } from "./use-monthly-report";
export type { UseMonthlyReportReturn } from "./use-monthly-report";

// Shared utilities
export { useAsyncRunner, useStreamingRunner, useHookState, useStreamingState } from "./use-ai-shared";
export type { HookState, StreamingState } from "./use-ai-shared";
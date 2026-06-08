// ============================================================
// DreamScape AI — usePatternAnalytics Hook
// React hook wrapping the Dream Pattern Analytics pipeline.
// Analyzes dreams over time for recurring patterns.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  PatternAnalytics,
  AnalyticsInput,
  SymbolFrequency,
  EmotionCorrelation,
  CharacterRecurrence,
  LocationAnalytics,
  MoodDreamCorrelation,
  AIResponse,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  computePatternAnalytics,
  computeSymbolFrequency,
  computeEmotionCorrelations,
  computeCharacterRecurrence,
  computeLocationPatterns,
  computeMoodCorrelations,
} from "@/lib/ai/analytics";

// ── Types ─────────────────────────────────────────────────
export interface UsePatternAnalyticsReturn {
  /** Full pattern analysis result */
  analytics: PatternAnalytics | null;
  /** Whether analysis is loading */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage (for AI insight generation) */
  tokenUsage: HookState<PatternAnalytics>["tokenUsage"];

  /** Full AI-powered pattern analytics */
  analyze: (input: AnalyticsInput) => Promise<PatternAnalytics | null>;
  /** Deterministic: symbol frequency (no API call needed) */
  getSymbolFrequency: (
    dreams: DreamReconstruction[],
    dreamIds: string[],
    dreamDates: string[]
  ) => SymbolFrequency[];
  /** Deterministic: emotion correlations */
  getEmotionCorrelations: (dreams: DreamReconstruction[]) => EmotionCorrelation[];
  /** Deterministic: character recurrence */
  getCharacterRecurrence: (
    dreams: DreamReconstruction[],
    dreamIds: string[]
  ) => CharacterRecurrence[];
  /** Deterministic: location patterns */
  getLocationPatterns: (
    dreams: DreamReconstruction[],
    dreamIds: string[]
  ) => LocationAnalytics[];
  /** Deterministic: mood correlations */
  getMoodCorrelations: (dreams: DreamReconstruction[]) => MoodDreamCorrelation[];
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function usePatternAnalytics(): UsePatternAnalyticsReturn {
  const runner = useAsyncRunner<[AnalyticsInput], PatternAnalytics>();

  const analyze = useCallback(
    async (input: AnalyticsInput) => {
      return runner.run(computePatternAnalytics, input);
    },
    [runner]
  );

  // Deterministic functions (no API call, no async needed)
  const getSymbolFrequency = useCallback(
    (dreams: DreamReconstruction[], dreamIds: string[], dreamDates: string[]) => {
      return computeSymbolFrequency(dreams, dreamIds, dreamDates);
    },
    []
  );

  const getEmotionCorrelations = useCallback(
    (dreams: DreamReconstruction[]) => {
      return computeEmotionCorrelations(dreams);
    },
    []
  );

  const getCharacterRecurrence = useCallback(
    (dreams: DreamReconstruction[], dreamIds: string[]) => {
      return computeCharacterRecurrence(dreams, dreamIds);
    },
    []
  );

  const getLocationPatterns = useCallback(
    (dreams: DreamReconstruction[], dreamIds: string[]) => {
      return computeLocationPatterns(dreams, dreamIds);
    },
    []
  );

  const getMoodCorrelations = useCallback(
    (dreams: DreamReconstruction[]) => {
      return computeMoodCorrelations(dreams);
    },
    []
  );

  const reset = useCallback(() => {
    runner.reset();
  }, [runner]);

  return {
    analytics: runner.state.data,
    loading: runner.state.loading,
    error: runner.state.error,
    tokenUsage: runner.state.tokenUsage,

    analyze,
    getSymbolFrequency,
    getEmotionCorrelations,
    getCharacterRecurrence,
    getLocationPatterns,
    getMoodCorrelations,
    reset,
  };
}
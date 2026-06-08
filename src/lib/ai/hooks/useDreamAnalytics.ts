// ============================================================
// DreamScape AI — useDreamAnalytics Hook
// Fetches pattern analytics from the API.
// Returns symbol frequencies, emotion correlations,
// character recurrences, location patterns, mood correlations.
// ============================================================

"use client";

import { useState, useCallback } from "react";
import {
  DreamReconstruction,
  PatternAnalytics,
  AnalyticsInput,
  SymbolFrequency,
  EmotionCorrelation,
  CharacterRecurrence,
  LocationAnalytics,
  MoodDreamCorrelation,
} from "@/types/ai";
import {
  computePatternAnalytics,
  computeSymbolFrequency,
  computeEmotionCorrelations,
  computeCharacterRecurrence,
  computeLocationPatterns,
  computeMoodCorrelations,
} from "@/lib/ai/analytics";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamAnalyticsReturn {
  /** Full AI-powered pattern analytics result */
  data: PatternAnalytics | null;
  /** Whether analytics are loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage (for AI insight generation) */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Run full AI-powered pattern analysis */
  analyze: (input: AnalyticsInput) => Promise<PatternAnalytics | null>;
  /** Get symbol frequency (deterministic, no API call) */
  getSymbolFrequency: (
    dreams: DreamReconstruction[],
    dreamIds: string[],
    dreamDates: string[]
  ) => SymbolFrequency[];
  /** Get emotion correlations (deterministic, no API call) */
  getEmotionCorrelations: (dreams: DreamReconstruction[]) => EmotionCorrelation[];
  /** Get character recurrence (deterministic, no API call) */
  getCharacterRecurrence: (
    dreams: DreamReconstruction[],
    dreamIds: string[]
  ) => CharacterRecurrence[];
  /** Get location patterns (deterministic, no API call) */
  getLocationPatterns: (
    dreams: DreamReconstruction[],
    dreamIds: string[]
  ) => LocationAnalytics[];
  /** Get mood correlations (deterministic, no API call) */
  getMoodCorrelations: (dreams: DreamReconstruction[]) => MoodDreamCorrelation[];
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamAnalytics(): UseDreamAnalyticsReturn {
  const [data, setData] = useState<PatternAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseDreamAnalyticsReturn["tokenUsage"]>(null);

  // ── Full AI-powered analysis ───────────────────────────
  const analyze = useCallback(async (input: AnalyticsInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await computePatternAnalytics(input);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Analytics failed";
        setError(errMsg);
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Deterministic functions (no API call) ──────────────
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

  // ── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
    setTokenUsage(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    tokenUsage,
    analyze,
    getSymbolFrequency,
    getEmotionCorrelations,
    getCharacterRecurrence,
    getLocationPatterns,
    getMoodCorrelations,
    reset,
  };
}
// ============================================================
// DreamScape AI — useAlternateEnding Hook
// Takes a dream + ending type. Returns alternate narrative
// + scene breakdown. Handles generation states.
// ============================================================

"use client";

import { useState, useCallback } from "react";
import {
  DreamReconstruction,
  AlternateEndingInput,
  AlternateEndingOutput,
  AlternateEndingType,
} from "@/types/ai";
import {
  generateAlternateEnding,
  generateAllEndings,
  getAlternateEndingModes,
} from "@/lib/ai/alternate-endings";

// ── Types ─────────────────────────────────────────────────
export interface UseAlternateEndingReturn {
  /** The generated alternate ending */
  data: AlternateEndingOutput | null;
  /** Whether generation is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Generate a single alternate ending */
  generate: (input: AlternateEndingInput) => Promise<AlternateEndingOutput | null>;
  /** Generate all 5 AI-powered alternate endings at once */
  generateAll: (
    reconstruction: DreamReconstruction,
    originalDream: string
  ) => Promise<AlternateEndingOutput[] | null>;
  /** Get available ending modes for UI selectors */
  getModes: () => ReturnType<typeof getAlternateEndingModes>;
  /** Reset state */
  reset: () => void;

  /** All endings from batch generation */
  allEndings: AlternateEndingOutput[] | null;
  /** Loading state for batch generation */
  isAllLoading: boolean;
}

// ── Hook ──────────────────────────────────────────────────
export function useAlternateEnding(): UseAlternateEndingReturn {
  const [data, setData] = useState<AlternateEndingOutput | null>(null);
  const [allEndings, setAllEndings] = useState<AlternateEndingOutput[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseAlternateEndingReturn["tokenUsage"]>(null);

  // ── Generate single ending ─────────────────────────────
  const generate = useCallback(async (input: AlternateEndingInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateAlternateEnding(input);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Alternate ending generation failed";
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

  // ── Generate all endings ───────────────────────────────
  const generateAll = useCallback(
    async (reconstruction: DreamReconstruction, originalDream: string) => {
      setIsAllLoading(true);
      setError(null);
      try {
        const result = await generateAllEndings(reconstruction, originalDream);
        if (result.success && result.data) {
          setAllEndings(result.data);
          return result.data;
        } else {
          const errMsg = result.error || "Batch generation failed";
          setError(errMsg);
          return null;
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
        return null;
      } finally {
        setIsAllLoading(false);
      }
    },
    []
  );

  // ── Get modes ──────────────────────────────────────────
  const getModes = useCallback(() => {
    return getAlternateEndingModes();
  }, []);

  // ── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setData(null);
    setAllEndings(null);
    setIsLoading(false);
    setIsAllLoading(false);
    setError(null);
    setTokenUsage(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    tokenUsage,
    generate,
    generateAll,
    getModes,
    reset,
    allEndings,
    isAllLoading,
  };
}
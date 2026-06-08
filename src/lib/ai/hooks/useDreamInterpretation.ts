// ============================================================
// DreamScape AI — useDreamInterpretation Hook
// Takes a dream reconstruction and returns interpretation
// with multiple psychological, symbolic, and archetypal
// perspectives. Handles loading states.
// ============================================================

"use client";

import { useState, useCallback } from "react";
import {
  DreamReconstruction,
  DreamInterpretation,
  InterpretationInput,
} from "@/types/ai";
import {
  interpretDream,
  quickInterpret,
} from "@/lib/ai/interpretation";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamInterpretationReturn {
  /** The interpretation result */
  data: DreamInterpretation | null;
  /** Whether interpretation is loading */
  isLoading: boolean;
  /** Error message if failed */
  error: string | null;
  /** API token usage */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Full interpretation with optional past dream context */
  interpret: (input: InterpretationInput) => Promise<DreamInterpretation | null>;
  /** Quick interpretation — just the dream reconstruction */
  quickInterpret: (reconstruction: DreamReconstruction) => Promise<DreamInterpretation | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamInterpretation(): UseDreamInterpretationReturn {
  const [data, setData] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseDreamInterpretationReturn["tokenUsage"]>(null);

  // ── Full interpretation ────────────────────────────────
  const interpret = useCallback(async (input: InterpretationInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await interpretDream(input);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Interpretation failed";
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

  // ── Quick interpretation ───────────────────────────────
  const quickInterpretFn = useCallback(async (reconstruction: DreamReconstruction) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await quickInterpret(reconstruction);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Quick interpretation failed";
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
    interpret,
    quickInterpret: quickInterpretFn,
    reset,
  };
}
// ============================================================
// DreamScape AI — useDreamReconstruction Hook
// Takes raw transcript + recall answers.
// Manages loading/error/success states.
// Returns the reconstructed dream (DreamReconstruction type).
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { DreamReconstruction, ReconstructionInput } from "@/types/ai";
import {
  reconstructDream,
  quickReconstruct,
} from "@/lib/ai/dream-reconstruction";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamReconstructionReturn {
  /** The reconstructed dream data */
  data: DreamReconstruction | null;
  /** Whether reconstruction is in progress */
  isLoading: boolean;
  /** Error message if failed */
  error: string | null;
  /** Token usage from the API call */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Full reconstruction with raw transcript + recall answers */
  reconstruct: (input: ReconstructionInput) => Promise<DreamReconstruction | null>;
  /** Quick reconstruction — just raw transcript text */
  quickReconstruct: (transcript: string) => Promise<DreamReconstruction | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamReconstruction(): UseDreamReconstructionReturn {
  const [data, setData] = useState<DreamReconstruction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseDreamReconstructionReturn["tokenUsage"]>(null);

  // ── Full reconstruction ────────────────────────────────
  const reconstruct = useCallback(async (input: ReconstructionInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await reconstructDream(input);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Reconstruction failed";
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

  // ── Quick reconstruction ───────────────────────────────
  const quickReconstructFn = useCallback(async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await quickReconstruct(transcript);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Quick reconstruction failed";
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
    reconstruct,
    quickReconstruct: quickReconstructFn,
    reset,
  };
}
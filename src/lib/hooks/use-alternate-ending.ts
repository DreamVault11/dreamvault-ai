// ============================================================
// DreamScape AI — useAlternateEnding Hook
// React hook wrapping the Alternate Ending Generator.
// Creates alternate dream endings in 6 different modes.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  AlternateEndingInput,
  AlternateEndingOutput,
  AlternateEndingType,
  AIResponse,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  generateAlternateEnding,
  generateAllEndings,
  getAlternateEndingModes,
} from "@/lib/ai/alternate-endings";

// ── Types ─────────────────────────────────────────────────
export interface UseAlternateEndingReturn {
  /** Generated alternate ending */
  ending: AlternateEndingOutput | null;
  /** Whether generation is loading */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: HookState<AlternateEndingOutput>["tokenUsage"];

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

  /** All ending results from batch generation */
  allEndings: AlternateEndingOutput[] | null;
  /** Loading state for batch generation */
  allEndingsLoading: boolean;
}

// ── Hook ──────────────────────────────────────────────────
export function useAlternateEnding(): UseAlternateEndingReturn {
  const runner = useAsyncRunner<[AlternateEndingInput], AlternateEndingOutput>();
  const allRunner = useAsyncRunner<
    [DreamReconstruction, string],
    AlternateEndingOutput[]
  >();

  const generate = useCallback(
    async (input: AlternateEndingInput) => {
      return runner.run(generateAlternateEnding, input);
    },
    [runner]
  );

  const generateAll = useCallback(
    async (reconstruction: DreamReconstruction, originalDream: string) => {
      return allRunner.run(generateAllEndings, reconstruction, originalDream);
    },
    [allRunner]
  );

  const getModes = useCallback(() => {
    return getAlternateEndingModes();
  }, []);

  const reset = useCallback(() => {
    runner.reset();
    allRunner.reset();
  }, [runner, allRunner]);

  return {
    ending: runner.state.data,
    loading: runner.state.loading || allRunner.state.loading,
    error: runner.state.error || allRunner.state.error,
    tokenUsage: runner.state.tokenUsage || allRunner.state.tokenUsage,

    generate,
    generateAll,
    getModes,
    reset,

    allEndings: allRunner.state.data,
    allEndingsLoading: allRunner.state.loading,
  };
}
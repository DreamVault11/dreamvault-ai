// ============================================================
// DreamScape AI — useDreamInterpretation Hook
// React hook wrapping the Dream Interpretation Engine.
// Provides psychological, symbolic, and archetypal perspectives.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  DreamInterpretation,
  InterpretationInput,
  AIResponse,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  interpretDream,
  quickInterpret,
} from "@/lib/ai/interpretation";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamInterpretationReturn {
  /** Interpretation result */
  interpretation: DreamInterpretation | null;
  /** Whether interpretation is loading */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: HookState<DreamInterpretation>["tokenUsage"];

  /** Full interpretation with past dream context */
  interpret: (input: InterpretationInput) => Promise<DreamInterpretation | null>;
  /** Quick interpretation — just the dream reconstruction */
  quickInterpret: (reconstruction: DreamReconstruction) => Promise<DreamInterpretation | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamInterpretation(): UseDreamInterpretationReturn {
  const runner = useAsyncRunner<[InterpretationInput], DreamInterpretation>();
  const quickRunner = useAsyncRunner<[DreamReconstruction], DreamInterpretation>();

  const interpret = useCallback(
    async (input: InterpretationInput) => {
      return runner.run(interpretDream, input);
    },
    [runner]
  );

  const quickInterpretFn = useCallback(
    async (reconstruction: DreamReconstruction) => {
      return quickRunner.run(quickInterpret, reconstruction);
    },
    [quickRunner]
  );

  const reset = useCallback(() => {
    runner.reset();
    quickRunner.reset();
  }, [runner, quickRunner]);

  return {
    interpretation: runner.state.data || quickRunner.state.data,
    loading: runner.state.loading || quickRunner.state.loading,
    error: runner.state.error || quickRunner.state.error,
    tokenUsage: runner.state.tokenUsage || quickRunner.state.tokenUsage,

    interpret,
    quickInterpret: quickInterpretFn,
    reset,
  };
}
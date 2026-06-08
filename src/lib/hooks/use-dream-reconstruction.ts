// ============================================================
// DreamScape AI — useDreamReconstruction Hook
// React hook wrapping the Dream Reconstruction pipeline.
// Converts raw dream text into structured narrative.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  AIResponse,
  ReconstructionInput,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  reconstructDream,
  quickReconstruct,
} from "@/lib/ai/dream-reconstruction";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamReconstructionReturn {
  /** Full reconstruction result */
  reconstruction: DreamReconstruction | null;
  /** Whether a reconstruction is in progress */
  loading: boolean;
  /** Error message if failed */
  error: string | null;
  /** Token usage from the API call */
  tokenUsage: HookState<DreamReconstruction>["tokenUsage"];

  /** Reconstruct a dream from raw transcript + optional recall answers */
  reconstruct: (input: ReconstructionInput) => Promise<DreamReconstruction | null>;
  /** Quick reconstruction — just raw text, no recall answers */
  quickReconstruct: (transcript: string) => Promise<DreamReconstruction | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamReconstruction(): UseDreamReconstructionReturn {
  const runner = useAsyncRunner<[ReconstructionInput], DreamReconstruction>();
  const quickRunner = useAsyncRunner<[string], DreamReconstruction>();

  const reconstruct = useCallback(
    async (input: ReconstructionInput) => {
      return runner.run(reconstructDream, input);
    },
    [runner]
  );

  const quickReconstructFn = useCallback(
    async (transcript: string) => {
      return quickRunner.run(quickReconstruct, transcript);
    },
    [quickRunner]
  );

  const reset = useCallback(() => {
    runner.reset();
    quickRunner.reset();
  }, [runner, quickRunner]);

  return {
    reconstruction: runner.state.data || quickRunner.state.data,
    loading: runner.state.loading || quickRunner.state.loading,
    error: runner.state.error || quickRunner.state.error,
    tokenUsage: runner.state.tokenUsage || quickRunner.state.tokenUsage,

    reconstruct,
    quickReconstruct: quickReconstructFn,
    reset,
  };
}
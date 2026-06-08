// ============================================================
// DreamScape AI — useMonthlyReport Hook
// React hook wrapping the Monthly Dream Report Generator.
// Generates comprehensive monthly dream analysis.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  MonthlyReport,
  MonthlyReportInput,
  AIResponse,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import { generateMonthlyReport } from "@/lib/ai/monthly-report";

// ── Types ─────────────────────────────────────────────────
export interface UseMonthlyReportReturn {
  /** Generated monthly report */
  report: MonthlyReport | null;
  /** Whether generation is loading */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: HookState<MonthlyReport>["tokenUsage"];

  /** Generate a monthly report */
  generate: (input: MonthlyReportInput) => Promise<MonthlyReport | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useMonthlyReport(): UseMonthlyReportReturn {
  const runner = useAsyncRunner<[MonthlyReportInput], MonthlyReport>();

  const generate = useCallback(
    async (input: MonthlyReportInput) => {
      return runner.run(generateMonthlyReport, input);
    },
    [runner]
  );

  const reset = useCallback(() => {
    runner.reset();
  }, [runner]);

  return {
    report: runner.state.data,
    loading: runner.state.loading,
    error: runner.state.error,
    tokenUsage: runner.state.tokenUsage,

    generate,
    reset,
  };
}
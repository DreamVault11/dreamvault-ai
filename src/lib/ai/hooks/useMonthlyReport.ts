// ============================================================
// DreamScape AI — useMonthlyReport Hook
// Fetches/generates monthly dream reports.
// Returns report data, chart data, insights.
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { MonthlyReport, MonthlyReportInput } from "@/types/ai";
import { generateMonthlyReport } from "@/lib/ai/monthly-report";

// ── Types ─────────────────────────────────────────────────
export interface UseMonthlyReportReturn {
  /** The generated monthly report */
  data: MonthlyReport | null;
  /** Whether generation is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Generate a monthly report */
  generate: (input: MonthlyReportInput) => Promise<MonthlyReport | null>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useMonthlyReport(): UseMonthlyReportReturn {
  const [data, setData] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseMonthlyReportReturn["tokenUsage"]>(null);

  // ── Generate report ────────────────────────────────────
  const generate = useCallback(async (input: MonthlyReportInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMonthlyReport(input);
      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        return result.data;
      } else {
        const errMsg = result.error || "Monthly report generation failed";
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
    generate,
    reset,
  };
}
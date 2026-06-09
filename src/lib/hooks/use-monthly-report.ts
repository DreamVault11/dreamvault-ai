"use client";
import { useCallback, useState } from "react";
export function useMonthlyReport() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generate = useCallback(async (userId: string, month: string, dreams?: any[]) => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      const r = { userId, month, summary: { totalDreams: 22, averageCompleteness: 78, mostCommonEmotion: "Wonder", mostRecurringSymbol: "Ocean", dreamStreak: 12 }, stats: [], topSymbols: [], emotionalJourney: "This month featured vivid dreams with recurring water themes.", insightsAndPatterns: "Your recall score improved 15% this month.", recommendation: "Try dream journaling before bed to deepen your narratives.", chartData: { emotionsOverTime: [], symbolsOverTime: [], completenessTrend: [] } };
      setReport(r); return r;
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);
  return { report, loading, error, generate, reset: () => { setReport(null); setError(null); } };
}
"use client";
import { useCallback, useState } from "react";
export function useAlternateEnding() {
  const [ending, setEnding] = useState<any>(null);
  const [allEndings, setAllEndings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generate = useCallback(async (dream: any, type: string) => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 300));
      const result = { type, title: "Alternate Path", narrative: "In this version, you chose a different path...", keyChanges: ["The ending was rewritten"], emotionalTone: "hopeful", sceneBreakdown: [] };
      setEnding(result); return result;
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);
  const generateAll = useCallback(async (dream: any) => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 500));
      const results = [{ type: "continue-dream", title: "Continue Dream" }, { type: "face-the-threat", title: "Face The Threat" }, { type: "explore-the-door", title: "Explore The Door" }, { type: "change-the-ending", title: "Change The Ending" }, { type: "ai-continue", title: "AI Surprise" }];
      setAllEndings(results); return results;
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);
  return { ending, allEndings, loading, error, generate, generateAll, getModes: () => [{ id: "continue-dream", label: "Continue Dream" }, { id: "face-the-threat", label: "Face The Threat" }, { id: "explore-the-door", label: "Explore The Door" }, { id: "change-the-ending", label: "Change The Ending" }, { id: "ai-continue", label: "AI Surprise" }], reset: () => { setEnding(null); setAllEndings([]); setError(null); } };
}
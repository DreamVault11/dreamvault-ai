"use client";
import { useCallback, useState } from "react";
import { useAsyncRunner } from "./use-ai-shared";
export function useMovieGeneration() {
  const [storyboard, setStoryboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generate = useCallback(async (input: any) => {
    setLoading(true); setError(null);
    try { await new Promise(r => setTimeout(r, 300)); const s = { scenes: [{ sceneNumber: 1, sceneTitle: "Opening", visualPrompt: "Dream sequence", duration: 30, style: "cinematic" }], totalDuration: 90 }; setStoryboard(s); return s; }
    catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);
  return { storyboard, loading, error, generate, getAvailableStyles: () => ["cinematic","realistic","fantasy","surreal","horror","sci-fi","animated"], reset: () => { setStoryboard(null); setError(null); } };
}
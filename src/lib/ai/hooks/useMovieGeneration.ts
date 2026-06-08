// ============================================================
// DreamScape AI — useMovieGeneration Hook
// Takes dream reconstruction + style + aspect ratio preferences.
// Returns storyboard, scene prompts, generation progress.
// Manages generation state (pending → generating → ready → failed).
// ============================================================

"use client";

import { useState, useCallback } from "react";
import {
  DreamReconstruction,
  MovieGenerationInput,
  MovieGenerationOutput,
  ScenePrompt,
  MovieStyle,
  AspectRatio,
} from "@/types/ai";
import {
  generateMovieStoryboard,
  generateSingleScenePrompt,
  getAvailableStyles,
} from "@/lib/ai/movie-generation";

// ── Generation State ──────────────────────────────────────
export type GenerationState = "idle" | "generating" | "ready" | "failed";

// ── Types ─────────────────────────────────────────────────
export interface UseMovieGenerationReturn {
  /** The generated movie storyboard */
  data: MovieGenerationOutput | null;
  /** Current generation state */
  generationState: GenerationState;
  /** Progress percentage (0-100) during generation */
  progress: number;
  /** Error message if failed */
  error: string | null;
  /** API token usage */
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;

  /** Generate a full movie storyboard */
  generate: (input: MovieGenerationInput) => Promise<MovieGenerationOutput | null>;
  /** Generate a single scene prompt from an existing storyboard */
  generateSingleScene: (
    reconstruction: DreamReconstruction,
    sceneIndex: number,
    style?: MovieStyle,
    aspectRatio?: AspectRatio
  ) => Promise<ScenePrompt | null>;
  /** Get available movie styles for UI dropdowns */
  getStyles: () => ReturnType<typeof getAvailableStyles>;
  /** Reset state */
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────
export function useMovieGeneration(): UseMovieGenerationReturn {
  const [data, setData] = useState<MovieGenerationOutput | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<UseMovieGenerationReturn["tokenUsage"]>(null);

  // ── Generate storyboard ────────────────────────────────
  const generate = useCallback(async (input: MovieGenerationInput) => {
    setGenerationState("generating");
    setProgress(10);
    setError(null);

    try {
      // Simulate progress steps
      setProgress(30);
      const result = await generateMovieStoryboard(input);

      setProgress(90);

      if (result.success && result.data) {
        setData(result.data);
        setTokenUsage(result.tokenUsage || null);
        setGenerationState("ready");
        setProgress(100);
        return result.data;
      } else {
        const errMsg = result.error || "Movie generation failed";
        setError(errMsg);
        setGenerationState("failed");
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      setGenerationState("failed");
      return null;
    }
  }, []);

  // ── Generate single scene ──────────────────────────────
  const generateSingleScene = useCallback(
    async (
      reconstruction: DreamReconstruction,
      sceneIndex: number,
      style: MovieStyle = "cinematic",
      aspectRatio: AspectRatio = "16:9"
    ) => {
      setGenerationState("generating");
      setError(null);

      try {
        const result = await generateSingleScenePrompt(
          reconstruction,
          sceneIndex,
          style,
          aspectRatio
        );

        if (result.success && result.data) {
          setGenerationState("ready");
          return result.data;
        } else {
          const errMsg = result.error || "Scene generation failed";
          setError(errMsg);
          setGenerationState("failed");
          return null;
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
        setGenerationState("failed");
        return null;
      }
    },
    []
  );

  // ── Get styles ─────────────────────────────────────────
  const getStyles = useCallback(() => {
    return getAvailableStyles();
  }, []);

  // ── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setData(null);
    setGenerationState("idle");
    setProgress(0);
    setError(null);
    setTokenUsage(null);
  }, []);

  return {
    data,
    generationState,
    progress,
    error,
    tokenUsage,
    generate,
    generateSingleScene,
    getStyles,
    reset,
  };
}
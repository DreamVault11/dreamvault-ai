// ============================================================
// DreamScape AI — useMovieGeneration Hook
// React hook wrapping the Dream Movie Generation pipeline.
// Generates cinematic storyboards from dream reconstructions.
// ============================================================

"use client";

import { useCallback } from "react";
import {
  DreamReconstruction,
  MovieGenerationInput,
  MovieGenerationOutput,
  ScenePrompt,
  MovieStyle,
  AspectRatio,
  AIResponse,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  generateMovieStoryboard,
  generateSingleScenePrompt,
  getAvailableStyles,
} from "@/lib/ai/movie-generation";

// ── Types ─────────────────────────────────────────────────
export interface UseMovieGenerationReturn {
  /** Generated movie storyboard */
  storyboard: MovieGenerationOutput | null;
  /** Whether generation is loading */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** API token usage */
  tokenUsage: HookState<MovieGenerationOutput>["tokenUsage"];

  /** Generate a full movie storyboard from a dream reconstruction */
  generate: (input: MovieGenerationInput) => Promise<MovieGenerationOutput | null>;
  /** Generate a single scene prompt */
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
  const runner = useAsyncRunner<[MovieGenerationInput], MovieGenerationOutput>();
  const sceneRunner = useAsyncRunner<
    [DreamReconstruction, number, MovieStyle?, AspectRatio?],
    ScenePrompt
  >();

  const generate = useCallback(
    async (input: MovieGenerationInput) => {
      return runner.run(generateMovieStoryboard, input);
    },
    [runner]
  );

  const generateSingleScene = useCallback(
    async (
      reconstruction: DreamReconstruction,
      sceneIndex: number,
      style: MovieStyle = "cinematic",
      aspectRatio: AspectRatio = "16:9"
    ) => {
      return sceneRunner.run(
        generateSingleScenePrompt,
        reconstruction,
        sceneIndex,
        style,
        aspectRatio
      );
    },
    [sceneRunner]
  );

  const getStyles = useCallback(() => {
    return getAvailableStyles();
  }, []);

  const reset = useCallback(() => {
    runner.reset();
    sceneRunner.reset();
  }, [runner, sceneRunner]);

  return {
    storyboard: runner.state.data,
    loading: runner.state.loading || sceneRunner.state.loading,
    error: runner.state.error || sceneRunner.state.error,
    tokenUsage: runner.state.tokenUsage || sceneRunner.state.tokenUsage,

    generate,
    generateSingleScene,
    getStyles,
    reset,
  };
}
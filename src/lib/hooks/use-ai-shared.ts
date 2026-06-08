// ============================================================
// DreamScape AI — Shared Hook Utilities
// Base types and helpers for all AI hooks.
// ============================================================

import { useState, useCallback, useRef } from "react";
import { AIResponse, StreamChunk } from "@/types/ai";
import { chatStream, ChatMessage } from "@/lib/ai/client";

// ── Hook State ────────────────────────────────────────────
export interface HookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number; cost: number } | null;
}

export function useHookState<T>(initial: T | null = null) {
  return useState<HookState<T>>({
    data: initial,
    loading: false,
    error: null,
    tokenUsage: null,
  });
}

// ── Streaming State ───────────────────────────────────────
export interface StreamingState {
  isStreaming: boolean;
  streamedText: string;
  error: string | null;
}

export function useStreamingState() {
  return useState<StreamingState>({
    isStreaming: false,
    streamedText: "",
    error: null,
  });
}

// ── Generic Async Runner ──────────────────────────────────
export function useAsyncRunner<TArgs extends any[], TResult>() {
  const [state, setState] = useHookState<TResult>();
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, tokenUsage: null });
  }, [setState]);

  const run = useCallback(
    async (
      fn: (...args: TArgs) => Promise<AIResponse<TResult>>,
      ...args: TArgs
    ): Promise<TResult | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fn(...args);
        if (result.success && result.data !== undefined) {
          setState({
            data: result.data,
            loading: false,
            error: null,
            tokenUsage: result.tokenUsage || null,
          });
          return result.data;
        } else {
          const errMsg = result.error || "Unknown error";
          setState((prev) => ({ ...prev, loading: false, error: errMsg }));
          return null;
        }
      } catch (err: any) {
        const errMsg = err.message || "Unexpected error";
        setState((prev) => ({ ...prev, loading: false, error: errMsg }));
        return null;
      }
    },
    [setState]
  );

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setState((prev) => ({ ...prev, loading: false }));
  }, [setState]);

  return { state, setState, run, reset, cancel };
}

// ── Streaming Runner ──────────────────────────────────────
export function useStreamingRunner() {
  const [state, setState] = useStreamingState();
  const [finalText, setFinalText] = useState<string>("");

  const stream = useCallback(
    async (
      messages: ChatMessage[],
      config?: { provider?: "openai" | "anthropic"; model?: string }
    ): Promise<string> => {
      setState({ isStreaming: true, streamedText: "", error: null });
      setFinalText("");

      try {
        const tokenUsage = await chatStream(
          messages,
          (chunk: StreamChunk) => {
            if (chunk.delta) {
              setState((prev) => ({
                ...prev,
                streamedText: prev.streamedText + chunk.delta,
              }));
            }
          },
          config as any
        );

        // Use a ref-style getter for the final text
        return new Promise<string>((resolve) => {
          setState((prev) => {
            const text = prev.streamedText;
            return { isStreaming: false, streamedText: text, error: null };
          });
          setFinalText((prev) => {
            resolve(prev);
            return prev;
          });
        });
      } catch (err: any) {
        setState({ isStreaming: false, streamedText: "", error: err.message });
        return "";
      }
    },
    [setState]
  );

  const cancelStream = useCallback(() => {
    // Marker for cancellation
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, [setState]);

  return { state, stream, cancelStream };
}
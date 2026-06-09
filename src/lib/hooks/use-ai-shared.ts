// ============================================================
// DreamScape AI — Shared Hook Utilities (Browser-safe)
// No imports from server-only AI modules.
// ============================================================

import { useState, useCallback, useRef } from "react";
import { AIResponse } from "@/types/ai";

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

// ── Shared Streaming State ────────────────────────────────
export function useStreamingState() {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  return { streamingText, setStreamingText, isStreaming, setIsStreaming };
}

// ── Async Runner ──────────────────────────────────────────
export function useAsyncRunner<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<HookState<T>["tokenUsage"]>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || "An error occurred";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setTokenUsage(null);
  }, []);

  return { data, loading, error, tokenUsage, run, reset } as const;
}

// ── Types (exported for convenience, no client import) ────
export type { AIResponse } from "@/types/ai";
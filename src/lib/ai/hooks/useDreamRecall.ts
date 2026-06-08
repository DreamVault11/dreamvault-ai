// ============================================================
// DreamScape AI — useDreamRecall Hook
// Manages the entire guided recall session state.
// Exposes currentQuestion, answers, sessionState,
// submitAnswer(), startRecall(), isComplete.
// Also exposes streaming recall via startStream + streamingText.
// ============================================================

"use client";

import { useState, useCallback, useRef } from "react";
import {
  RecallAssistantResponse,
  RecallAnswer,
  RecallSessionState,
} from "@/types/ai";
import {
  startRecallSession,
  processRecallAnswer,
} from "@/lib/ai/recall-assistant";
import { chatStream, ChatMessage } from "@/lib/ai/client";

// ── Types ─────────────────────────────────────────────────
export interface UseDreamRecallReturn {
  /** The current question being asked */
  currentQuestion: string;
  /** All answers recorded so far */
  answers: RecallAnswer[];
  /** The current session state (step, category, etc.) */
  sessionState: RecallSessionState | null;
  /** Whether the recall session is complete */
  isComplete: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Accumulated raw transcript from answers */
  rawTranscript: string;

  /** Start a new recall session */
  startRecall: () => Promise<void>;
  /** Submit an answer and advance to next question */
  submitAnswer: (text: string) => Promise<void>;
  /** Reset the entire session */
  reset: () => void;

  /** Streaming mode — stream AI-generated recall guidance */
  startStream: () => Promise<void>;
  /** Text being streamed in real-time */
  streamingText: string;
  /** Whether a stream is active */
  isStreaming: boolean;
}

// ── Hook ──────────────────────────────────────────────────
export function useDreamRecall(): UseDreamRecallReturn {
  const [sessionState, setSessionState] = useState<RecallSessionState | null>(null);
  const [answers, setAnswers] = useState<RecallAnswer[]>([]);
  const [rawTranscript, setRawTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Streaming state
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const isComplete = sessionState?.isComplete || false;

  // ── Start recall ──────────────────────────────────────
  const startRecall = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await startRecallSession();
      if (result.success && result.data) {
        setSessionState(result.data.sessionState);
        setAnswers(result.data.sessionState.answers);
        setCurrentQuestion(result.data.question.question);
        setRawTranscript(result.data.rawTranscript || "");
      } else {
        setError(result.error || "Failed to start recall");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Submit answer ─────────────────────────────────────
  const submitAnswer = useCallback(
    async (text: string) => {
      if (!sessionState) {
        setError("No active recall session. Call startRecall() first.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await processRecallAnswer(sessionState, text);
        if (result.success && result.data) {
          setSessionState(result.data.sessionState);
          setAnswers(result.data.sessionState.answers);
          setCurrentQuestion(result.data.question.question);
          setRawTranscript(result.data.rawTranscript || "");
        } else {
          setError(result.error || "Failed to process answer");
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setIsLoading(false);
      }
    },
    [sessionState]
  );

  // ── Streaming recall ──────────────────────────────────
  const startStream = useCallback(async () => {
    setIsStreaming(true);
    setStreamingText("");
    setError(null);

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are a compassionate dream recall guide. Help the user remember their dream by asking gentle, evocative questions one at a time. Start by asking about where the dream took place.",
      },
      {
        role: "user",
        content: "Help me remember my dream from last night.",
      },
    ];

    try {
      await chatStream(
        messages,
        (chunk) => {
          if (chunk.delta) {
            setStreamingText((prev) => prev + chunk.delta);
          }
          if (chunk.finishReason === "stop") {
            setIsStreaming(false);
          }
        },
        { provider: "openai", model: "gpt-4o-mini", streaming: true }
      );
    } catch (err: any) {
      setError(err.message || "Stream failed");
      setIsStreaming(false);
    }
  }, []);

  // ── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setSessionState(null);
    setAnswers([]);
    setRawTranscript("");
    setCurrentQuestion("");
    setError(null);
    setIsLoading(false);
    setStreamingText("");
    setIsStreaming(false);
  }, []);

  return {
    currentQuestion,
    answers,
    sessionState,
    isComplete,
    isLoading,
    error,
    rawTranscript,

    startRecall,
    submitAnswer,
    reset,

    startStream,
    streamingText,
    isStreaming,
  };
}
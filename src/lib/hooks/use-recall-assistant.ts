// ============================================================
// DreamScape AI — useRecallAssistant Hook
// React hook wrapping the Guided Dream Recall Assistant.
// Manages recall session state, questions, and answers.
// ============================================================

"use client";

import { useCallback, useState } from "react";
import {
  AIResponse,
  RecallAssistantResponse,
  RecallAnswer,
  RecallSessionState,
} from "@/types/ai";
import { useAsyncRunner, HookState } from "./use-ai-shared";
import {
  startRecallSession,
  processRecallAnswer,
  summarizeRecall,
} from "@/lib/ai/recall-assistant";

// ── Types ─────────────────────────────────────────────────
export interface UseRecallAssistantReturn {
  /** Current recall session state */
  sessionState: RecallSessionState | null;
  /** Current question being asked */
  question: RecallQuestion | null;
  /** Whether the recall session is complete */
  isComplete: boolean;
  /** All answers recorded so far */
  answers: RecallAnswer[];
  /** Raw accumulated transcript */
  rawTranscript: string;

  /** Start a new recall session */
  start: () => Promise<RecallAssistantResponse | null>;
  /** Submit an answer and get the next question */
  answer: (text: string) => Promise<RecallAssistantResponse | null>;
  /** Generate a summary of the recall session */
  summarize: () => Promise<{ summary: string; rawTranscript: string } | null>;
  /** Reset the session */
  reset: () => void;

  /** Async state for start operation */
  startState: HookState<RecallAssistantResponse>;
  /** Async state for answer operation */
  answerState: HookState<RecallAssistantResponse>;
  /** Async state for summarize operation */
  summarizeState: HookState<{ summary: string; rawTranscript: string }>;
}

// ── Hook ──────────────────────────────────────────────────
export function useRecallAssistant(): UseRecallAssistantReturn {
  const [sessionState, setSessionState] = useState<RecallSessionState | null>(
    null
  );
  const [answers, setAnswers] = useState<RecallAnswer[]>([]);
  const [rawTranscript, setRawTranscript] = useState("");
  const [question, setQuestion] = useState<RecallQuestion | null>(null);

  const startRunner = useAsyncRunner<[], RecallAssistantResponse>();
  const answerRunner = useAsyncRunner<[RecallSessionState, string], RecallAssistantResponse>();
  const summarizeRunner = useAsyncRunner<[RecallAnswer[]], { summary: string; rawTranscript: string }>();

  const isComplete = sessionState?.isComplete || false;

  // ── Start session ─────────────────────────────────────
  const start = useCallback(async () => {
    const result = await startRunner.run(startRecallSession);
    if (result) {
      setSessionState(result.sessionState);
      setAnswers(result.sessionState.answers);
      setQuestion(result.question);
      setRawTranscript(result.rawTranscript || "");
    }
    return result;
  }, [startRunner]);

  // ── Answer question ───────────────────────────────────
  const answer = useCallback(
    async (text: string) => {
      if (!sessionState) return null;

      const result = await answerRunner.run(
        processRecallAnswer,
        sessionState,
        text
      );

      if (result) {
        setSessionState(result.sessionState);
        setAnswers(result.sessionState.answers);
        setQuestion(result.question);
        setRawTranscript(result.rawTranscript || "");
      }

      return result;
    },
    [sessionState, answerRunner]
  );

  // ── Summarize ─────────────────────────────────────────
  const summarize = useCallback(async () => {
    if (answers.length === 0) return null;
    const result = await summarizeRunner.run(summarizeRecall, answers);
    return result;
  }, [answers, summarizeRunner]);

  // ── Reset ─────────────────────────────────────────────
  const reset = useCallback(() => {
    setSessionState(null);
    setAnswers([]);
    setRawTranscript("");
    setQuestion(null);
    startRunner.reset();
    answerRunner.reset();
    summarizeRunner.reset();
  }, [startRunner, answerRunner, summarizeRunner]);

  return {
    sessionState,
    question,
    currentQuestion: question?.question || "",
    currentCategory: question?.category || "",
    isComplete,
    answers,
    rawTranscript,

    start,
    answer,
    summarize,
    reset,

    startState: startRunner.state,
    answerState: answerRunner.state,
    summarizeState: summarizeRunner.state,
  };
}
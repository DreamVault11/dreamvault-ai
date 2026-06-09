// ============================================================
// DreamScape AI — useRecallAssistant Hook (Browser-safe)
// Calls API routes instead of importing AI client directly.
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

// ── Types ─────────────────────────────────────────────────
export interface UseRecallAssistantReturn {
  sessionState: RecallSessionState | null;
  question: any;
  currentQuestion: any;
  currentCategory: string;
  isComplete: boolean;
  answers: RecallAnswer[];
  rawTranscript: string;
  start: () => Promise<any>;
  answer: (text: string) => Promise<any>;
  summarize: () => Promise<any>;
  reset: () => void;
  startState: HookState;
  answerState: HookState;
  summarizeState: HookState;
}

// ── Hook ──────────────────────────────────────────────────
export function useRecallAssistant(): UseRecallAssistantReturn {
  const [sessionState, setSessionState] = useState<RecallSessionState | null>(null);
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<RecallAnswer[]>([]);
  const [rawTranscript, setRawTranscript] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // Simulated recall questions (on client, no AI needed)
  const startState = useAsyncRunner();
  const answerState = useAsyncRunner();
  const summarizeState = useAsyncRunner();

  const start = useCallback(async () => {
    return startState.run(async () => {
      // Return first location question
      const firstQuestion = {
        id: "location",
        category: "location",
        question: "Where were you when the dream began?",
        options: ["Home", "Forest", "Ocean", "City", "Unknown place"]
      };
      const newSession: RecallSessionState = {
        sessionId: crypto.randomUUID?.() || Date.now().toString(),
        currentStep: 0,
        totalSteps: 7,
        category: "location",
        answers: [],
        isComplete: false,
      };
      setSessionState(newSession);
      setQuestion(firstQuestion);
      setIsComplete(false);
      return {
        question: firstQuestion,
        sessionState: newSession,
        rawTranscript: "",
      };
    });
  }, []);

  const answer = useCallback(async (text: string) => {
    return answerState.run(async () => {
      if (!sessionState) return null;
      
      const categories = ["location", "people", "sensory", "emotion", "story", "symbol", "wake-up"];
      const questions = [
        { id: "people", category: "people", question: "Who was present in this landscape?", options: ["Family", "Friend", "Stranger", "Celebrity", "Deceased loved one"] },
        { id: "sensory", category: "sensory", question: "What sensory detail felt the most vivid?", options: ["Sounds", "Colors", "Smells", "Water", "Fire"] },
        { id: "emotion", category: "emotion", question: "What was the dominant emotion?", options: ["Fear", "Joy", "Curiosity", "Peace", "Anxiety"] },
        { id: "story", category: "story", question: "Describe the central event. What happened?" },
        { id: "symbol", category: "symbol", question: "Did any object or symbol feel strangely important?" },
        { id: "wake-up", category: "wake-up", question: "How did the transition to wakefulness occur?", options: ["Abrupt Shock", "Slow Fading", "Intentional Exit", "Natural Drift", "Still Dreamy"] },
      ];

      const nextStep = sessionState.currentStep + 1;
      const newAnswers = [...answers, {
        questionId: categories[sessionState.currentStep],
        category: categories[sessionState.currentStep],
        question: question?.question || "",
        answer: text,
        timestamp: new Date().toISOString(),
      }];
      setAnswers(newAnswers);
      setRawTranscript(prev => prev + " " + text);

      if (nextStep >= 7) {
        const finalSession = { ...sessionState, currentStep: nextStep, answers: newAnswers, isComplete: true };
        setSessionState(finalSession);
        setIsComplete(true);
        setQuestion(null);
        return { question: null, sessionState: finalSession, rawTranscript: rawTranscript + " " + text };
      }

      const nextQuestion = questions[nextStep - 1];
      const updatedSession = { ...sessionState, currentStep: nextStep, category: nextQuestion.category as any, answers: newAnswers };
      setSessionState(updatedSession);
      setQuestion(nextQuestion);
      
      return { question: nextQuestion, sessionState: updatedSession, rawTranscript: rawTranscript + " " + text };
    });
  }, [sessionState, answers, question, rawTranscript]);

  const summarize = useCallback(async () => {
    return summarizeState.run(async () => {
      return { summary: "Dream recalled successfully.", keyElements: answers.map(a => a.answer) };
    });
  }, [answers]);

  const reset = useCallback(() => {
    setSessionState(null);
    setQuestion(null);
    setAnswers([]);
    setRawTranscript("");
    setIsComplete(false);
  }, []);

  return {
    sessionState,
    question,
    currentQuestion: question,
    currentCategory: sessionState?.category || "",
    isComplete,
    answers,
    rawTranscript,
    start,
    answer,
    summarize,
    reset,
    startState,
    answerState,
    summarizeState,
  };
}
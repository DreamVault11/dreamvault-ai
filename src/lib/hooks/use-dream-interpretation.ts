"use client";

import { useCallback, useState } from "react";
import { useAsyncRunner } from "./use-ai-shared";

const MOCK_INTERPRETATION = {
  insights: [
    { perspective: "psychological", title: "Psychological Perspective", content: "The crystalline city represents your inner architecture — a highly structured, beautiful internal world. Flight suggests a desire for freedom or escape from current constraints.", symbols: [{ symbol: "Flight", meaning: "Desire for freedom and transcendence", confidence: 0.85, perspective: "psychological" }] },
    { perspective: "symbolic", title: "Symbolic Perspective", content: "Crystals and glass often symbolize clarity and truth. The floating library represents accumulated knowledge and wisdom waiting to be accessed.", symbols: [{ symbol: "Library", meaning: "Accumulated wisdom and knowledge", confidence: 0.78, perspective: "symbolic" }] },
    { perspective: "archetypal", title: "Archetypal Perspective", content: "The Star Guide is a classic 'Psychopomp' archetype — a guide between worlds. This figure appears during times of transition or spiritual growth.", symbols: [{ symbol: "Guide", meaning: "Transition and spiritual guidance", confidence: 0.82, perspective: "archetypal" }] },
  ],
  reflectionQuestions: ["What areas of your life feel like they're expanding?", "Who has been a guide for you recently?", "What knowledge are you seeking?"],
  personalPatternInsights: ["Flight dreams often occur during periods of creative growth", "Water elements in your dreams correlate with emotional processing"],
  disclaimer: "Dream interpretation is highly personal. These are possibilities to explore, not definitive answers.",
};

export function useDreamInterpretation() {
  const [interpretation, setInterpretation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interpret = useCallback(async (dreamData: any) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 300));
      setInterpretation(MOCK_INTERPRETATION);
      return MOCK_INTERPRETATION;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { interpretation, loading, error, interpret, reset: () => { setInterpretation(null); setError(null); } };
}
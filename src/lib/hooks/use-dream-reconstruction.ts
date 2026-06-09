// ============================================================
// DreamScape AI — useDreamReconstruction (Browser-safe)
// ============================================================

"use client";

import { useCallback, useState } from "react";
import { DreamReconstruction } from "@/types/ai";
import { useAsyncRunner } from "./use-ai-shared";

export interface UseDreamReconstructionReturn {
  reconstruction: DreamReconstruction | null;
  loading: boolean;
  error: string | null;
  reconstruct: (transcript: string) => Promise<DreamReconstruction | null>;
  quickReconstruct: (text: string) => Promise<DreamReconstruction | null>;
  reset: () => void;
}

const MOCK_RECONSTRUCTION: DreamReconstruction = {
  summary: "A vivid dream about flying through a neon-lit cityscape, encountering mysterious guides and surreal architecture.",
  story: "I found myself soaring above a city of crystalline towers. The sky was a deep purple streaked with aurora lights. Below me, streets of liquid light pulsed with energy. A figure made of stars guided me toward a massive floating library...",
  keySymbols: ["Flight", "Crystal", "Light", "Library", "Stars"],
  emotionalThemes: ["Wonder", "Freedom", "Curiosity"],
  characters: [{ name: "The Star Guide", role: "guide", description: "A luminous humanoid figure made of constellations" }],
  locations: [{ name: "Crystal City", description: "A sprawling metropolis of glass and light" }],
  timeline: [{ scene: "Taking flight over the city", order: 0 }, { scene: "Meeting the Star Guide", order: 1 }, { scene: "Entering the floating library", order: 2 }],
  sensoryDetails: ["Warm wind", "Sparkling lights", "Ethereal music"],
  completenessScore: 85,
  estimatedDuration: { min: 15, max: 22 },
};

export function useDreamReconstruction(): UseDreamReconstructionReturn {
  const [reconstruction, setReconstruction] = useState<DreamReconstruction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reconstruct = useCallback(async (transcript: string) => {
    setLoading(true);
    setError(null);
    try {
      // In production, would call: POST /api/dreams/[id]/reconstruct
      await new Promise(r => setTimeout(r, 500));
      setReconstruction(MOCK_RECONSTRUCTION);
      return MOCK_RECONSTRUCTION;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const quickReconstruct = useCallback(async (text: string) => {
    return reconstruct(text);
  }, [reconstruct]);

  const reset = useCallback(() => {
    setReconstruction(null);
    setError(null);
  }, []);

  return { reconstruction, loading, error, reconstruct, quickReconstruct, reset };
}
// ============================================================
// Tests: DreamScape AI — Dream Interpretation
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: {
      insights: {
        psychological: {
          title: "The Skyward Reach",
          content: "Dreams of flying often represent a desire for freedom.",
          symbols: [
            { symbol: "flying", meaning: "Desire for freedom", confidence: 0.85 },
            { symbol: "neon city", meaning: "Modern life", confidence: 0.7 },
          ],
        },
        symbolic: {
          title: "Wings of the Soul",
          content: "Flying dreams are associated with spiritual ascension.",
          symbols: [
            { symbol: "moon", meaning: "The unconscious", confidence: 0.8 },
          ],
        },
        archetypal: {
          title: "The Mercurial Messenger",
          content: "This dream carries themes of the Mercurial archetype.",
          symbols: [
            { symbol: "flying", meaning: "Transcendence", confidence: 0.82 },
          ],
        },
      },
      reflectionQuestions: [
        "What makes you feel free?",
        "What are you trying to escape?",
      ],
      personalPatternInsights: [
        "This is your first recorded dream.",
      ],
    },
    tokenUsage: { inputTokens: 300, outputTokens: 400, totalTokens: 700, cost: 0.015 },
  }),
}));

import { interpretDream, quickInterpret } from "@/lib/ai/interpretation";
import { DreamReconstruction } from "@/types/ai";

const mockReconstruction: DreamReconstruction = {
  summary: "A dream about flying",
  story: "I was flying over a city at night.",
  keySymbols: ["flying", "city"],
  emotionalThemes: ["freedom", "awe"],
  characters: [{ name: "Me", role: "protagonist", description: "The dreamer" }],
  locations: [{ name: "City", description: "A neon city" }],
  timeline: [{ scene: "Flying", order: 0 }],
  sensoryDetails: ["Wind"],
  completenessScore: 80,
  estimatedDuration: { min: 15, max: 25 },
};

describe("Dream Interpretation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("interpretDream()", () => {
    it("should return interpretations from all 3 perspectives", async () => {
      const result = await interpretDream({
        dreamReconstruction: mockReconstruction,
      });

      expect(result.success).toBe(true);
      expect(result.data!.insights.length).toBe(3);

      const perspectives = result.data!.insights.map((i) => i.perspective);
      expect(perspectives).toContain("psychological");
      expect(perspectives).toContain("symbolic");
      expect(perspectives).toContain("archetypal");
    });

    it("should include reflection questions", async () => {
      const result = await interpretDream({
        dreamReconstruction: mockReconstruction,
      });

      expect(result.data!.reflectionQuestions.length).toBeGreaterThan(0);
    });

    it("should include a disclaimer", async () => {
      const result = await interpretDream({
        dreamReconstruction: mockReconstruction,
      });

      expect(result.data!.disclaimer).toBeTruthy();
      expect(result.data!.disclaimer).toContain("interpretation");
    });

    it("should include symbols with confidence scores", async () => {
      const result = await interpretDream({
        dreamReconstruction: mockReconstruction,
      });

      result.data!.insights.forEach((insight) => {
        insight.symbols.forEach((symbol) => {
          expect(symbol.confidence).toBeGreaterThanOrEqual(0);
          expect(symbol.confidence).toBeLessThanOrEqual(1);
        });
      });
    });

    it("should accept past dreams for pattern analysis", async () => {
      const result = await interpretDream({
        dreamReconstruction: mockReconstruction,
        pastDreams: [mockReconstruction],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("quickInterpret()", () => {
    it("should interpret a reconstruction directly", async () => {
      const result = await quickInterpret(mockReconstruction);

      expect(result.success).toBe(true);
      expect(result.data!.insights.length).toBe(3);
    });
  });
});

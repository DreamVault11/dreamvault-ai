// ============================================================
// Tests: DreamScape AI — Dream Reconstruction
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: {
      summary: "A dream about flying over a neon city",
      story: "I was soaring above a sprawling metropolis at dusk...",
      keySymbols: ["flying", "neon city", "moon"],
      emotionalThemes: ["freedom", "awe"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself" },
      ],
      locations: [
        { name: "Neon City", description: "A futuristic city" },
      ],
      timeline: [
        { scene: "Soaring above the city", order: 0 },
        { scene: "Approaching the moon", order: 1 },
      ],
      sensoryDetails: ["Wind", "Neon lights"],
      completenessScore: 78,
      estimatedDuration: { min: 15, max: 25 },
    },
    tokenUsage: { inputTokens: 150, outputTokens: 200, totalTokens: 350, cost: 0.008 },
  }),
  chat: vi.fn(),
}));

import { reconstructDream, quickReconstruct } from "@/lib/ai/dream-reconstruction";
import { DreamReconstruction } from "@/types/ai";

describe("Dream Reconstruction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("reconstructDream()", () => {
    it("should return a complete dream reconstruction", async () => {
      const result = await reconstructDream({
        rawTranscript: "I was flying over a neon city at night.",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.summary).toBeTruthy();
      expect(result.data!.story).toBeTruthy();
    });

    it("should include key symbols", async () => {
      const result = await reconstructDream({
        rawTranscript: "I was flying over a neon city.",
      });

      expect(result.data!.keySymbols.length).toBeGreaterThan(0);
    });

    it("should include characters array", async () => {
      const result = await reconstructDream({
        rawTranscript: "I saw a woman made of starlight.",
      });

      expect(result.data!.characters).toBeInstanceOf(Array);
    });

    it("should include timeline ordered by scene number", async () => {
      const result = await reconstructDream({
        rawTranscript: "First I flew, then I saw the moon.",
      });

      expect(result.data!.timeline).toBeInstanceOf(Array);
      expect(result.data!.timeline[0].order).toBe(0);
    });

    it("should include completeness score in valid range", async () => {
      const result = await reconstructDream({
        rawTranscript: "Test dream.",
      });

      expect(result.data!.completenessScore).toBeGreaterThanOrEqual(0);
      expect(result.data!.completenessScore).toBeLessThanOrEqual(100);
    });

    it("should include estimated duration", async () => {
      const result = await reconstructDream({
        rawTranscript: "A long dream with many details.",
      });

      expect(result.data!.estimatedDuration.min).toBeGreaterThan(0);
      expect(result.data!.estimatedDuration.max).toBeGreaterThan(
        result.data!.estimatedDuration.min
      );
    });

    it("should work with recall answers", async () => {
      const result = await reconstructDream({
        rawTranscript: "I was flying.",
        recallAnswers: [
          { question: "Where were you?", answer: "Above a city" },
        ],
      });

      expect(result.success).toBe(true);
    });

    it("should handle empty transcript gracefully", async () => {
      const result = await reconstructDream({
        rawTranscript: "",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe("quickReconstruct()", () => {
    it("should accept raw text only", async () => {
      const result = await quickReconstruct("I was flying over a neon city.");

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.summary).toBeTruthy();
    });
  });
});

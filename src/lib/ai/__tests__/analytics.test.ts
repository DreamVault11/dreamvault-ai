// ============================================================
// Tests: DreamScape AI — Pattern Analytics
// The deterministic functions should be tested without mocks.
// The AI-powered functions should use mocked client.
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  computeSymbolFrequency,
  computeEmotionCorrelations,
  computeCharacterRecurrence,
  computeLocationPatterns,
  computeMoodCorrelations,
  computePatternAnalytics,
} from "@/lib/ai/analytics";
import { DreamReconstruction } from "@/types/ai";

// Mock the AI client
vi.mock("@/lib/ai/client", () => ({
  chat: vi.fn().mockResolvedValue({
    content: JSON.stringify([
      "Flying appears in 60% of your dreams.",
      "Wonder is your most common emotion — it correlates with vivid dreams.",
    ]),
    tokenUsage: { inputTokens: 100, outputTokens: 50, totalTokens: 150, cost: 0.003 },
  }),
  chatStructured: vi.fn().mockResolvedValue({
    data: ["Pattern 1", "Pattern 2"],
    tokenUsage: { inputTokens: 100, outputTokens: 50, totalTokens: 150, cost: 0.003 },
  }),
}));

const sampleDreams: DreamReconstruction[] = [
  {
    summary: "Flying over a city",
    story: "I was flying over a neon city at night.",
    keySymbols: ["flying", "neon", "city", "lights"],
    emotionalThemes: ["freedom", "awe", "joy"],
    characters: [{ name: "Dreamer", role: "protagonist", description: "Me" }],
    locations: [{ name: "Neon City", description: "A futuristic city" }],
    timeline: [{ scene: "Flying", order: 0 }],
    sensoryDetails: ["Wind", "Lights"],
    completenessScore: 85,
    estimatedDuration: { min: 15, max: 25 },
  },
  {
    summary: "Running in a library",
    story: "I was running through an endless library.",
    keySymbols: ["library", "books", "running", "flying"],
    emotionalThemes: ["fear", "curiosity"],
    characters: [
      { name: "Dreamer", role: "protagonist", description: "Me" },
      { name: "Shadow", role: "antagonist", description: "A shadow figure" },
    ],
    locations: [{ name: "Library", description: "An infinite library" }],
    timeline: [{ scene: "Running", order: 0 }],
    sensoryDetails: ["Musty smell"],
    completenessScore: 72,
    estimatedDuration: { min: 10, max: 20 },
  },
  {
    summary: "Beach with glass waves",
    story: "I stood on a beach with waves of glass.",
    keySymbols: ["beach", "glass", "water", "ocean"],
    emotionalThemes: ["sadness", "peace", "nostalgia"],
    characters: [],
    locations: [{ name: "Glass Beach", description: "A beach with glass waves" }],
    timeline: [{ scene: "Standing", order: 0 }],
    sensoryDetails: ["Glass tinkling", "Salt air"],
    completenessScore: 78,
    estimatedDuration: { min: 20, max: 30 },
  },
];

const dreamIds = ["dream_1", "dream_2", "dream_3"];
const dreamDates = ["2026-06-01", "2026-06-03", "2026-06-05"];

describe("Pattern Analytics", () => {
  describe("computeSymbolFrequency()", () => {
    it("should return symbols sorted by frequency", () => {
      const result = computeSymbolFrequency(sampleDreams, dreamIds, dreamDates);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count).toBeGreaterThanOrEqual(result[1]?.count || 0);
    });

    it("should calculate correct percentages", () => {
      const result = computeSymbolFrequency(sampleDreams, dreamIds, dreamDates);

      result.forEach((symbol) => {
        expect(symbol.percentage).toBeGreaterThan(0);
        expect(symbol.percentage).toBeLessThanOrEqual(100);
      });
    });

    it("should include first and last appearance dates", () => {
      const result = computeSymbolFrequency(sampleDreams, dreamIds, dreamDates);

      result.forEach((symbol) => {
        expect(symbol.firstAppearance).toBeTruthy();
        expect(symbol.lastAppearance).toBeTruthy();
      });
    });

    it("should handle empty dreams array", () => {
      const result = computeSymbolFrequency([], [], []);
      expect(result).toEqual([]);
    });

    it("should normalize case-insensitive symbols", () => {
      const dreams = [
        { ...sampleDreams[0], keySymbols: ["Flying", "FLYING", "flying"] },
      ];
      const result = computeSymbolFrequency(dreams, ["1"], ["2026-01-01"]);

      const flyingSymbol = result.find((s) => s.symbol === "flying");
      expect(flyingSymbol).toBeDefined();
      expect(flyingSymbol!.count).toBe(3);
    });
  });

  describe("computeEmotionCorrelations()", () => {
    it("should return emotions sorted by frequency", () => {
      const result = computeEmotionCorrelations(sampleDreams);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].frequency).toBeGreaterThanOrEqual(result[1]?.frequency || 0);
    });

    it("should include associated symbols", () => {
      const result = computeEmotionCorrelations(sampleDreams);
      result.forEach((emotion) => {
        expect(emotion.associatedSymbols).toBeInstanceOf(Array);
      });
    });

    it("should handle dreams without emotions", () => {
      const dreams = [{ ...sampleDreams[0], emotionalThemes: [] }];
      const result = computeEmotionCorrelations(dreams);
      expect(result).toEqual([]);
    });
  });

  describe("computeCharacterRecurrence()", () => {
    it("should return characters sorted by appearances", () => {
      const result = computeCharacterRecurrence(sampleDreams, dreamIds);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].appearances).toBeGreaterThanOrEqual(result[1]?.appearances || 0);
    });

    it("should include dream IDs for each character", () => {
      const result = computeCharacterRecurrence(sampleDreams, dreamIds);
      result.forEach((char) => {
        expect(char.dreamIds).toBeInstanceOf(Array);
        expect(char.dreamIds.length).toBe(char.appearances);
      });
    });

    it("should handle dreams with no characters", () => {
      const emptyCharDreams = [sampleDreams[2]]; // dream with no characters
      const result = computeCharacterRecurrence(emptyCharDreams, ["dream_3"]);
      expect(result).toEqual([]);
    });
  });

  describe("computeLocationPatterns()", () => {
    it("should return locations sorted by frequency", () => {
      const result = computeLocationPatterns(sampleDreams, dreamIds);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include dream IDs", () => {
      const result = computeLocationPatterns(sampleDreams, dreamIds);
      result.forEach((loc) => {
        expect(loc.dreamIds).toBeInstanceOf(Array);
        expect(loc.dreamIds.length).toBe(loc.frequency);
      });
    });
  });

  describe("computeMoodCorrelations()", () => {
    it("should group emotions into mood categories", () => {
      const result = computeMoodCorrelations(sampleDreams);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should calculate average completeness", () => {
      const result = computeMoodCorrelations(sampleDreams);
      result.forEach((mood) => {
        expect(mood.averageCompleteness).toBeGreaterThanOrEqual(0);
        expect(mood.averageCompleteness).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("computePatternAnalytics()", () => {
    it("should return complete analytics for dreams", async () => {
      const result = await computePatternAnalytics({
        userId: "test-user",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.totalDreamsAnalyzed).toBe(3);
      expect(result.data!.symbolFrequency.length).toBeGreaterThan(0);
      expect(result.data!.emotionCorrelations.length).toBeGreaterThan(0);
      expect(result.data!.topInsights.length).toBeGreaterThan(0);
    });

    it("should handle empty dreams gracefully", async () => {
      const result = await computePatternAnalytics({
        userId: "test-user",
        dreams: [],
        dreamIds: [],
        dreamDates: [],
      });

      expect(result.success).toBe(true);
      expect(result.data!.totalDreamsAnalyzed).toBe(0);
      expect(result.data!.topInsights).toContain("Record your first dream to see patterns emerge.");
    });
  });
});

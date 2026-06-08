// ============================================================
// Tests: DreamScape AI — Monthly Report
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: {
      emotionalJourney: "This month showed a rich tapestry of dream experiences.",
      insightsAndPatterns: "Your dreams show a pattern of flying and water imagery.",
      recommendation: "Try setting an intention before sleep to explore doors imagery.",
      nextMonthGoal: "Record at least 75% of your dreams.",
      notableDreams: [0, 2],
    },
    tokenUsage: { inputTokens: 400, outputTokens: 300, totalTokens: 700, cost: 0.016 },
  }),
  chat: vi.fn().mockResolvedValue({
    content: "Insight text about dream patterns.",
    tokenUsage: { inputTokens: 100, outputTokens: 50, totalTokens: 150, cost: 0.003 },
  }),
}));

import { generateMonthlyReport } from "@/lib/ai/monthly-report";
import { DreamReconstruction } from "@/types/ai";

const sampleDreams: DreamReconstruction[] = [
  {
    summary: "Flying over a city",
    story: "I was flying over a neon city.",
    keySymbols: ["flying", "neon"],
    emotionalThemes: ["freedom", "awe"],
    characters: [{ name: "Me", role: "protagonist", description: "Dreamer" }],
    locations: [{ name: "Neon City", description: "City" }],
    timeline: [{ scene: "Flying", order: 0 }],
    sensoryDetails: ["Wind"],
    completenessScore: 85,
    estimatedDuration: { min: 15, max: 25 },
  },
  {
    summary: "Running in a library",
    story: "Running through an endless library.",
    keySymbols: ["library", "books"],
    emotionalThemes: ["curiosity", "fear"],
    characters: [],
    locations: [{ name: "Library", description: "Infinite library" }],
    timeline: [{ scene: "Running", order: 0 }],
    sensoryDetails: ["Musty smell"],
    completenessScore: 72,
    estimatedDuration: { min: 10, max: 20 },
  },
  {
    summary: "Beach of glass",
    story: "Standing on a beach with glass waves.",
    keySymbols: ["beach", "glass", "water"],
    emotionalThemes: ["sadness", "peace"],
    characters: [],
    locations: [{ name: "Glass Beach", description: "Beach" }],
    timeline: [{ scene: "Standing", order: 0 }],
    sensoryDetails: ["Glass tinkling"],
    completenessScore: 78,
    estimatedDuration: { min: 20, max: 30 },
  },
];

const dreamIds = ["d1", "d2", "d3"];
const dreamDates = ["2026-06-01", "2026-06-03", "2026-06-05"];

describe("Monthly Report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMonthlyReport()", () => {
    it("should generate a complete monthly report", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should include monthly summary stats", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      expect(result.data!.summary.totalDreams).toBe(3);
      expect(result.data!.summary.month).toBe("2026-06");
    });

    it("should calculate average completeness", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      const expectedAvg = Math.round((85 + 72 + 78) / 3);
      expect(result.data!.summary.averageCompleteness).toBe(expectedAvg);
    });

    it("should include chart data", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      expect(result.data!.chartData.emotionsOverTime).toBeInstanceOf(Array);
      expect(result.data!.chartData.symbolsOverTime).toBeInstanceOf(Array);
      expect(result.data!.chartData.completenessTrend).toBeInstanceOf(Array);
    });

    it("should include AI-generated narrative sections", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates,
      });

      expect(result.data!.emotionalJourney).toBeTruthy();
      expect(result.data!.insightsAndPatterns).toBeTruthy();
      expect(result.data!.recommendation).toBeTruthy();
      expect(result.data!.nextMonthGoal).toBeTruthy();
    });

    it("should handle empty dreams gracefully", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: [],
        dreamIds: [],
        dreamDates: [],
      });

      expect(result.success).toBe(true);
      expect(result.data!.summary.totalDreams).toBe(0);
      expect(result.data!.stats.length).toBe(0);
    });

    it("should compute longest streak", async () => {
      const result = await generateMonthlyReport({
        userId: "test-user",
        month: "2026-06",
        dreams: sampleDreams,
        dreamIds,
        dreamDates: ["2026-06-01", "2026-06-02", "2026-06-03"],
      });

      expect(result.data!.summary.dreamStreak).toBe(3);
    });
  });
});

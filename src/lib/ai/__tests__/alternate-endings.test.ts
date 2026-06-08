// ============================================================
// Tests: DreamScape AI — Alternate Endings
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: {
      type: "face-the-threat",
      title: "Confronting the Shadow",
      narrative: "As you float towards the starlight woman, a dark vortex opens...",
      keyChanges: [
        "The dreamer confronts rather than avoids the darkness",
        "The ending transforms from wonder to integration",
      ],
      emotionalTone: "Cathartic and peaceful",
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The Void Opens",
          description: "A dark vortex tears open beneath the city.",
          mood: "Tense",
          cameraDirection: "Low angle looking up",
          visualPrompt: "A dark swirling vortex opens beneath a neon city skyline.",
          duration: 10,
        },
        {
          sceneNumber: 2,
          sceneTitle: "The Embrace",
          description: "The dreamer embraces the shadow.",
          mood: "Cathartic",
          cameraDirection: "Close-up on hands",
          visualPrompt: "Two hands reaching towards each other.",
          duration: 15,
        },
      ],
    },
    tokenUsage: { inputTokens: 200, outputTokens: 350, totalTokens: 550, cost: 0.012 },
  }),
}));

import {
  generateAlternateEnding,
  generateAllEndings,
  getAlternateEndingModes,
} from "@/lib/ai/alternate-endings";
import { DreamReconstruction, AlternateEndingType } from "@/types/ai";

const mockReconstruction: DreamReconstruction = {
  summary: "Flying over a neon city",
  story: "I was flying over a city at night. A starlight woman appeared.",
  keySymbols: ["flying", "neon", "starlight"],
  emotionalThemes: ["freedom", "awe"],
  characters: [{ name: "Me", role: "protagonist", description: "Dreamer" }],
  locations: [{ name: "Neon City", description: "Futuristic city" }],
  timeline: [{ scene: "Flying", order: 0 }, { scene: "Meeting", order: 1 }],
  sensoryDetails: ["Wind"],
  completenessScore: 80,
  estimatedDuration: { min: 15, max: 25 },
};

describe("Alternate Endings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAlternateEndingModes()", () => {
    it("should return all 6 modes", () => {
      const modes = getAlternateEndingModes();
      expect(modes.length).toBe(6);
    });

    it("should include icons for each mode", () => {
      const modes = getAlternateEndingModes();
      modes.forEach((mode) => {
        expect(mode.icon).toBeTruthy();
        expect(mode.label).toBeTruthy();
      });
    });
  });

  describe("generateAlternateEnding()", () => {
    it("should generate an alternate ending", async () => {
      const result = await generateAlternateEnding({
        dreamReconstruction: mockReconstruction,
        endingType: "face-the-threat",
        originalDream: mockReconstruction.story,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should include a narrative", async () => {
      const result = await generateAlternateEnding({
        dreamReconstruction: mockReconstruction,
        endingType: "continue-dream",
        originalDream: mockReconstruction.story,
      });

      expect(result.data!.narrative).toBeTruthy();
    });

    it("should include scene breakdown", async () => {
      const result = await generateAlternateEnding({
        dreamReconstruction: mockReconstruction,
        endingType: "explore-the-door",
        originalDream: mockReconstruction.story,
      });

      expect(result.data!.sceneBreakdown.length).toBeGreaterThan(0);
    });

    it("should list key changes from original", async () => {
      const result = await generateAlternateEnding({
        dreamReconstruction: mockReconstruction,
        endingType: "change-the-ending",
        originalDream: mockReconstruction.story,
      });

      expect(result.data!.keyChanges.length).toBeGreaterThan(0);
    });

    it("should support all ending types", async () => {
      const types: AlternateEndingType[] = [
        "continue-dream",
        "face-the-threat",
        "explore-the-door",
        "change-the-ending",
        "ai-continue",
        "write-custom",
      ];

      for (const endingType of types) {
        const result = await generateAlternateEnding({
          dreamReconstruction: mockReconstruction,
          endingType,
          originalDream: mockReconstruction.story,
          userWriting: endingType === "write-custom" ? "I woke up and everything was different." : undefined,
        });
        expect(result.success).toBe(true);
        expect(result.data!.type).toBe(endingType);
      }
    });
  });

  describe("generateAllEndings()", () => {
    it("should generate all 5 AI-powered endings", async () => {
      const result = await generateAllEndings(
        mockReconstruction,
        mockReconstruction.story
      );

      expect(result.data).toBeDefined();
      expect(result.data!.length).toBeGreaterThan(0);
    });
  });
});

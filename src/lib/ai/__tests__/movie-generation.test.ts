// ============================================================
// Tests: DreamScape AI — Movie Generation
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: {
      title: "Neon Ascension",
      tagline: "Above the city of lights, the soul takes flight",
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The Ascent",
          description: "Camera rises through neon-lit streets.",
          mood: "Awe-inspiring",
          cameraDirection: "Crane shot rising vertically",
          visualPrompt: "Cinematic drone shot rising through a futuristic city at dusk.",
          duration: 12,
          characterFocus: ["The Dreamer"],
        },
        {
          sceneNumber: 2,
          sceneTitle: "The Moon's Embrace",
          description: "The dreamer floats towards the moon.",
          mood: "Ethereal",
          cameraDirection: "Slow dolly zoom",
          visualPrompt: "A lone figure floating towards a giant moon.",
          duration: 15,
          characterFocus: ["The Dreamer"],
        },
        {
          sceneNumber: 3,
          sceneTitle: "The Encounter",
          description: "A starlight woman appears on a spire.",
          mood: "Magical",
          cameraDirection: "Wide shot then push-in",
          visualPrompt: "A luminous figure made of starlight.",
          duration: 18,
          characterFocus: ["The Dreamer", "Starlight Woman"],
        },
      ],
      totalDuration: 45,
      narrationPrompt: "You rise through a world of neon and glass.",
    },
    tokenUsage: { inputTokens: 250, outputTokens: 500, totalTokens: 750, cost: 0.018 },
  }),
}));

import {
  generateMovieStoryboard,
  generateSingleScenePrompt,
  getAvailableStyles,
} from "@/lib/ai/movie-generation";
import { DreamReconstruction, MovieStyle, AspectRatio } from "@/types/ai";

const mockReconstruction: DreamReconstruction = {
  summary: "Flying over a neon city",
  story: "I was flying over a city at night. Neon everywhere.",
  keySymbols: ["flying", "neon", "city"],
  emotionalThemes: ["freedom", "awe"],
  characters: [{ name: "Me", role: "protagonist", description: "Dreamer" }],
  locations: [{ name: "Neon City", description: "Futuristic city" }],
  timeline: [{ scene: "Flying", order: 0 }],
  sensoryDetails: ["Wind", "Neon lights"],
  completenessScore: 80,
  estimatedDuration: { min: 15, max: 25 },
};

describe("Movie Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAvailableStyles()", () => {
    it("should return all 7 styles", () => {
      const styles = getAvailableStyles();
      expect(styles.length).toBe(7);
    });

    it("should include cinematic style", () => {
      const styles = getAvailableStyles();
      expect(styles.find((s) => s.value === "cinematic")).toBeDefined();
    });

    it("should include labels and descriptions", () => {
      const styles = getAvailableStyles();
      styles.forEach((style) => {
        expect(style.label).toBeTruthy();
        expect(style.description).toBeTruthy();
      });
    });
  });

  describe("generateMovieStoryboard()", () => {
    it("should return a complete storyboard", async () => {
      const result = await generateMovieStoryboard({
        dreamReconstruction: mockReconstruction,
        style: "cinematic",
        aspectRatio: "16:9",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should include a title and tagline", async () => {
      const result = await generateMovieStoryboard({
        dreamReconstruction: mockReconstruction,
        style: "fantasy",
        aspectRatio: "9:16",
      });

      expect(result.data!.title).toBeTruthy();
      expect(result.data!.tagline).toBeTruthy();
    });

    it("should have at least 2 scenes in the storyboard", async () => {
      const result = await generateMovieStoryboard({
        dreamReconstruction: mockReconstruction,
        style: "cinematic",
        aspectRatio: "16:9",
      });

      expect(result.data!.storyboard.scenes.length).toBeGreaterThanOrEqual(2);
    });

    it("should include visual prompts for each scene", async () => {
      const result = await generateMovieStoryboard({
        dreamReconstruction: mockReconstruction,
        style: "cinematic",
        aspectRatio: "16:9",
      });

      result.data!.storyboard.scenes.forEach((scene) => {
        expect(scene.visualPrompt).toBeTruthy();
      });
    });

    it("should support 9:16 aspect ratio", async () => {
      const result = await generateMovieStoryboard({
        dreamReconstruction: mockReconstruction,
        style: "cinematic",
        aspectRatio: "9:16",
      });

      expect(result.data!.aspectRatio).toBe("9:16");
    });

    it("should support all 7 styles", async () => {
      const styles: MovieStyle[] = [
        "cinematic", "realistic", "fantasy", "surreal",
        "horror", "sci-fi", "animated",
      ];

      for (const style of styles) {
        const result = await generateMovieStoryboard({
          dreamReconstruction: mockReconstruction,
          style,
          aspectRatio: "16:9",
        });
        expect(result.success).toBe(true);
        expect(result.data!.style).toBe(style);
      }
    });
  });

  describe("generateSingleScenePrompt()", () => {
    it("should return a specific scene by index", async () => {
      const result = await generateSingleScenePrompt(
        mockReconstruction,
        0,
        "cinematic",
        "16:9"
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});

// ============================================================
// DreamScape AI — Dream Movie Generation Pipeline
// Generates cinematic prompts for dream movie creation.
// Supports multiple aspect ratios, styles, and detailed
// scene-by-scene prompts for any video AI.
// ============================================================

import {
  DreamReconstruction,
  MovieGenerationInput,
  MovieGenerationOutput,
  ScenePrompt,
  Storyboard,
  MovieStyle,
  AspectRatio,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured } from "./client";

// ── Style Definitions ─────────────────────────────────────
const STYLE_DIRECTIVES: Record<MovieStyle, string> = {
  cinematic: "Rich, film-like quality with dramatic lighting, deep colors, and professional cinematography. Think Oscar-nominated cinematography.",
  realistic: "Photorealistic, grounded in reality, natural lighting, minimal stylization. Looks like real life captured on camera.",
  fantasy: "Magical, ethereal, with glowing elements, enchanted atmospheres, mythical creatures, and wonder. Whimsical and dreamlike.",
  surreal: "Surreal, impossible geometries, melting landscapes, unexpected juxtapositions. Dali meets Inception. Bend reality.",
  horror: "Dark, tense, shadowy, with unsettling atmospheres, eerie sounds implied, and a sense of dread. Gothic horror aesthetics.",
  "sci-fi": "Futuristic, neon-lit, technological, with sleek interfaces, holograms, alien landscapes. Cyberpunk meets space opera.",
  animated: "Stylized animation — think Studio Ghibli meets modern 3D animation. Vibrant colors, expressive characters, artistic.",
};

const ASPECT_RATIO_DIRECTIVES: Record<AspectRatio, string> = {
  "9:16": "Portrait / vertical format suitable for mobile (TikTok/Reels/Shorts). Frame subjects centrally.",
  "16:9": "Widescreen / cinematic landscape format suitable for YouTube, TV, and cinema screens.",
};

// ── Scene Generation ──────────────────────────────────────
interface StoryboardResult {
  title: string;
  tagline: string;
  scenes: {
    sceneNumber: number;
    sceneTitle: string;
    description: string;
    mood: string;
    cameraDirection: string;
    visualPrompt: string;
    duration: number;
    characterFocus?: string[];
  }[];
  totalDuration: number;
  narrationPrompt?: string;
}

export async function generateMovieStoryboard(
  input: MovieGenerationInput
): Promise<AIResponse<MovieGenerationOutput>> {
  try {
    const dreamText = buildDreamText(input.dreamReconstruction);
    const styleDirective = STYLE_DIRECTIVES[input.style];
    const aspectDirective = ASPECT_RATIO_DIRECTIVES[input.aspectRatio];
    const userPrefs = input.userPreferences;

    const result = await chatStructured<StoryboardResult>(
      [
        {
          role: "system",
          content: `You are a visionary film director and storyboard artist who specializes in turning dreams into cinematic movies.

Given a dream reconstruction, create a detailed storyboard with ${input.style} styling in ${input.aspectRatio} format.

STYLE: ${styleDirective}
FORMAT: ${aspectDirective}
${userPrefs?.musicGenre ? `MUSIC GENRE: ${userPrefs.musicGenre}` : ""}
${userPrefs?.narrationStyle ? `NARRATION STYLE: ${userPrefs.narrationStyle}` : ""}

For EACH scene, provide:
1. **Scene number** — sequential
2. **Scene title** — evocative name
3. **Description** — what happens in this scene (2-3 sentences)
4. **Mood** — single word/phrase describing the emotional atmosphere
5. **Camera direction** — shot type (wide shot, close-up, tracking, crane, POV, etc.)
6. **Visual prompt** — detailed prompt suitable for AI video generation (Stable Video, Runway, Kling, Veo, etc.) — include style, lighting, colors, composition, movement
7. **Duration** — in seconds (scenes should be 5-15 seconds for short-form, 10-30 for narrative)
8. **Character focus** — which characters appear in this scene

Also generate:
- A compelling movie **title**
- A memorable **tagline**
- An optional **narration prompt** (a poetic voiceover to guide the viewer)

Guidelines:
- Dream movies should feel surreal, evocative, and emotionally resonant
- Match the pacing to the emotion — slow for awe, quick for chase scenes
- Keep visual prompts DETAILED and AI-friendly (describe lighting, color palette, camera movement, atmosphere)
- Total duration should be 30-120 seconds for mobile, 60-300 seconds for widescreen`,
        },
        {
          role: "user",
          content: `Turn this dream into a ${input.style} movie storyboard:\n\n${dreamText}`,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.8,
        maxTokens: 4096,
      }
    );

    const scenes: ScenePrompt[] = result.data.scenes.map((s) => ({
      sceneNumber: s.sceneNumber,
      sceneTitle: s.sceneTitle,
      visualPrompt: s.visualPrompt,
      duration: clampDuration(s.duration, input.aspectRatio),
      style: input.style,
      aspectRatio: input.aspectRatio,
      description: s.description,
      mood: s.mood,
      cameraDirection: s.cameraDirection,
      characterFocus: s.characterFocus,
    }));

    const storyboard: Storyboard = { scenes };
    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

    return {
      success: true,
      data: {
        title: result.data.title || "Untitled Dream",
        tagline: result.data.tagline || "",
        storyboard,
        totalDuration,
        style: input.style,
        aspectRatio: input.aspectRatio,
        narrationPrompt: result.data.narrationPrompt,
      },
      tokenUsage: result.tokenUsage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Movie generation failed",
    };
  }
}

// ── Clamp Duration ────────────────────────────────────────
function clampDuration(seconds: number, ratio: AspectRatio): number {
  if (ratio === "9:16") {
    return Math.max(3, Math.min(20, seconds));
  }
  return Math.max(5, Math.min(45, seconds));
}

// ── Build Dream Text ──────────────────────────────────────
function buildDreamText(reconstruction: DreamReconstruction): string {
  const parts: string[] = [];

  parts.push(`=== DREAM STORY ===\n${reconstruction.story || reconstruction.summary}`);

  if (reconstruction.characters?.length) {
    parts.push(
      `\n=== CHARACTERS ===\n${reconstruction.characters
        .map((c) => `${c.name || "Unknown"} (${c.role}): ${c.description}`)
        .join("\n")}`
    );
  }

  if (reconstruction.locations?.length) {
    parts.push(
      `\n=== LOCATIONS ===\n${reconstruction.locations
        .map((l) => `${l.name}: ${l.description}`)
        .join("\n")}`
    );
  }

  if (reconstruction.timeline?.length) {
    parts.push(
      `\n=== TIMELINE ===\n${reconstruction.timeline
        .sort((a, b) => a.order - b.order)
        .map((t) => `Scene ${t.order + 1}: ${t.scene}`)
        .join("\n")}`
    );
  }

  if (reconstruction.sensoryDetails?.length) {
    parts.push(`\n=== ATMOSPHERE ===\n${reconstruction.sensoryDetails.join("\n")}`);
  }

  if (reconstruction.emotionalThemes?.length) {
    parts.push(`\n=== EMOTIONAL TONE ===\n${reconstruction.emotionalThemes.join(", ")}`);
  }

  return parts.join("\n\n");
}

// ── Single Scene Prompt Generator ─────────────────────────
export async function generateSingleScenePrompt(
  reconstruction: DreamReconstruction,
  sceneIndex: number,
  style: MovieStyle = "cinematic",
  aspectRatio: AspectRatio = "16:9"
): Promise<AIResponse<ScenePrompt>> {
  const fullBoard = await generateMovieStoryboard({
    dreamReconstruction: reconstruction,
    style,
    aspectRatio,
  });

  if (!fullBoard.success || !fullBoard.data) {
    return {
      success: false,
      error: fullBoard.error || "Failed to generate scene prompt",
    };
  }

  const scene = fullBoard.data.storyboard.scenes[sceneIndex];
  if (!scene) {
    return {
      success: false,
      error: `Scene index ${sceneIndex} out of bounds (0-${fullBoard.data.storyboard.scenes.length - 1})`,
    };
  }

  return {
    success: true,
    data: scene,
    tokenUsage: fullBoard.tokenUsage,
  };
}

// ── Available Styles List ─────────────────────────────────
export function getAvailableStyles(): { value: MovieStyle; label: string; description: string }[] {
  return [
    { value: "cinematic", label: "Cinematic", description: "Rich, film-like quality with dramatic lighting" },
    { value: "realistic", label: "Realistic", description: "Photorealistic, grounded in reality" },
    { value: "fantasy", label: "Fantasy", description: "Magical and ethereal with enchanted atmospheres" },
    { value: "surreal", label: "Surreal", description: "Dali meets Inception — impossible and dreamlike" },
    { value: "horror", label: "Horror", description: "Dark, tense, and unsettling atmospheres" },
    { value: "sci-fi", label: "Sci-Fi", description: "Futuristic, neon-lit, technological worlds" },
    { value: "animated", label: "Animated", description: "Stylized animation with vibrant colors" },
  ];
}
// ============================================================
// DreamScape AI — Alternate Ending Generator
// Generates alternate dream endings branching from the
// original dream. Supports 6 modes:
//   continue-dream, face-the-threat, explore-the-door,
//   change-the-ending, ai-continue, write-custom
// ============================================================

import {
  DreamReconstruction,
  AlternateEndingInput,
  AlternateEndingOutput,
  AlternateEndingType,
  ScenePrompt,
  AspectRatio,
  MovieStyle,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured } from "./client";

// ── Mode Descriptions ─────────────────────────────────────
const ENDING_MODE_PROMPTS: Record<AlternateEndingType, string> = {
  "continue-dream":
    "Continue the dream forward naturally. Extend the narrative as if the dream kept going for another 5-10 minutes. Maintain the same atmosphere, style, and logic of the original dream.",
  "face-the-threat":
    "Confront the scariest or most threatening element from the dream. The dreamer faces their fear head-on. This is an empowering, cathartic alternate ending — facing what scared them.",
  "explore-the-door":
    "Follow curiosity. Focus on the most intriguing, mysterious, or unexplored element from the dream. Open that door, follow that path, see what's around that corner. Satisfy the dreamer's curiosity.",
  "change-the-ending":
    "Rewrite the conclusion of the dream. Change what happened at the end — if the dream ended badly, make it end well. If it ended abruptly, give it closure. If it was confusing, give it clarity.",
  "ai-continue":
    "Let AI add an unexpected twist. Surprise the dreamer with something they wouldn't expect. Add a new character, a revelation, a shift in perspective, or a surreal turn. Keep it fascinating.",
  "write-custom":
    "Incorporate the dreamer's own writing into the narrative. The user has written a continuation or change. Integrate their text seamlessly and expand upon it.",
};

// ── Build Dream Context ───────────────────────────────────
function buildDreamContext(
  reconstruction: DreamReconstruction,
  originalDream: string
): string {
  const parts: string[] = [];

  parts.push(`=== ORIGINAL DREAM STORY ===\n${originalDream || reconstruction.story || reconstruction.summary}`);

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

  if (reconstruction.keySymbols?.length) {
    parts.push(`\n=== KEY SYMBOLS ===\n${reconstruction.keySymbols.join(", ")}`);
  }

  if (reconstruction.emotionalThemes?.length) {
    parts.push(`\n=== EMOTIONAL TONE ===\n${reconstruction.emotionalThemes.join(", ")}`);
  }

  if (reconstruction.timeline?.length) {
    const lastScene = [...reconstruction.timeline].sort((a, b) => b.order - a.order)[0];
    parts.push(`\n=== ENDING POINT ===\n${lastScene?.scene || "Dream ended."}`);
  }

  return parts.join("\n\n");
}

// ── Alternate Ending Narrative Interface ──────────────────
interface AlternateEndingNarrative {
  type: AlternateEndingType;
  title: string;
  narrative: string;
  keyChanges: string[];
  emotionalTone: string;
  scenes: {
    sceneNumber: number;
    sceneTitle: string;
    description: string;
    mood: string;
    cameraDirection: string;
    visualPrompt: string;
    duration: number;
  }[];
}

// ── Main Alternate Ending Generator ───────────────────────
export async function generateAlternateEnding(
  input: AlternateEndingInput
): Promise<AIResponse<AlternateEndingOutput>> {
  try {
    const dreamContext = buildDreamContext(input.dreamReconstruction, input.originalDream);
    const modePrompt = ENDING_MODE_PROMPTS[input.endingType];
    const userWriting = input.userWriting
      ? `\n\n=== DREAMER'S WRITING ===\n${input.userWriting}`
      : "";

    const result = await chatStructured<AlternateEndingNarrative>(
      [
        {
          role: "system",
          content: `You are a creative dream continuation artist. You write alternate endings to people's dreams — turning their remembered dream fragments into new cinematic narratives.

MODE: ${input.endingType}
${modePrompt}

Generate:
1. **Title** — a compelling, evocative title for this alternate ending
2. **Narrative** — the full alternate story (2-3 paragraphs, vivid and immersive)
3. **Key Changes** — 2-4 bullet points describing what changed from the original
4. **Emotional Tone** — single phrase describing the emotional atmosphere (e.g., "Triumphant and serene", "Mysterious and unsettling")
5. **Scenes** — 3-6 scenes suitable for video generation, each with:
   - sceneNumber, sceneTitle
   - description (what happens)
   - mood (emotional atmosphere)
   - cameraDirection (shot type)
   - visualPrompt (detailed AI video prompt)
   - duration (seconds, 5-20 each)

CRITICAL RULES:
- Stay true to the original dream's style and world
- Don't contradict established facts from the original dream
- Make it emotionally resonant and cinematically vivid
- For "ai-continue" mode, genuinely surprise with creativity
- For "write-custom", honor and expand the user's writing${userWriting}`,
        },
        {
          role: "user",
          content: `Create a "${input.endingType}" alternate ending for this dream:\n\n${dreamContext}${userWriting}`,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.9, // higher temperature for creative variety
        maxTokens: 4096,
      }
    );

    // Map scenes to ScenePrompt type
    const scenes: ScenePrompt[] = result.data.scenes.map((s) => ({
      sceneNumber: s.sceneNumber,
      sceneTitle: s.sceneTitle,
      visualPrompt: s.visualPrompt,
      duration: Math.max(3, Math.min(25, s.duration)),
      style: "cinematic" as MovieStyle,
      aspectRatio: "16:9" as AspectRatio,
      description: s.description,
      mood: s.mood,
      cameraDirection: s.cameraDirection,
    }));

    return {
      success: true,
      data: {
        type: result.data.type || input.endingType,
        title: result.data.title || `${input.endingType} Alternate Ending`,
        narrative: result.data.narrative,
        keyChanges: result.data.keyChanges || ["A new direction for the dream"],
        emotionalTone: result.data.emotionalTone || "Unknown",
        sceneBreakdown: scenes,
      },
      tokenUsage: result.tokenUsage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Alternate ending generation failed",
    };
  }
}

// ── Get Mode Info ─────────────────────────────────────────
export function getAlternateEndingModes(): {
  value: AlternateEndingType;
  label: string;
  description: string;
  icon: string;
}[] {
  return [
    {
      value: "continue-dream",
      label: "Continue Dream",
      description: "Extend the narrative naturally — keep dreaming",
      icon: "▶️",
    },
    {
      value: "face-the-threat",
      label: "Face The Threat",
      description: "Confront your dream fears head-on",
      icon: "🛡️",
    },
    {
      value: "explore-the-door",
      label: "Explore The Door",
      description: "Follow the curiosity — see what's beyond",
      icon: "🚪",
    },
    {
      value: "change-the-ending",
      label: "Change The Ending",
      description: "Rewrite the conclusion your way",
      icon: "✏️",
    },
    {
      value: "ai-continue",
      label: "AI Surprise",
      description: "Let AI add an unexpected twist",
      icon: "🎲",
    },
    {
      value: "write-custom",
      label: "Write Custom",
      description: "Write your own continuation, AI expands it",
      icon: "📝",
    },
  ];
}

// ── Generate Multiple Endings ─────────────────────────────
export async function generateAllEndings(
  reconstruction: DreamReconstruction,
  originalDream: string
): Promise<AIResponse<AlternateEndingOutput[]>> {
  const types: AlternateEndingType[] = [
    "continue-dream",
    "face-the-threat",
    "explore-the-door",
    "change-the-ending",
    "ai-continue",
  ];

  const results: AlternateEndingOutput[] = [];

  for (const endingType of types) {
    const result = await generateAlternateEnding({
      dreamReconstruction: reconstruction,
      endingType,
      originalDream,
    });

    if (result.success && result.data) {
      results.push(result.data);
    }
  }

  return {
    success: results.length > 0,
    data: results,
    error: results.length === 0 ? "Failed to generate any alternate endings" : undefined,
  };
}
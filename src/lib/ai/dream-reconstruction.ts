// ============================================================
// DreamScape AI — Dream Reconstruction Pipeline
// Converts messy raw dream descriptions into structured
// narrative with characters, locations, timeline, symbols,
// and emotional themes.
// ============================================================

import {
  DreamReconstruction,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured } from "./client";

// ── Reconstruction Input ──────────────────────────────────
export interface ReconstructionInput {
  rawTranscript: string;
  recallAnswers?: { question: string; answer: string }[];
}

// ── Main Reconstruction ───────────────────────────────────
export async function reconstructDream(
  input: ReconstructionInput
): Promise<AIResponse<DreamReconstruction>> {
  try {
    const contextBuilder = buildContext(input);

    const result = await chatStructured<DreamReconstruction>(
      [
        {
          role: "system",
          content: `You are a master dream analyst and narrative reconstructor. Given raw, messy dream descriptions and guided recall answers, you reconstruct the dream into a structured narrative.

Your task:
1. Extract the core story — what actually happened, in sequence
2. Identify key symbols (objects, animals, numbers, colors, recurring motifs)
3. Identify emotional themes (fear, joy, confusion, awe, anxiety, etc.)
4. Identify characters (their names if mentioned, roles, descriptions)
5. Identify locations (unique dream environments)
6. Build a timeline of scenes in order
7. Capture sensory details (sights, sounds, smells, textures, tastes)
8. Assign a completeness score (0-100) based on how much detail is available
9. Estimate the dream duration (in minutes, typical dreams last 20-45 min)

Rules:
- Fill in gaps with "unknown" or empty arrays when details aren't available
- Do NOT fabricate details — if unsure, note it as uncertain
- The story field should be a full narrative, not bullet points
- Be precise with the completeness score`,
        },
        {
          role: "user",
          content: contextBuilder,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.3, // lower temperature for consistent reconstruction
        maxTokens: 4096,
      }
    );

    // Validate completeness score range
    if (result.data.completenessScore !== undefined) {
      result.data.completenessScore = Math.max(
        0,
        Math.min(100, result.data.completenessScore)
      );
    }

    // Ensure timeline is ordered
    if (result.data.timeline) {
      result.data.timeline.sort((a, b) => a.order - b.order);
    }

    return {
      success: true,
      data: result.data,
      tokenUsage: result.tokenUsage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Dream reconstruction failed",
    };
  }
}

// ── Context Builder ───────────────────────────────────────
function buildContext(input: ReconstructionInput): string {
  const parts: string[] = [];

  if (input.rawTranscript) {
    parts.push(
      `=== RAW DREAM TRANSCRIPT ===\n${input.rawTranscript}`
    );
  }

  if (input.recallAnswers && input.recallAnswers.length > 0) {
    parts.push(
      `=== GUIDED RECALL ANSWERS ===\n${input.recallAnswers
        .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
        .join("\n\n")}`
    );
  }

  parts.push(
    `\nPlease reconstruct this dream with the following structure, responding only in valid JSON:
{
  "summary": "2-3 sentence summary",
  "story": "Full narrative (paragraphs)",
  "keySymbols": ["symbol1", "symbol2"],
  "emotionalThemes": ["emotion1", "emotion2"],
  "characters": [{"name": "string", "role": "protagonist/antagonist/guide/stranger/family/other", "description": "string"}],
  "locations": [{"name": "string", "description": "string"}],
  "timeline": [{"scene": "description", "order": 0}],
  "sensoryDetails": ["detail1", "detail2"],
  "completenessScore": 75,
  "estimatedDuration": {"min": 18, "max": 24}
}`
  );

  return parts.join("\n\n");
}

// ── Quick Reconstruction (lightweight, faster) ────────────
export async function quickReconstruct(
  rawTranscript: string
): Promise<AIResponse<DreamReconstruction>> {
  return reconstructDream({
    rawTranscript,
    recallAnswers: [],
  });
}
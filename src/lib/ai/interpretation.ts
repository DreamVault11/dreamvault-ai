// ============================================================
// DreamScape AI — Dream Interpretation Engine
// Never claims certainty. Presents multiple perspectives:
// Psychological, Symbolic, and Archetypal — plus reflection
// questions and personal pattern insights.
// ============================================================

import {
  DreamInterpretation,
  DreamReconstruction,
  InterpretationInsight,
  SymbolInterpretation,
  InterpretationPerspective,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured } from "./client";

// ── Interpretation Input ──────────────────────────────────
export interface InterpretationInput {
  dreamReconstruction: DreamReconstruction;
  userId?: string;
  pastDreams?: DreamReconstruction[]; // for pattern analysis
}

// ── Main Interpretation ───────────────────────────────────
export async function interpretDream(
  input: InterpretationInput
): Promise<AIResponse<DreamInterpretation>> {
  try {
    const dreamText = buildDreamText(input.dreamReconstruction);
    const patternContext = buildPatternContext(input);

    const result = await chatStructured<{
      insights: {
        psychological: { title: string; content: string; symbols: { symbol: string; meaning: string; confidence: number }[] };
        symbolic: { title: string; content: string; symbols: { symbol: string; meaning: string; confidence: number }[] };
        archetypal: { title: string; content: string; symbols: { symbol: string; meaning: string; confidence: number }[] };
      };
      reflectionQuestions: string[];
      personalPatternInsights: string[];
    }>(
      [
        {
          role: "system",
          content: `You are a humble, insightful dream interpreter. You NEVER claim certainty about what dreams "mean." Instead, you offer multiple perspectives for the dreamer to consider.

PERSPECTIVES TO OFFER:

1. **Psychological Perspective** — Based on modern dream research, psychology, and neuroscience. Focus on emotional processing, memory consolidation, and psychological states.

2. **Symbolic Perspective** — Based on common dream symbolism across cultures. Always note that symbols can mean different things to different people.

3. **Archetypal Perspective** — Based on Jungian/archetypal psychology. Universal themes, myths, and patterns that appear in dreams across cultures.

For EACH perspective, provide:
- A fitting title (e.g., "The Hidden Room: A Psychological View")
- Detailed interpretive content (2-4 paragraphs)
- Analysis of 2-4 key symbols from that perspective (each with a meaning and confidence score 0-1)

Additionally, generate:
- 3-5 reflection questions to help the dreamer discover their own meaning
- 1-3 personal pattern insights (if past dreams are provided, identify patterns; otherwise, note this is their first dream)

CRITICAL RULES:
- Start with a disclaimer about interpretation uncertainty
- Never diagnose, prescribe, or make claims about mental health
- Never say "this dream means X" — always say "this could suggest..." or "some interpret this as..."
- Be warm, supportive, and curious
- Use evocative but humble language`,
        },
        {
          role: "user",
          content: `Please interpret this dream:\n\n${dreamText}\n\n${patternContext}`,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        maxTokens: 4096,
      }
    );

    // Map the structured response to our types
    const insights: InterpretationInsight[] = [
      {
        perspective: "psychological",
        title: result.data.insights.psychological.title,
        content: result.data.insights.psychological.content,
        symbols: result.data.insights.psychological.symbols.map((s) => ({
          ...s,
          perspective: "psychological" as InterpretationPerspective,
        })),
      },
      {
        perspective: "symbolic",
        title: result.data.insights.symbolic.title,
        content: result.data.insights.symbolic.content,
        symbols: result.data.insights.symbolic.symbols.map((s) => ({
          ...s,
          perspective: "symbolic" as InterpretationPerspective,
        })),
      },
      {
        perspective: "archetypal",
        title: result.data.insights.archetypal.title,
        content: result.data.insights.archetypal.content,
        symbols: result.data.insights.archetypal.symbols.map((s) => ({
          ...s,
          perspective: "archetypal" as InterpretationPerspective,
        })),
      },
    ];

    return {
      success: true,
      data: {
        dreamId: `dream_${Date.now()}`,
        insights,
        reflectionQuestions: result.data.reflectionQuestions || [],
        personalPatternInsights: result.data.personalPatternInsights || [],
        disclaimer:
          "Dream interpretation is not an exact science. These insights are suggestions and perspectives — not definitive meanings. Your own intuition about your dream is the most valid interpretation. If this dream causes distress, consider speaking with a mental health professional.",
      },
      tokenUsage: result.tokenUsage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Dream interpretation failed",
    };
  }
}

// ── Build Dream Text ──────────────────────────────────────
function buildDreamText(reconstruction: DreamReconstruction): string {
  const parts: string[] = [];

  parts.push(`=== DREAM STORY ===\n${reconstruction.story || reconstruction.summary}`);

  if (reconstruction.keySymbols?.length) {
    parts.push(`\n=== KEY SYMBOLS ===\n${reconstruction.keySymbols.join(", ")}`);
  }

  if (reconstruction.emotionalThemes?.length) {
    parts.push(`\n=== EMOTIONAL THEMES ===\n${reconstruction.emotionalThemes.join(", ")}`);
  }

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

  if (reconstruction.sensoryDetails?.length) {
    parts.push(`\n=== SENSORY DETAILS ===\n${reconstruction.sensoryDetails.join(", ")}`);
  }

  parts.push(`\nCompleteness: ${reconstruction.completenessScore}/100`);

  return parts.join("\n\n");
}

// ── Build Pattern Context ─────────────────────────────────
function buildPatternContext(input: InterpretationInput): string {
  if (!input.pastDreams || input.pastDreams.length === 0) {
    return "This appears to be your first dream recorded with us. No past patterns to compare against.";
  }

  const pastSymbols = input.pastDreams.flatMap((d) => d.keySymbols || []);
  const pastEmotions = input.pastDreams.flatMap((d) => d.emotionalThemes || []);

  const symbolFrequency = countFrequency(pastSymbols);
  const emotionFrequency = countFrequency(pastEmotions);

  return `=== PAST DREAM PATTERNS (${input.pastDreams.length} previous dreams) ===
Recurring symbols: ${Object.entries(symbolFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([s, c]) => `${s} (${c}x)`)
    .join(", ")}

Recurring emotions: ${Object.entries(emotionFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([e, c]) => `${e} (${c}x)`)
    .join(", ")}

Please consider these patterns when offering personal pattern insights.`;
}

// ── Utility ───────────────────────────────────────────────
function countFrequency(items: string[]): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

// ── Quick Interpretation (just the dream text) ────────────
export async function quickInterpret(
  reconstruction: DreamReconstruction
): Promise<AIResponse<DreamInterpretation>> {
  return interpretDream({
    dreamReconstruction: reconstruction,
  });
}
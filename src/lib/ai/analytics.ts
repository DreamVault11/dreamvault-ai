// ============================================================
// DreamScape AI — Dream Pattern Analytics
// Analyzes dreams over time to find recurring patterns,
// symbol frequency, emotion correlations, character
// recurrence, location patterns, and mood correlations.
// ============================================================

import {
  DreamReconstruction,
  PatternAnalytics,
  SymbolFrequency,
  EmotionCorrelation,
  CharacterRecurrence,
  LocationAnalytics,
  MoodDreamCorrelation,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured, chat } from "./client";

// ── Analytics Input ───────────────────────────────────────
export interface AnalyticsInput {
  userId: string;
  dreams: DreamReconstruction[];
  dreamIds: string[];
  dreamDates: string[];
}

// ── Compute Symbol Frequency ──────────────────────────────
export function computeSymbolFrequency(
  dreams: DreamReconstruction[],
  dreamIds: string[],
  dreamDates: string[]
): SymbolFrequency[] {
  const symbolMap = new Map<
    string,
    { count: number; firstDate: string; lastDate: string }
  >();
  const totalDreams = dreams.length;

  dreams.forEach((dream, idx) => {
    const date = dreamDates[idx] || new Date().toISOString().split("T")[0];
    (dream.keySymbols || []).forEach((symbol) => {
      const normalized = symbol.toLowerCase().trim();
      if (!normalized) return;
      const existing = symbolMap.get(normalized);
      if (existing) {
        existing.count++;
        if (date < existing.firstDate) existing.firstDate = date;
        if (date > existing.lastDate) existing.lastDate = date;
      } else {
        symbolMap.set(normalized, {
          count: 1,
          firstDate: date,
          lastDate: date,
        });
      }
    });
  });

  return Array.from(symbolMap.entries())
    .map(([symbol, data]) => ({
      symbol,
      count: data.count,
      percentage: Math.round((data.count / totalDreams) * 100 * 100) / 100,
      firstAppearance: data.firstDate,
      lastAppearance: data.lastDate,
    }))
    .sort((a, b) => b.count - a.count);
}

// ── Compute Emotion Correlations ──────────────────────────
export function computeEmotionCorrelations(
  dreams: DreamReconstruction[]
): EmotionCorrelation[] {
  const emotionMap = new Map<
    string,
    {
      frequency: number;
      symbols: Set<string>;
      completenessScores: number[];
    }
  >();
  const totalDreams = dreams.length;

  dreams.forEach((dream) => {
    const completeness = dream.completenessScore || 0;
    (dream.emotionalThemes || []).forEach((emotion) => {
      const normalized = emotion.toLowerCase().trim();
      if (!normalized) return;
      const existing = emotionMap.get(normalized);
      if (existing) {
        existing.frequency++;
        (dream.keySymbols || []).forEach((s) =>
          existing.symbols.add(s.toLowerCase().trim())
        );
        existing.completenessScores.push(completeness);
      } else {
        const symbols = new Set<string>();
        (dream.keySymbols || []).forEach((s) =>
          symbols.add(s.toLowerCase().trim())
        );
        emotionMap.set(normalized, {
          frequency: 1,
          symbols,
          completenessScores: [completeness],
        });
      }
    });
  });

  return Array.from(emotionMap.entries())
    .map(([emotion, data]) => ({
      emotion,
      frequency: data.frequency,
      associatedSymbols: Array.from(data.symbols).slice(0, 10),
      typicalCompletenessScore:
        data.completenessScores.length > 0
          ? Math.round(
              data.completenessScores.reduce((a, b) => a + b, 0) /
                data.completenessScores.length
            )
          : 0,
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// ── Compute Character Recurrence ──────────────────────────
export function computeCharacterRecurrence(
  dreams: DreamReconstruction[],
  dreamIds: string[]
): CharacterRecurrence[] {
  const charMap = new Map<
    string,
    { role: string; appearances: number; dreamIdSet: Set<string> }
  >();

  dreams.forEach((dream, idx) => {
    const dreamId = dreamIds[idx] || `dream_${idx}`;
    (dream.characters || []).forEach((char) => {
      const name = char.name?.toLowerCase().trim() || "unknown";
      const existing = charMap.get(name);
      if (existing) {
        existing.appearances++;
        existing.dreamIdSet.add(dreamId);
        // Keep the most common role
      } else {
        charMap.set(name, {
          role: char.role,
          appearances: 1,
          dreamIdSet: new Set([dreamId]),
        });
      }
    });
  });

  return Array.from(charMap.entries())
    .map(([name, data]) => ({
      name,
      role: data.role,
      appearances: data.appearances,
      dreamIds: Array.from(data.dreamIdSet),
    }))
    .sort((a, b) => b.appearances - a.appearances);
}

// ── Compute Location Patterns ─────────────────────────────
export function computeLocationPatterns(
  dreams: DreamReconstruction[],
  dreamIds: string[]
): LocationAnalytics[] {
  const locationMap = new Map<
    string,
    { frequency: number; dreamIdSet: Set<string> }
  >();

  dreams.forEach((dream, idx) => {
    const dreamId = dreamIds[idx] || `dream_${idx}`;
    (dream.locations || []).forEach((loc) => {
      const name = loc.name?.toLowerCase().trim() || "unknown location";
      const existing = locationMap.get(name);
      if (existing) {
        existing.frequency++;
        existing.dreamIdSet.add(dreamId);
      } else {
        locationMap.set(name, {
          frequency: 1,
          dreamIdSet: new Set([dreamId]),
        });
      }
    });
  });

  return Array.from(locationMap.entries())
    .map(([name, data]) => ({
      name,
      frequency: data.frequency,
      dreamIds: Array.from(data.dreamIdSet),
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// ── Compute Mood Correlations ─────────────────────────────
export function computeMoodCorrelations(
  dreams: DreamReconstruction[]
): MoodDreamCorrelation[] {
  // Mood tags are derived from emotional themes
  const moodMap = new Map<
    string,
    { totalDreams: number; symbols: Set<string>; completenessScores: number[] }
  >();

  // Define mood groups based on emotional themes
  const moodGroups: Record<string, string[]> = {
    fear: ["fear", "anxiety", "terror", "dread", "panic", "scared", "afraid", "nervous"],
    sadness: ["sadness", "grief", "loss", "melancholy", "sorrow", "lonely", "disappointment"],
    joy: ["joy", "happiness", "excitement", "delight", "elation", "bliss", "contentment"],
    anger: ["anger", "frustration", "rage", "fury", "irritation", "resentment"],
    surprise: ["surprise", "shock", "amazement", "astonishment", "wonder", "awe"],
    confusion: ["confusion", "bewilderment", "perplexity", "disorientation", "uncertainty"],
    love: ["love", "affection", "tenderness", "passion", "romance", "care"],
  };

  dreams.forEach((dream) => {
    const completeness = dream.completenessScore || 0;
    const dreamEmotions = (dream.emotionalThemes || []).map((e) => e.toLowerCase().trim());

    for (const [mood, emotions] of Object.entries(moodGroups)) {
      if (dreamEmotions.some((e) => emotions.includes(e))) {
        const existing = moodMap.get(mood);
        if (existing) {
          existing.totalDreams++;
          (dream.keySymbols || []).forEach((s) =>
            existing.symbols.add(s.toLowerCase().trim())
          );
          existing.completenessScores.push(completeness);
        } else {
          const symbols = new Set<string>();
          (dream.keySymbols || []).forEach((s) =>
            symbols.add(s.toLowerCase().trim())
          );
          moodMap.set(mood, {
            totalDreams: 1,
            symbols,
            completenessScores: [completeness],
          });
        }
      }
    }
  });

  return Array.from(moodMap.entries())
    .map(([mood, data]) => ({
      moodTag: mood,
      totalDreams: data.totalDreams,
      commonSymbols: Array.from(data.symbols).slice(0, 8),
      averageCompleteness:
        data.completenessScores.length > 0
          ? Math.round(
              data.completenessScores.reduce((a, b) => a + b, 0) /
                data.completenessScores.length
            )
          : 0,
    }))
    .sort((a, b) => b.totalDreams - a.totalDreams);
}

// ── AI-Powered Insight Generation ─────────────────────────
async function generateInsights(
  analytics: Omit<PatternAnalytics, "topInsights" | "userId" | "totalDreamsAnalyzed" | "dateRange">
): Promise<string[]> {
  try {
    const analyticsSummary = `
Symbol Frequency: ${analytics.symbolFrequency
      .slice(0, 5)
      .map((s) => `${s.symbol} (${s.count}x)`)
      .join(", ")}

Emotion Correlations: ${analytics.emotionCorrelations
      .slice(0, 3)
      .map((e) => `${e.emotion} (${e.frequency}x)`)
      .join(", ")}

Character Recurrences: ${analytics.characterRecurrences
      .slice(0, 3)
      .map((c) => `${c.name} (${c.appearances}x)`)
      .join(", ")}

Location Patterns: ${analytics.locationPatterns
      .slice(0, 3)
      .map((l) => `${l.name} (${l.frequency}x)`)
      .join(", ")}

Mood Correlations: ${analytics.moodCorrelations
      .slice(0, 3)
      .map((m) => `${m.moodTag} (${m.totalDreams}x)`)
      .join(", ")}
`;

    const result = await chat(
      [
        {
          role: "system",
          content:
            "You are a dream pattern analyst. Given dream analytics data, identify the 3-5 most meaningful patterns and insights. Be specific, evocative, and helpful. Each insight should be 1-2 sentences. Return the insights as a JSON array of strings.",
        },
        {
          role: "user",
          content: `Analyze these dream patterns and provide key insights:\n\n${analyticsSummary}`,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.5,
      }
    );

    try {
      const parsed = JSON.parse(result.content);
      if (Array.isArray(parsed)) return parsed.slice(0, 5);
    } catch {}

    // Fallback: extract line-by-line
    return result.content
      .split("\n")
      .filter((l) => l.trim().length > 20)
      .slice(0, 5);
  } catch {
    return [
      "Your dreams show recurring patterns worth exploring further.",
      "Consider journaling more consistently for deeper insights.",
    ];
  }
}

// ── Full Analytics Pipeline ───────────────────────────────
export async function computePatternAnalytics(
  input: AnalyticsInput
): Promise<AIResponse<PatternAnalytics>> {
  try {
    const { userId, dreams, dreamIds, dreamDates } = input;

    if (!dreams.length) {
      return {
        success: true,
        data: {
          userId,
          totalDreamsAnalyzed: 0,
          dateRange: { start: "", end: "" },
          symbolFrequency: [],
          emotionCorrelations: [],
          characterRecurrences: [],
          locationPatterns: [],
          moodCorrelations: [],
          topInsights: ["Record your first dream to see patterns emerge."],
        },
      };
    }

    // Compute all metrics
    const symbolFrequency = computeSymbolFrequency(dreams, dreamIds, dreamDates);
    const emotionCorrelations = computeEmotionCorrelations(dreams);
    const characterRecurrences = computeCharacterRecurrence(dreams, dreamIds);
    const locationPatterns = computeLocationPatterns(dreams, dreamIds);
    const moodCorrelations = computeMoodCorrelations(dreams);

    const dates = dreamDates.filter(Boolean).sort();
    const dateRange = {
      start: dates[0] || new Date().toISOString().split("T")[0],
      end: dates[dates.length - 1] || new Date().toISOString().split("T")[0],
    };

    // Generate AI insights
    const topInsights = await generateInsights({
      symbolFrequency,
      emotionCorrelations,
      characterRecurrences,
      locationPatterns,
      moodCorrelations,
    });

    return {
      success: true,
      data: {
        userId,
        totalDreamsAnalyzed: dreams.length,
        dateRange,
        symbolFrequency,
        emotionCorrelations,
        characterRecurrences,
        locationPatterns,
        moodCorrelations,
        topInsights,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Pattern analytics computation failed",
    };
  }
}
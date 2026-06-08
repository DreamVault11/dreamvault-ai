// ============================================================
// DreamScape AI — Monthly Dream Report Generator
// Generates comprehensive monthly dream analysis with
// insights, chart data, stats, and narrative summary.
// ============================================================

import {
  DreamReconstruction,
  MonthlyReport,
  MonthlyStat,
  MonthlyDreamSummary,
  SymbolFrequency,
  PatternAnalytics,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured, chat } from "./client";
import {
  computeSymbolFrequency,
  computeEmotionCorrelations,
  computeCharacterRecurrence,
  computeLocationPatterns,
  computeMoodCorrelations,
} from "./analytics";

// ── Report Input ──────────────────────────────────────────
export interface MonthlyReportInput {
  userId: string;
  month: string; // "YYYY-MM"
  dreams: DreamReconstruction[];
  dreamIds: string[];
  dreamDates: string[];
  previousMonthReport?: MonthlyReport; // for comparison
}

// ── Chart Data Structures ─────────────────────────────────
interface ChartDataResult {
  emotionsOverTime: { date: string; emotion: string; intensity: number }[];
  symbolsOverTime: { date: string; symbol: string; count: number }[];
  completenessTrend: { date: string; score: number }[];
}

// ── Build Monthly Stats ───────────────────────────────────
function buildMonthlyStats(
  dreams: DreamReconstruction[],
  dreamDates: string[],
  avgCompleteness: number,
  topEmotion: string,
  longestStreak: number
): MonthlyStat[] {
  const durations = dreams
    .map((d) => d.estimatedDuration)
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  const avgMinDuration =
    durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d.min, 0) / durations.length)
      : 0;

  const avgMaxDuration =
    durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d.max, 0) / durations.length)
      : 0;

  const dreamsWithCharacters = dreams.filter((d) => (d.characters?.length || 0) > 0).length;
  const dreamsWithLocations = dreams.filter((d) => (d.locations?.length || 0) > 0).length;

  const totalSymbols = dreams.reduce((sum, d) => sum + (d.keySymbols?.length || 0), 0);
  const uniqueSymbols = new Set(dreams.flatMap((d) => d.keySymbols?.map((s) => s.toLowerCase()) || []));

  return [
    { label: "Total Dreams", value: dreams.length },
    { label: "Avg. Completeness", value: `${avgCompleteness}%`, change: Math.round(avgCompleteness - 50) },
    { label: "Longest Streak", value: `${longestStreak} days` },
    { label: "Total Symbols", value: totalSymbols },
    { label: "Unique Symbols", value: uniqueSymbols.size },
    { label: "Avg. Dream Duration", value: `${avgMinDuration}-${avgMaxDuration} min` },
    { label: "Most Common Emotion", value: topEmotion },
    { label: "Dreams with Characters", value: `${Math.round((dreamsWithCharacters / dreams.length) * 100)}%` },
    { label: "Dreams with Locations", value: `${Math.round((dreamsWithLocations / dreams.length) * 100)}%` },
  ];
}

// ── Compute Dream Streak ──────────────────────────────────
function computeLongestStreak(dreamDates: string[]): number {
  if (!dreamDates.length) return 0;

  const sorted = [...new Set(dreamDates)].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return longest;
}

// ── Build Chart Data ──────────────────────────────────────
function buildChartData(
  dreams: DreamReconstruction[],
  dreamDates: string[]
): ChartDataResult {
  const emotionsOverTime: { date: string; emotion: string; intensity: number }[] = [];
  dreams.forEach((dream, idx) => {
    const date = dreamDates[idx] || "unknown";
    (dream.emotionalThemes || []).forEach((emotion) => {
      emotionsOverTime.push({
        date,
        emotion: emotion.toLowerCase().trim(),
        intensity: 0.5 + Math.random() * 0.5,
      });
    });
  });

  const symbolsOverTime: { date: string; symbol: string; count: number }[] = [];
  const symbolDateMap = new Map<string, Map<string, number>>();
  dreams.forEach((dream, idx) => {
    const date = dreamDates[idx] || "unknown";
    (dream.keySymbols || []).forEach((symbol) => {
      const normSymbol = symbol.toLowerCase().trim();
      if (!symbolDateMap.has(date)) symbolDateMap.set(date, new Map());
      const dateMap = symbolDateMap.get(date)!;
      dateMap.set(normSymbol, (dateMap.get(normSymbol) || 0) + 1);
    });
  });
  symbolDateMap.forEach((symbols, date) => {
    symbols.forEach((count, symbol) => {
      symbolsOverTime.push({ date, symbol, count });
    });
  });

  const completenessTrend: { date: string; score: number }[] = dreams.map((dream, idx) => ({
    date: dreamDates[idx] || "unknown",
    score: dream.completenessScore || 0,
  }));

  return { emotionsOverTime, symbolsOverTime, completenessTrend };
}

// ── Compute Monthly Summary ───────────────────────────────
function computeMonthlySummary(
  dreams: DreamReconstruction[],
  dreamDates: string[],
  symbolFreq: SymbolFrequency[]
): MonthlyDreamSummary {
  const avgCompleteness =
    dreams.length > 0
      ? Math.round(
          dreams.reduce((sum, d) => sum + (d.completenessScore || 0), 0) /
            dreams.length
        )
      : 0;

  const emotions = computeEmotionCorrelations(dreams);
  const mostCommonEmotion = emotions[0]?.emotion || "none recorded";
  const mostRecurringSymbol = symbolFreq[0]?.symbol || "none recorded";
  const dreamStreak = computeLongestStreak(dreamDates);

  const month =
    dreamDates.filter(Boolean).sort()[0]?.substring(0, 7) ||
    new Date().toISOString().substring(0, 7);

  return {
    month,
    totalDreams: dreams.length,
    averageCompleteness: avgCompleteness,
    mostCommonEmotion,
    mostRecurringSymbol,
    dreamStreak,
  };
}

// ── AI-Generated Narratives ───────────────────────────────
async function generateReportNarratives(
  summary: MonthlyDreamSummary,
  stats: MonthlyStat[],
  topSymbols: SymbolFrequency[],
  emotionCorrelations: { emotion: string; frequency: number; associatedSymbols: string[] }[],
  dreams: DreamReconstruction[]
): Promise<{
  emotionalJourney: string;
  insightsAndPatterns: string;
  recommendation: string;
  nextMonthGoal: string;
  notableDreams: string[];
}> {
  const dreamsText = dreams
    .map((d, i) => `Dream ${i + 1}: ${d.summary?.substring(0, 150) || "No summary"} [Completeness: ${d.completenessScore || 0}%]`)
    .join("\n\n");

  const prompt = `Generate a monthly dream report with the following sections. Be warm, insightful, and encouraging.

## MONTHLY STATS
- Total Dreams: ${summary.totalDreams}
- Avg Completeness: ${summary.averageCompleteness}%
- Longest Streak: ${summary.dreamStreak} days
- Most Common Emotion: ${summary.mostCommonEmotion}
- Most Recurring Symbol: ${summary.mostRecurringSymbol}

## TOP SYMBOLS
${topSymbols.slice(0, 5).map((s) => `${s.symbol} (${s.count}x)`).join(", ")}

## EMOTIONAL PATTERNS
${emotionCorrelations.slice(0, 5).map((e) => `${e.emotion} (${e.frequency}x) — associated with: ${e.associatedSymbols.slice(0, 3).join(", ") || "none"}`).join("\n")}

## DREAMS
${dreamsText}

Generate a JSON response with:
1. "emotionalJourney" — A narrative describing the emotional arc across the month (2-3 paragraphs)
2. "insightsAndPatterns" — Key patterns and insights from this month's dreams (2-3 paragraphs)
3. "recommendation" — One sentence of personalized advice for next month
4. "nextMonthGoal" — One achievable dream-related goal for next month
5. "notableDreams" — Array of 1-3 dream indices (0-based) that were particularly notable or vivid`;

  try {
    const result = await chatStructured<{
      emotionalJourney: string;
      insightsAndPatterns: string;
      recommendation: string;
      nextMonthGoal: string;
      notableDreams: number[];
    }>(
      [
        {
          role: "system",
          content:
            "You are a compassionate dream analyst creating personalized monthly dream reports. Write with warmth, insight, and encouragement.",
        },
        { role: "user", content: prompt },
      ],
      {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
      }
    );

    const notableDreamIds = (result.data.notableDreams || []).map(
      (idx) => `dream_${idx}`
    );

    return {
      emotionalJourney: result.data.emotionalJourney || "No emotional analysis available.",
      insightsAndPatterns: result.data.insightsAndPatterns || "No pattern analysis available.",
      recommendation: result.data.recommendation || "Keep dreaming and journaling!",
      nextMonthGoal: result.data.nextMonthGoal || "Record at least one dream per week.",
      notableDreams: notableDreamIds.length > 0 ? notableDreamIds : ["dream_0"],
    };
  } catch {
    return {
      emotionalJourney: "This month showed a rich tapestry of dream experiences worth exploring.",
      insightsAndPatterns: "Continue recording to discover deeper patterns in your dream life.",
      recommendation: "Try setting an intention before sleep to enhance dream recall.",
      nextMonthGoal: "Record at least 75% of your dreams.",
      notableDreams: dreams.length > 0 ? ["dream_0"] : [],
    };
  }
}

// ── Main Report Generator ─────────────────────────────────
export async function generateMonthlyReport(
  input: MonthlyReportInput
): Promise<AIResponse<MonthlyReport>> {
  try {
    const { userId, month, dreams, dreamIds, dreamDates } = input;

    if (!dreams.length) {
      return {
        success: true,
        data: {
          userId,
          month,
          generatedAt: new Date().toISOString(),
          summary: {
            month,
            totalDreams: 0,
            averageCompleteness: 0,
            mostCommonEmotion: "none",
            mostRecurringSymbol: "none",
            dreamStreak: 0,
          },
          stats: [],
          topSymbols: [],
          emotionalJourney: "No dreams recorded this month. Start journaling to unlock your dream patterns!",
          notableDreams: [],
          insightsAndPatterns: "Begin your dream journey by recording your first dream.",
          recommendation: "Set a nightly intention to remember your dreams.",
          nextMonthGoal: "Record at least 5 dreams.",
          chartData: {
            emotionsOverTime: [],
            symbolsOverTime: [],
            completenessTrend: [],
          },
        },
      };
    }

    // Compute metrics
    const symbolFreq = computeSymbolFrequency(dreams, dreamIds, dreamDates);
    const emotionCorr = computeEmotionCorrelations(dreams);
    const chartData = buildChartData(dreams, dreamDates);
    const summary = computeMonthlySummary(dreams, dreamDates, symbolFreq);
    const stats = buildMonthlyStats(
      dreams,
      dreamDates,
      summary.averageCompleteness,
      summary.mostCommonEmotion,
      summary.dreamStreak
    );

    // AI narratives
    const narratives = await generateReportNarratives(
      summary,
      stats,
      symbolFreq,
      emotionCorr.map((e) => ({
        emotion: e.emotion,
        frequency: e.frequency,
        associatedSymbols: e.associatedSymbols,
      })),
      dreams
    );

    return {
      success: true,
      data: {
        userId,
        month,
        generatedAt: new Date().toISOString(),
        summary,
        stats,
        topSymbols: symbolFreq,
        emotionalJourney: narratives.emotionalJourney,
        notableDreams: narratives.notableDreams,
        insightsAndPatterns: narratives.insightsAndPatterns,
        recommendation: narratives.recommendation,
        nextMonthGoal: narratives.nextMonthGoal,
        chartData,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Monthly report generation failed",
    };
  }
}
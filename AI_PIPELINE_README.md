# DreamScape AI — AI Pipeline Documentation

> *"Watch your dreams after you wake up."*

This document covers the AI/ML pipeline architecture, module reference, integration guide, and usage examples for frontend developers.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Environment Setup](#environment-setup)
4. [Shared AI Client](#shared-ai-client)
5. [Pipeline Modules](#pipeline-modules)
   - [1. Guided Dream Recall Assistant](#1-guided-dream-recall-assistant)
   - [2. Dream Reconstruction](#2-dream-reconstruction)
   - [3. Dream Interpretation Engine](#3-dream-interpretation-engine)
   - [4. Dream Movie Generation](#4-dream-movie-generation)
   - [5. Dream Pattern Analytics](#5-dream-pattern-analytics)
   - [6. Alternate Ending Generator](#6-alternate-ending-generator)
   - [7. Monthly Dream Report](#7-monthly-dream-report)
6. [React Hooks](#react-hooks)
7. [Cost & Token Tracking](#cost--token-tracking)
8. [Error Handling](#error-handling)
9. [Testing Guide](#testing-guide)
10. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Architecture Overview

```
User Input (text/voice)
       │
       ▼
┌─────────────────────────────┐
│  Guided Recall Assistant    │  ← Conversational AI, asks 1 Q at a time
│  (recall-assistant.ts)      │
└─────────────┬───────────────┘
              │ Recall answers
              ▼
┌─────────────────────────────┐
│  Dream Reconstruction       │  ← Raw text → structured narrative
│  (dream-reconstruction.ts)  │
└─────────────┬───────────────┘
              │ DreamReconstruction
              ├──────────────────────────┐
              ▼                          ▼
┌──────────────────────┐   ┌────────────────────────┐
│ Interpretation       │   │ Movie Generation        │
│ (interpretation.ts)  │   │ (movie-generation.ts)   │
└─────────┬────────────┘   └───────────┬────────────┘
          │                            │
          ▼                            ▼
┌──────────────────────┐   ┌────────────────────────┐
│ Pattern Analytics    │   │ Alternate Endings       │
│ (analytics.ts)       │   │ (alternate-endings.ts)  │
└─────────┬────────────┘   └───────────┬────────────┘
          │                            │
          ▼                            ▼
┌──────────────────────┐   ┌────────────────────────┐
│ Monthly Report       │   │ (Hooks consume all)    │
│ (monthly-report.ts)  │   │                        │
└──────────────────────┘   └────────────────────────┘
```

**Key design principles:**
- **Dual-provider**: Both OpenAI and Anthropic are supported. Default is `gpt-4o`.
- **Structured output**: All pipelines return typed JSON via JSON mode / structured output.
- **Streaming support**: Real-time output via `chatStream()` for UI responsiveness.
- **Token tracking**: Every API response includes estimated cost and token counts.
- **Deterministic analytics**: Pattern metrics (symbol frequency, emotion correlations) compute locally — zero API cost.

---

## Directory Structure

```
src/
├── types/
│   └── ai.ts                        # All shared TypeScript interfaces
│
└── lib/
    ├── ai/
    │   ├── client.ts                # Shared AI client (OpenAI + Anthropic)
    │   ├── recall-assistant.ts      # Guided dream recall pipeline
    │   ├── dream-reconstruction.ts  # Dream reconstruction pipeline
    │   ├── interpretation.ts        # Dream interpretation engine
    │   ├── movie-generation.ts      # Dream movie storyboard generation
    │   ├── analytics.ts             # Pattern analytics (deterministic + AI)
    │   ├── alternate-endings.ts     # Alternate ending generation
    │   ├── monthly-report.ts        # Monthly report generation
    │   └── hooks/                   # React hooks for all pipelines
    │       ├── useDreamRecall.ts
    │       ├── useDreamReconstruction.ts
    │       ├── useDreamInterpretation.ts
    │       ├── useMovieGeneration.ts
    │       ├── useDreamAnalytics.ts
    │       ├── useAlternateEnding.ts
    │       ├── useMonthlyReport.ts
    │       └── index.ts            # Barrel export
    │
    └── hooks/                      # Alternative hooks location
        ├── use-ai-shared.ts         # Shared hook utilities
        ├── use-recall-assistant.ts
        ├── use-dream-reconstruction.ts
        ├── use-dream-interpretation.ts
        ├── use-movie-generation.ts
        ├── use-pattern-analytics.ts
        ├── use-alternate-ending.ts
        ├── use-monthly-report.ts
        └── index.ts                # Barrel export
```

---

## Environment Setup

### 1. Install Required Packages

```bash
npm install openai @anthropic-ai/sdk
```

Already installed — verify in `package.json`:
- `"openai": "^6.42.0"`
- `"@anthropic-ai/sdk": "^0.102.0"`

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and set your API keys:

```env
# Required: OpenAI (used by default)
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Anthropic (alternative provider)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

At least one key is required. If both are set, the provider can be switched per-call.

### 3. Import Paths

All modules use the `@/` alias (configured in `tsconfig.json`):
```ts
import { chat, chatStructured } from "@/lib/ai/client";
import { reconstructDream } from "@/lib/ai/dream-reconstruction";
import { useDreamRecall } from "@/lib/ai/hooks";
```

---

## Shared AI Client

**File:** `src/lib/ai/client.ts`

The shared client provides three core functions:

### `chat(messages, config?)`
Standard chat completion. Returns content + token usage.

```ts
import { chat } from "@/lib/ai/client";

const result = await chat(
  [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is a dream?" },
  ],
  { provider: "openai", model: "gpt-4o", temperature: 0.7 }
);
console.log(result.content);
console.log(result.tokenUsage.cost); // Estimated USD cost
```

### `chatStructured<T>(messages, config?)`
JSON mode / structured output. Returns typed data + token usage.

```ts
import { chatStructured } from "@/lib/ai/client";

const result = await chatStructured<{ summary: string; keyPoints: string[] }>(
  [
    { role: "system", content: "Respond in JSON format." },
    { role: "user", content: "Summarize this dream..." },
  ],
  { provider: "openai", model: "gpt-4o" }
);
console.log(result.data.summary);
console.log(result.tokenUsage.totalTokens);
```

### `chatStream(messages, onChunk, config?)`
Streaming chat. Calls `onChunk` with each delta.

```ts
import { chatStream } from "@/lib/ai/client";

const tokenUsage = await chatStream(
  messages,
  (chunk) => {
    if (chunk.delta) setStreamedText(prev => prev + chunk.delta);
    if (chunk.finishReason === "stop") console.log("Done!");
  },
  { provider: "openai", streaming: true }
);
```

### Supported Models & Costs

| Model | Input Cost/1K tokens | Output Cost/1K tokens |
|-------|---------------------|----------------------|
| `gpt-4o` | $0.0025 | $0.01 |
| `gpt-4o-mini` | $0.00015 | $0.0006 |
| `gpt-4-turbo` | $0.01 | $0.03 |
| `claude-3-opus-20240229` | $0.015 | $0.075 |
| `claude-3-sonnet-20240229` | $0.003 | $0.015 |
| `claude-3-haiku-20240307` | $0.00025 | $0.00125 |

---

## Pipeline Modules

### 1. Guided Dream Recall Assistant

**File:** `src/lib/ai/recall-assistant.ts`

**Purpose:** Conversational AI that helps users remember forgotten dream details. Asks one question at a time across 7 categories:

1. **Location** — Where the dream took place
2. **People** — Who was in the dream
3. **Sensory** — Sights, sounds, smells, touch, taste
4. **Emotion** — Feelings during the dream
5. **Story** — What happened
6. **Symbol** — Symbolic elements
7. **Wake-up** — How you woke up and immediate feelings

**Exported functions:**

```ts
// Start a new recall session
startRecallSession(): Promise<AIResponse<RecallAssistantResponse>>

// Process an answer and get the next question
processRecallAnswer(
  sessionState: RecallSessionState,
  answerText: string
): Promise<AIResponse<RecallAssistantResponse>>

// Generate a summary of all recalled details
summarizeRecall(
  answers: RecallAnswer[]
): Promise<AIResponse<{ summary: string; rawTranscript: string }>>
```

**Usage example:**

```ts
import { startRecallSession, processRecallAnswer } from "@/lib/ai/recall-assistant";

const session = await startRecallSession();
// session.data.question.question = "Where did your dream take place?"

const next = await processRecallAnswer(session.data.sessionState, "I was in a vast forest...");
// next.data.question.question = "Who was with you in the forest?"
```

---

### 2. Dream Reconstruction

**File:** `src/lib/ai/dream-reconstruction.ts`

**Purpose:** Converts messy raw dream descriptions (and optional recall answers) into a structured `DreamReconstruction` object.

**Exported functions:**

```ts
// Full reconstruction with raw transcript + recall answers
reconstructDream(input: ReconstructionInput): Promise<AIResponse<DreamReconstruction>>

// Quick reconstruction — raw text only
quickReconstruct(rawTranscript: string): Promise<AIResponse<DreamReconstruction>>
```

**Input:**
```ts
interface ReconstructionInput {
  rawTranscript: string;
  recallAnswers?: { question: string; answer: string }[];
}
```

**Output:**
```ts
interface DreamReconstruction {
  summary: string;                    // 2-3 sentence summary
  story: string;                      // Full narrative (paragraphs)
  keySymbols: string[];               // Important dream symbols
  emotionalThemes: string[];          // Emotional tones
  characters: DreamCharacter[];       // People/entities
  locations: DreamLocation[];         // Dream environments
  timeline: DreamTimeline[];          // Ordered scene sequence
  sensoryDetails: string[];           // Sights, sounds, smells, etc.
  completenessScore: number;          // 0-100
  estimatedDuration: { min: number; max: number }; // Minutes
}
```

**Usage example:**

```ts
import { reconstructDream } from "@/lib/ai/dream-reconstruction";

const result = await reconstructDream({
  rawTranscript: "I was walking through a dark forest...",
  recallAnswers: [
    { question: "Where did the dream take place?", answer: "A vast, dark forest" },
  ],
});

if (result.success) {
  console.log(result.data.summary);
  console.log(result.data.characters);
}
```

---

### 3. Dream Interpretation Engine

**File:** `src/lib/ai/interpretation.ts`

**Purpose:** Never claims certainty. Presents three distinct perspectives:
- **Psychological** — Modern dream research, emotional processing
- **Symbolic** — Cross-cultural dream symbolism
- **Archetypal** — Jungian universal themes

**Exported functions:**

```ts
// Full interpretation with optional past dream context
interpretDream(input: InterpretationInput): Promise<AIResponse<DreamInterpretation>>

// Quick — just the dream reconstruction
quickInterpret(reconstruction: DreamReconstruction): Promise<AIResponse<DreamInterpretation>>
```

**Input:**
```ts
interface InterpretationInput {
  dreamReconstruction: DreamReconstruction;
  userId?: string;
  pastDreams?: DreamReconstruction[]; // For pattern analysis
}
```

**Output:**
```ts
interface DreamInterpretation {
  dreamId: string;
  insights: InterpretationInsight[];   // 3 perspectives
  reflectionQuestions: string[];       // 3-5 questions
  personalPatternInsights: string[];   // If past dreams provided
  disclaimer: string;                  // Uncertainty disclaimer
}
```

**Usage:**
```ts
const result = await interpretDream({
  dreamReconstruction: myReconstruction,
  pastDreams: [/* previous dreams */],
});
result.data.insights.forEach(i => {
  console.log(`[${i.perspective}] ${i.title}: ${i.content}`);
});
```

---

### 4. Dream Movie Generation

**File:** `src/lib/ai/movie-generation.ts`

**Purpose:** Generates detailed scene-by-scene storyboards for dream movies. Suitable for any video AI (OpenAI Sora, Runway, Kling, Veo, etc.).

**Supported styles:**
- `cinematic` — Rich film-like quality
- `realistic` — Photorealistic
- `fantasy` — Magical, ethereal
- `surreal` — Dali meets Inception
- `horror` — Dark, tense
- `sci-fi` — Futuristic, neon
- `animated` — Studio Ghibli style

**Supported aspect ratios:**
- `9:16` — Portrait (mobile, TikTok/Reels)
- `16:9` — Widescreen (YouTube, cinema)

**Exported functions:**

```ts
generateMovieStoryboard(input: MovieGenerationInput): Promise<AIResponse<MovieGenerationOutput>>
generateSingleScenePrompt(reconstruction, sceneIndex, style?, aspectRatio?): Promise<AIResponse<ScenePrompt>>
getAvailableStyles(): { value: MovieStyle; label: string; description: string }[]
```

**Usage:**
```ts
const movie = await generateMovieStoryboard({
  dreamReconstruction: myReconstruction,
  style: "fantasy",
  aspectRatio: "16:9",
  userPreferences: { musicGenre: "orchestral" },
});
console.log(movie.data.title); // "The Whispering Forest"
movie.data.storyboard.scenes.forEach(scene => {
  console.log(scene.visualPrompt); // Detailed AI video prompt
});
```

---

### 5. Dream Pattern Analytics

**File:** `src/lib/ai/analytics.ts`

**Purpose:** Analyzes dreams over time to find recurring patterns. Most functions are **deterministic** (no API call needed).

**Exported functions:**

```ts
// AI-powered (uses API for insight generation)
computePatternAnalytics(input: AnalyticsInput): Promise<AIResponse<PatternAnalytics>>

// Deterministic — zero API cost, runs in browser
computeSymbolFrequency(dreams, dreamIds, dreamDates): SymbolFrequency[]
computeEmotionCorrelations(dreams): EmotionCorrelation[]
computeCharacterRecurrence(dreams, dreamIds): CharacterRecurrence[]
computeLocationPatterns(dreams, dreamIds): LocationAnalytics[]
computeMoodCorrelations(dreams): MoodDreamCorrelation[]
```

**Usage (deterministic, no API call):**
```ts
const symbols = computeSymbolFrequency(dreams, dreamIds, dreamDates);
console.log(symbols[0].symbol); // Most common symbol
```

---

### 6. Alternate Ending Generator

**File:** `src/lib/ai/alternate-endings.ts`

**Purpose:** Generates alternate dream endings in 6 modes.

| Mode | Description |
|------|-------------|
| `continue-dream` | Extend the narrative naturally |
| `face-the-threat` | Confront dream fears head-on |
| `explore-the-door` | Follow curiosity |
| `change-the-ending` | Rewrite the conclusion |
| `ai-continue` | Unexpected AI twist |
| `write-custom` | User writes, AI expands |

**Exported functions:**

```ts
generateAlternateEnding(input: AlternateEndingInput): Promise<AIResponse<AlternateEndingOutput>>
generateAllEndings(reconstruction, originalDream): Promise<AIResponse<AlternateEndingOutput[]>>
getAlternateEndingModes(): { value, label, description, icon }[]
```

**Usage:**
```ts
const result = await generateAlternateEnding({
  dreamReconstruction: myReconstruction,
  endingType: "face-the-threat",
  originalDream: "I was running from a shadowy figure...",
});
console.log(result.data.title); // "Confronting the Shadow"
console.log(result.data.narrative);
```

---

### 7. Monthly Dream Report

**File:** `src/lib/ai/monthly-report.ts`

**Purpose:** Generates comprehensive monthly dream analysis with stats, chart data, and AI narratives.

**Exported functions:**

```ts
generateMonthlyReport(input: MonthlyReportInput): Promise<AIResponse<MonthlyReport>>
```

**Output includes:**
- `summary` — Total dreams, avg completeness, longest streak
- `stats` — Array of labeled statistics with % changes
- `topSymbols` — Symbol frequency ranking
- `emotionalJourney` — AI narrative of the month's emotional arc
- `notableDreams` — IDs of standout dreams
- `insightsAndPatterns` — AI-generated pattern analysis
- `recommendation` — Personalized advice
- `chartData` — Emotions over time, symbols over time, completeness trend

---

## React Hooks

### Location: `src/lib/ai/hooks/`

All hooks follow this consistent pattern:

```ts
function useSomething() {
  const [data, setData] = useState<ResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (input: InputType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await somePipeline(input);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, generate, reset };
}
```

### Hook Quick Reference

| Hook | Import | Key Methods |
|------|--------|-------------|
| `useDreamRecall` | `@/lib/ai/hooks` | `startRecall()`, `submitAnswer(text)`, `startStream()`, `reset()` |
| `useDreamReconstruction` | `@/lib/ai/hooks` | `reconstruct(input)`, `quickReconstruct(text)` |
| `useDreamInterpretation` | `@/lib/ai/hooks` | `interpret(input)`, `quickInterpret(reconstruction)` |
| `useMovieGeneration` | `@/lib/ai/hooks` | `generate(input)`, `generateSingleScene(...)`, `getStyles()` |
| `useDreamAnalytics` | `@/lib/ai/hooks` | `analyze(input)`, `getSymbolFrequency(dreams, ...)`, etc. |
| `useAlternateEnding` | `@/lib/ai/hooks` | `generate(input)`, `generateAll(...)`, `getModes()` |
| `useMonthlyReport` | `@/lib/ai/hooks` | `generate(input)`, `reset()` |

### Example: Dream Capture + Recall Flow

```tsx
import { useDreamRecall, useDreamReconstruction } from "@/lib/ai/hooks";

function DreamCapture() {
  const recall = useDreamRecall();
  const reconstruction = useDreamReconstruction();

  const handleStart = async () => {
    await recall.startRecall();
  };

  const handleAnswer = async (text: string) => {
    await recall.submitAnswer(text);
    if (recall.isComplete) {
      // Auto-reconstruct when recall is done
      await reconstruction.quickReconstruct(recall.rawTranscript);
    }
  };

  if (reconstruction.data) {
    return <DreamStory dream={reconstruction.data} />;
  }

  return (
    <div>
      <p>{recall.currentQuestion}</p>
      <input onSubmit={(e) => handleAnswer(e.target.value)} />
    </div>
  );
}
```

---

## Cost & Token Tracking

Every pipeline function returns an `AIResponse<T>` that includes `tokenUsage`:

```ts
interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number; // Estimated USD
}
```

**Cost optimization tips:**
- Use `gpt-4o-mini` for simple tasks (recall questions, summaries) — 94% cheaper than `gpt-4o`
- Use deterministic analytics functions (`computeSymbolFrequency`, etc.) — they cost nothing
- Batch alternate endings with `generateAllEndings()` — saves on shared context
- Use streaming for a better UX without extra cost

**Estimated costs per operation:**

| Operation | Model | Est. Cost |
|-----------|-------|-----------|
| Recall question | `gpt-4o-mini` | ~$0.001 |
| Dream reconstruction | `gpt-4o` | ~$0.03-0.08 |
| Full interpretation | `gpt-4o` | ~$0.05-0.15 |
| Movie storyboard (5 scenes) | `gpt-4o` | ~$0.08-0.20 |
| Monthly report | `gpt-4o` | ~$0.10-0.25 |

---

## Error Handling

All pipeline functions return `AIResponse<T>`:

```ts
interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokenUsage?: TokenUsage;
}
```

Always check `result.success` before using `result.data`:

```ts
const result = await reconstructDream(input);
if (!result.success) {
  console.error("Reconstruction failed:", result.error);
  // Handle error (e.g., show toast, retry button)
  return;
}
// Use result.data safely
```

### AIPipelineError

For programmatic error handling:

```ts
import { AIPipelineError } from "@/types/ai";

try {
  await reconstructDream(input);
} catch (err) {
  if (err instanceof AIPipelineError) {
    console.error(`[${err.provider}] ${err.pipeline}: ${err.message}`);
    if (err.recoverable) {
      // Retry with backoff
    }
  }
}
```

---

## Testing Guide

### Quick Test Script

```ts
// test-ai-pipeline.ts — run with: npx tsx test-ai-pipeline.ts
import { startRecallSession } from "@/lib/ai/recall-assistant";
import { reconstructDream } from "@/lib/ai/dream-reconstruction";
import { interpretDream } from "@/lib/ai/interpretation";

async function main() {
  // Test 1: Recall Session
  console.log("Testing recall session...");
  const recall = await startRecallSession();
  console.log("Q:", recall.data?.question.question);

  // Test 2: Reconstruction
  console.log("Testing reconstruction...");
  const recon = await reconstructDream({
    rawTranscript: "I was flying over a city at night. The buildings were made of glass.",
  });
  console.log("Reconstructed:", recon.data?.summary);

  // Test 3: Interpretation
  console.log("Testing interpretation...");
  if (recon.data) {
    const interp = await interpretDream({ dreamReconstruction: recon.data });
    console.log("Insights:", interp.data?.insights.length, "perspectives");
  }
}

main().catch(console.error);
```

### Mocking the AI Client

For unit tests, mock `@/lib/ai/client`:

```ts
jest.mock("@/lib/ai/client", () => ({
  chat: jest.fn().mockResolvedValue({
    content: JSON.stringify({ summary: "Test" }),
    tokenUsage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, cost: 0.001 },
  }),
  chatStructured: jest.fn().mockResolvedValue({
    data: { summary: "Test", story: "..." },
    tokenUsage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, cost: 0.001 },
  }),
}));
```

---

## FAQ & Troubleshooting

### Q: Why do my pipeline calls fail with "401 Authentication Error"?
A: Your API key is missing or invalid. Check that `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`) is set in `.env.local`.

### Q: Can I use Anthropic instead of OpenAI?
A: Yes. Pass `{ provider: "anthropic", model: "claude-3-sonnet-20240229" }` in the config parameter of any pipeline function.

### Q: How do I handle rate limiting?
A: The `AIPipelineError` has a `recoverable` flag set to `true` for 429 (rate limit) and 5xx errors. Implement exponential backoff:

```ts
if (err instanceof AIPipelineError && err.recoverable) {
  await delay(1000 * Math.pow(2, retryCount));
  return tryAgain();
}
```

### Q: Are pattern analytics safe to call on every page load?
A: **Yes!** The deterministic functions (`computeSymbolFrequency`, `computeEmotionCorrelations`, etc.) run entirely in the browser with no API calls. Only `computePatternAnalytics()` uses the API for AI-generated insights.

### Q: The structured output returned `{}` empty data
A: This can happen with Anthropic (which lacks native JSON mode). The client automatically tries to extract JSON with a regex fallback. If it still fails, try switching to OpenAI which has native `response_format: json_object` support.

### Q: How do I reset a hook's state?
A: Every hook exposes a `reset()` function that clears `data`, `isLoading`, and `error`.

### Q: What's the difference between `src/lib/hooks/` and `src/lib/ai/hooks/`?
A: Both contain the same hook logic. The canonical location is `src/lib/ai/hooks/` with camelCase file names. The `src/lib/hooks/` location uses kebab-case names and includes shared utilities. Import from `@/lib/ai/hooks` for consistency.

---

## Appendix: TypeScript Types

All types are defined in `src/types/ai.ts`. Key types:

- `AIProvider` — `"openai" | "anthropic"`
- `AIModel` — Supported model identifiers
- `RecallQuestion`, `RecallAnswer`, `RecallSessionState` — Recall session types
- `DreamReconstruction` — Structured dream narrative
- `DreamCharacter`, `DreamLocation`, `DreamTimeline` — Narrative sub-types
- `DreamInterpretation`, `InterpretationInsight`, `SymbolInterpretation` — Interpretation types
- `MovieGenerationInput`, `MovieGenerationOutput`, `ScenePrompt`, `Storyboard` — Movie types
- `AlternateEndingInput`, `AlternateEndingOutput` — Alternate ending types
- `SymbolFrequency`, `EmotionCorrelation`, `CharacterRecurrence`, `LocationAnalytics`, `MoodDreamCorrelation` — Analytics types
- `PatternAnalytics` — Full analytics result
- `MonthlyReport`, `MonthlyStat`, `MonthlyDreamSummary` — Report types
- `AIResponse<T>` — Generic response wrapper
- `AIPipelineError` — Error class with provider/pipeline/recoverable info

---

*Last updated: June 2026*
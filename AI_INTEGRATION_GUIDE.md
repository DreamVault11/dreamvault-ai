# DreamScape AI — AI Integration Guide

> *How frontend engineers use the AI pipeline system.*

---

## Getting Started

### 1. Environment Variables

Copy `.env.example` to `.env.local` in the project root:

```env
# === Required: AI Provider ===
# OpenAI is the default provider. Get your key at https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key

# === Optional: Alternative AI Provider ===
# Used as a fallback or alternative. Get your key at https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# === Supabase (Backend) ===
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# === Stripe (Payments) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 2. Required Packages

```bash
npm install openai @anthropic-ai/sdk
```

Verify in `package.json`:
- `"openai": "^6.42.0"`
- `"@anthropic-ai/sdk": "^0.102.0"`

---

## Importing Hooks

All hooks are available via a single barrel export:

```ts
import { useDreamRecall, useDreamReconstruction, useDreamInterpretation } from "@/lib/ai/hooks";
```

Or import individual types:

```ts
import { useMovieGeneration } from "@/lib/ai/hooks";
import type { UseMovieGenerationReturn } from "@/lib/ai/hooks";
```

---

## Hook API Reference

### 1. `useDreamRecall()` — Guided Dream Recall

Manages the full conversational recall session. Asks one question at a time across 7 categories.

```tsx
import { useDreamRecall } from "@/lib/ai/hooks";

function RecallFlow() {
  const {
    currentQuestion,      // The current question text
    answers,              // Array of all answers so far
    sessionState,         // Full session state (step, category, etc.)
    isComplete,           // Whether all 7 stages are done
    isLoading,            // Loading indicator
    error,                // Error message
    rawTranscript,        // Accumulated text from all answers

    startRecall,          // () => Promise<void> — start a new session
    submitAnswer,         // (text: string) => Promise<void> — answer current question
    reset,                // () => void — reset everything

    // Streaming mode
    startStream,          // () => Promise<void> — stream AI guidance
    streamingText,        // Real-time streamed text
    isStreaming,          // Whether stream is active
  } = useDreamRecall();

  useEffect(() => { startRecall(); }, []);

  if (isComplete) {
    return <ReconstructionView transcript={rawTranscript} />;
  }

  return (
    <div>
      {isLoading ? <Spinner /> : <p>{currentQuestion}</p>}
      <input onSubmit={(e) => submitAnswer(e.target.value)} />
      {error && <ErrorBanner message={error} />}
    </div>
  );
}
```

### 2. `useDreamReconstruction()` — Dream Reconstruction

Converts raw dream text into a structured narrative.

```tsx
import { useDreamReconstruction } from "@/lib/ai/hooks";

function ReconstructionView({ transcript }: { transcript: string }) {
  const { data, isLoading, error, quickReconstruct } = useDreamReconstruction();

  useEffect(() => {
    quickReconstruct(transcript);
  }, [transcript]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div>
      <h2>{data.summary}</h2>
      <p>{data.story}</p>
      <div>
        <h3>Characters</h3>
        {data.characters.map(c => <span key={c.name}>{c.name} ({c.role})</span>)}
      </div>
      <p>Completeness: {data.completenessScore}%</p>
    </div>
  );
}
```

**Key methods:**
```ts
reconstruct(input: ReconstructionInput)    // Full with recall answers
quickReconstruct(transcript: string)       // Just raw text
reset()                                    // Clear state
```

### 3. `useDreamInterpretation()` — Dream Interpretation

Returns 3 perspectives: Psychological, Symbolic, Archetypal.

```tsx
const { data, isLoading, interpret } = useDreamInterpretation();

await interpret({ dreamReconstruction: myReconstruction });

// data.insights — array of 3 perspectives
{data.insights.map(i => (
  <Accordion key={i.perspective} title={i.title}>
    <p>{i.content}</p>
    {i.symbols.map(s => <span key={s.symbol}>{s.symbol}: {s.meaning}</span>)}
  </Accordion>
))}

// data.reflectionQuestions — 3-5 questions
// data.personalPatternInsights — if past dreams provided
```

### 4. `useMovieGeneration()` — Movie Storyboard

Generates scene-by-scene storyboard with detailed video prompts.

```tsx
const {
  data,                // MovieGenerationOutput | null
  generationState,     // "idle" | "generating" | "ready" | "failed"
  progress,            // 0–100
  error,
  generate,            // (input) => Promise
  generateSingleScene, // (...) => Promise<ScenePrompt>
  getStyles,           // () => MovieStyle[]
  reset,
} = useMovieGeneration();

const handleGenerate = async () => {
  await generate({
    dreamReconstruction: reconstruction,
    style: "fantasy",
    aspectRatio: "9:16",
    userPreferences: { musicGenre: "ambient" },
  });
};

// Show generation progress
if (generationState === "generating") {
  return <ProgressBar value={progress} />;
}

// Show storyboard
if (data) {
  return data.storyboard.scenes.map(scene => (
    <SceneCard key={scene.sceneNumber} prompt={scene.visualPrompt} />
  ));
}
```

### 5. `useDreamAnalytics()` — Pattern Analytics

Analyzes dreams over time.

```tsx
const { data, isLoading, analyze, getSymbolFrequency } = useDreamAnalytics();

// AI-powered analysis (makes API call for insights)
await analyze({ userId, dreams, dreamIds, dreamDates });

// Deterministic functions — NO API CALL, instant:
const symbols = getSymbolFrequency(dreams, dreamIds, dreamDates);
const emotions = getEmotionCorrelations(dreams);
const characters = getCharacterRecurrence(dreams, dreamIds);
const locations = getLocationPatterns(dreams, dreamIds);
const moods = getMoodCorrelations(dreams);
```

**All 5 deterministic functions are safe to call on every render** — they run locally in the browser.

### 6. `useAlternateEnding()` — Alternate Endings

Generates alternate dream endings.

```tsx
const { data, isLoading, generate, generateAll, getModes, allEndings } = useAlternateEnding();

// Single ending
await generate({
  dreamReconstruction: reconstruction,
  endingType: "face-the-threat",
  originalDream: reconstruction.story,
});

// All 5 AI modes at once
await generateAll(reconstruction, reconstruction.story);

// Get modes for UI selector
const modes = getModes();
// [{ value: "continue-dream", label: "Continue Dream", icon: "▶️", ... }, ...]
```

### 7. `useMonthlyReport()` — Monthly Report

Generates comprehensive monthly dream reports.

```tsx
const { data, isLoading, generate } = useMonthlyReport();

await generate({
  userId,
  month: "2026-06",
  dreams,
  dreamIds,
  dreamDates,
});

// data.summary — total dreams, avg completeness, longest streak, etc.
// data.stats — array of labeled stats
// data.chartData — emotionsOverTime, symbolsOverTime, completenessTrend
// data.emotionalJourney — AI narrative
// data.insightsAndPatterns — AI analysis
// data.recommendation — one-sentence advice
```

---

## Error Handling Patterns

### Pattern A: Check `success` flag

```ts
const result = await reconstructDream(input);
if (!result.success) {
  toast.error(result.error || "Something went wrong");
  return;
}
// Use result.data
```

### Pattern B: Hook error state

```ts
const { data, isLoading, error, generate } = useDreamReconstruction();

if (error) {
  return <ErrorCard message={error} onRetry={() => generate(input)} />;
}
```

### Pattern C: AIPipelineError (advanced)

```ts
import { AIPipelineError } from "@/types/ai";

try {
  await generateMovieStoryboard(input);
} catch (err) {
  if (err instanceof AIPipelineError) {
    console.error(`[${err.provider}] ${err.pipeline}: ${err.message}`);
    if (err.recoverable) {
      // Show "Retry" button or auto-retry with backoff
    }
  }
}
```

---

## Streaming in the UI

For real-time recall guidance, use the streaming mode of `useDreamRecall`:

```tsx
function StreamingRecall() {
  const { startStream, streamingText, isStreaming, submitAnswer } = useDreamRecall();

  return (
    <div>
      <div className="streaming-text">
        {streamingText}
        {isStreaming && <BlinkingCursor />}
      </div>
      {!isStreaming && streamingText && (
        <input
          placeholder="Type your answer..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitAnswer(e.target.value);
          }}
        />
      )}
      <button onClick={startStream} disabled={isStreaming}>
        {isStreaming ? 'Speaking...' : 'Start Recall'}
      </button>
    </div>
  );
}
```

---

## Cost Optimization Tips

| Practice | Why |
|----------|-----|
| Prefer `gpt-4o-mini` for recall questions | $0.00015/1K input vs $0.0025 — 16x cheaper |
| Use deterministic analytics instead of AI | `computeSymbolFrequency()` costs $0; `analyze()` costs ~$0.02-0.05 |
| Batch alternate endings with `generateAll()` | Single context shared across 5 modes saves tokens |
| Only call `analyze()` on dashboard mount, not every render | AI insights are cached; no need to regenerate |
| Use `quickReconstruct` for initial preview, full `reconstruct` only when needed | Quick uses less context |
| Enable streaming for long operations | Users perceive lower latency even if same cost |

---

## Development & Mocking

### Mock AI Client (for development without API keys)

Create `src/lib/ai/__mocks__/client.ts`:

```ts
export const chat = jest.fn().mockResolvedValue({
  content: JSON.stringify({ summary: "Mock dream summary" }),
  tokenUsage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, cost: 0.001 },
});

export const chatStructured = jest.fn().mockResolvedValue({
  data: {
    summary: "Mock dream",
    story: "A mock dream for testing.",
    keySymbols: ["test"],
    emotionalThemes: ["curiosity"],
    characters: [{ name: "Unknown", role: "protagonist", description: "A person" }],
    locations: [{ name: "Room", description: "A room" }],
    timeline: [{ scene: "Testing", order: 0 }],
    sensoryDetails: [],
    completenessScore: 50,
    estimatedDuration: { min: 5, max: 10 },
  },
  tokenUsage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, cost: 0.001 },
});
```

### Feature Flags

Add a simple flag to bypass AI calls in dev:

```ts
const USE_MOCK_AI = process.env.NEXT_PUBLIC_USE_MOCK_AI === "true";

if (USE_MOCK_AI) {
  return mockData;
}
return await reconstructDream(input);
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Calling `analyze()` instead of `getSymbolFrequency()` for simple counts | Use deterministic functions — they're zero-cost |
| Not checking `result.success` before accessing `result.data` | Always check; `data` is undefined on failure |
| Forgetting to call `reset()` before reusing a hook | Call `reset()` when component unmounts or before a new generation |
| Using wrong import path | Use `@/lib/ai/hooks` (with barrel export) |
| Not setting `OPENAI_API_KEY` in `.env.local` | Copy `.env.example` → `.env.local` and fill in keys |
| Using `gpt-4o` for simple tasks | Use `gpt-4o-mini` (configurable via `model` in hook internals) |

---

## Quick Reference

| Task | Hook / Function | Import From |
|------|----------------|-------------|
| Start guided recall | `useDreamRecall().startRecall()` | `@/lib/ai/hooks` |
| Answer recall question | `useDreamRecall().submitAnswer(text)` | `@/lib/ai/hooks` |
| Reconstruct dream | `useDreamReconstruction().reconstruct(input)` | `@/lib/ai/hooks` |
| Interpret dream | `useDreamInterpretation().interpret(input)` | `@/lib/ai/hooks` |
| Generate movie | `useMovieGeneration().generate(input)` | `@/lib/ai/hooks` |
| Generate alternate ending | `useAlternateEnding().generate(input)` | `@/lib/ai/hooks` |
| Get symbol frequency | `useDreamAnalytics().getSymbolFrequency(...)` | `@/lib/ai/hooks` |
| Get emotion correlations | `useDreamAnalytics().getEmotionCorrelations(dreams)` | `@/lib/ai/hooks` |
| Run full analytics | `useDreamAnalytics().analyze(input)` | `@/lib/ai/hooks` |
| Generate monthly report | `useMonthlyReport().generate(input)` | `@/lib/ai/hooks` |
| Make direct AI call | `chat(messages, config)` | `@/lib/ai/client` |
| Get structured JSON | `chatStructured<T>(messages, config)` | `@/lib/ai/client` |
| Stream AI response | `chatStream(messages, callback, config)` | `@/lib/ai/client` |

*Last updated: June 2026*
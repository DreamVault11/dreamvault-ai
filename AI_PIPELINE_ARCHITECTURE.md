# DreamScape AI — AI Pipeline Architecture

> *Architectural overview of the AI/ML pipeline system — from dream capture to cinematic movie generation.*

---

## 1. System Overview

DreamScape AI's AI pipeline transforms raw, forgotten dreams into cinematic movies, guided recall sessions, and personal dream universes. The system consists of **7 interconnected pipelines**, each powered by a dual-provider AI client (OpenAI / Anthropic).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DREAM FLOW                                        │
│                                                                             │
│  Dream Capture                                                              │
│  (Text / Voice)                                                             │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐     ┌────────────────────┐     ┌─────────────────┐   │
│  │  1. Guided Recall│────▶│ 2. Dream            │────▶│ 3. Interpretation│  │
│  │  (Conversational │     │    Reconstruction   │     │     Engine       │  │
│  │   AI, 7 stages)  │     │    (Structured      │     │ (3 perspectives) │  │
│  └──────────────────┘     │     Narrative)      │     └────────┬────────┘   │
│                           └────────┬───────────┘              │            │
│                                    │                          │            │
│                                    ▼                          │            │
│                           ┌──────────────────┐               │            │
│                           │ 4. Movie           │               │            │
│                           │    Generation      │               │            │
│                           │ (Storyboard +      │               │            │
│                           │  Video Prompts)    │               │            │
│                           └────────┬──────────┘               │            │
│                                    │                          │            │
│                                    ▼                          ▼            │
│                           ┌──────────────────┐     ┌─────────────────┐   │
│                           │ 5. Alternate      │     │ 6. Pattern       │   │
│                           │    Endings        │     │    Analytics     │   │
│                           │ (6 modes)        │     │ (Deterministic   │   │
│                           └──────────────────┘     │  + AI Insights)  │   │
│                                                     └────────┬────────┘   │
│                                                              │            │
│                                                              ▼            │
│                                                     ┌─────────────────┐   │
│                                                     │ 7. Monthly       │   │
│                                                     │    Report        │   │
│                                                     │ (Stats + Charts  │   │
│                                                     │  + AI Narrative) │   │
│                                                     └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Provider Abstraction

Both OpenAI and Anthropic are supported through a unified client in `src/lib/ai/client.ts`.

### Client Architecture

```
┌──────────────────────┐
│   AI Client Config   │
│  ┌────────────────┐  │
│  │ provider:      │  │
│  │ "openai" |    │  │
│  │ "anthropic"  │  │
│  │ model:       │  │
│  │ temperature  │  │
│  │ maxTokens    │  │
│  │ streaming    │  │
│  └────────────────┘  │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌──────────┐
│ OpenAI  │ │ Anthropic │
│ Client  │ │  Client   │
│(chat,   │ │(messages, │
│stream,  │ │ stream,   │
│json)    │ │json-fallback)
└─────────┘ └──────────┘
```

### Core Client Functions

| Function | Description |
|----------|-------------|
| `chat(messages, config)` | Standard chat completion returns content + token usage |
| `chatStream(messages, onChunk, config)` | Streaming chat with real-time deltas |
| `chatStructured<T>(messages, config)` | JSON mode / structured output (OpenAI native, Anthropic via instruction + regex fallback) |

### Features
- **Lazy initialization** — API clients created only on first use
- **Token tracking** — Every response returns `inputTokens`, `outputTokens`, `totalTokens`, and estimated `cost` (USD)
- **Cost estimation** — Built-in rates for all supported models
- **Error classification** — `AIPipelineError` with `provider`, `pipeline`, and `recoverable` flag

---

## 3. Data Flow Detail

### Stage 1: Guided Dream Recall
- **Input**: User starts session
- **Process**: AI asks 1 question at a time across 7 categories
  1. Location → 2. People → 3. Sensory → 4. Emotion → 5. Story → 6. Symbol → 7. Wake-up
- **Output**: `RecallSessionState` with all answers and accumulated raw transcript
- **Model**: `gpt-4o-mini` (low cost, fast)
- **Streaming**: Optional real-time question display via `chatStream()`

### Stage 2: Dream Reconstruction
- **Input**: Raw transcript + optional recall answers
- **Process**: AI extracts structured narrative with characters, locations, timeline, symbols, emotions
- **Output**: `DreamReconstruction` object
- **Model**: `gpt-4o` (higher quality for structured extraction)

### Stage 3: Dream Interpretation
- **Input**: `DreamReconstruction` + optional past dreams
- **Process**: AI generates 3 perspectives (Psychological, Symbolic, Archetypal) + reflection questions + pattern insights
- **Output**: `DreamInterpretation`
- **Model**: `gpt-4o` (needs nuanced understanding)

### Stage 4: Movie Generation
- **Input**: `DreamReconstruction` + style + aspect ratio
- **Process**: AI generates scene-by-scene storyboard with detailed visual prompts suitable for any video AI
- **Output**: `MovieGenerationOutput` with storyboard, narration prompt
- **Styles**: Cinematic, Realistic, Fantasy, Surreal, Horror, Sci-Fi, Animated
- **Aspect Ratios**: 9:16 (mobile), 16:9 (widescreen)

### Stage 5: Alternate Endings
- **Input**: `DreamReconstruction` + ending mode
- **Process**: AI generates alternate narrative with 6 possible modes
- **Modes**: Continue Dream, Face The Threat, Explore The Door, Change The Ending, AI Surprise, Write Custom
- **Output**: `AlternateEndingOutput` with narrative + scene breakdown

### Stage 6: Pattern Analytics
- **Input**: Array of past `DreamReconstruction` objects
- **Process**: **Deterministic computation** (no API call) for symbol frequency, emotion correlations, character recurrence, location patterns, mood correlations. AI used only for generating human-readable insights.
- **Output**: `PatternAnalytics`

### Stage 7: Monthly Report
- **Input**: Array of dreams + metadata
- **Process**: Compute stats deterministically, then AI generates narrative sections (emotional journey, insights, recommendation)
- **Output**: `MonthlyReport` with stats, chart data, narratives

---

## 4. Streaming Patterns

The system supports two streaming patterns:

### Pattern A: AI Streaming (chatStream)
Used for real-time recall conversation display.

```ts
const tokenUsage = await chatStream(
  messages,
  (chunk) => {
    // Each chunk.delta is appended to the UI
    if (chunk.finishReason === "stop") { /* done */ }
  },
  { streaming: true }
);
```

### Pattern B: Progress Tracking (useMovieGeneration)
Used for longer operations like movie generation.

```ts
const { generationState, progress, generate } = useMovieGeneration();
// generationState: "idle" → "generating" → "ready" | "failed"
// progress: 0 → 100
```

---

## 5. Directory Structure

```
src/
├── types/
│   └── ai.ts                      # All shared TypeScript types
└── lib/
    └── ai/
        ├── client.ts              # Shared AI client (OpenAI + Anthropic)
        ├── recall-assistant.ts    # 7-stage guided recall
        ├── dream-reconstruction.ts # Raw text → structured narrative
        ├── interpretation.ts      # 3-perspective interpretation
        ├── movie-generation.ts    # Storyboard generation
        ├── analytics.ts           # Pattern analytics (deterministic + AI)
        ├── alternate-endings.ts   # 6-mode ending generator
        ├── monthly-report.ts      # Monthly report generator
        └── hooks/                 # React hooks for all pipelines
            ├── useDreamRecall.ts
            ├── useDreamReconstruction.ts
            ├── useDreamInterpretation.ts
            ├── useMovieGeneration.ts
            ├── useDreamAnalytics.ts
            ├── useAlternateEnding.ts
            ├── useMonthlyReport.ts
            └── index.ts
```

---

## 6. Error Handling Strategy

All pipeline functions return `AIResponse<T>`:

```ts
interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokenUsage?: TokenUsage;
}
```

**Recoverable errors** (rate limits, server errors) are flagged:
```ts
if (err instanceof AIPipelineError && err.recoverable) {
  // Implement exponential backoff retry
}
```

---

## 7. Cost Optimization

| Strategy | Impact |
|----------|--------|
| Use `gpt-4o-mini` for recall questions | 94% cheaper than gpt-4o |
| Deterministic analytics functions | Zero API cost |
| Batch alternate endings with `generateAllEndings()` | Shared context across modes |
| Stream responses | No extra cost, better UX |

*Last updated: June 2026*
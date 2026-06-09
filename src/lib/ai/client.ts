// ============================================================
// DreamScape AI — Browser-safe AI Client
// This file is safe to import in client components.
// Server-only SDKs are dynamically imported only on the server.
// ============================================================

import type {
  AIProvider,
  AIModel,
  TokenUsage,
  StreamChunk,
  StreamCallback,
  AIPipelineError,
} from "@/types/ai";

// ── Configuration ─────────────────────────────────────────
export interface AIClientConfig {
  provider: AIProvider;
  model: AIModel;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  apiKey?: string;
}

const DEFAULT_CONFIG: AIClientConfig = {
  provider: "openai",
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4096,
  streaming: false,
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ── Lazy-loaded SDKs (server only) ───────────────────────
let _OpenAI: any = null;
let _Anthropic: any = null;

async function getSDKs() {
  if (typeof window !== 'undefined') {
    // Client side - return null, AI calls go through API routes
    return { openai: null, anthropic: null };
  }
  // Server side - dynamically import
  if (!_OpenAI) {
    const openaiMod = await import("openai");
    _OpenAI = openaiMod.default;
  }
  if (!_Anthropic) {
    const anthropicMod = await import("@anthropic-ai/sdk");
    _Anthropic = anthropicMod.default;
  }
  return { openai: _OpenAI, anthropic: _Anthropic };
}

// ── Standard Chat ────────────────────────────────────────
export async function chat(
  messages: ChatMessage[],
  config: Partial<AIClientConfig> = {}
): Promise<{ content: string; tokenUsage?: TokenUsage }> {
  const { openai } = await getSDKs();
  if (!openai) {
    throw new Error("AI client not available in browser - use API routes instead");
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const client = new openai({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: cfg.model,
    messages,
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
  });

  return {
    content: response.choices[0]?.message?.content || "",
    tokenUsage: {
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      cost: estimateCost(cfg.model, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0),
    },
  };
}

// ── Streaming Chat ───────────────────────────────────────
export async function chatStream(
  messages: ChatMessage[],
  onChunk: StreamCallback,
  config: Partial<AIClientConfig> = {}
): Promise<void> {
  const { openai } = await getSDKs();
  if (!openai) {
    throw new Error("AI client not available in browser - use API routes instead");
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const client = new openai({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await client.chat.completions.create({
    model: cfg.model,
    messages,
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    onChunk({
      delta: chunk.choices[0]?.delta?.content || "",
      finishReason: chunk.choices[0]?.finish_reason as any || null,
    });
  }
}

// ── Structured Output (JSON mode) ────────────────────────
export async function chatStructured<T>(
  messages: ChatMessage[],
  config: Partial<AIClientConfig> = {}
): Promise<{ data: T; tokenUsage?: TokenUsage }> {
  const { openai } = await getSDKs();
  if (!openai) {
    throw new Error("AI client not available in browser - use API routes instead");
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const client = new openai({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: cfg.model,
    messages,
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  return {
    data: JSON.parse(content) as T,
    tokenUsage: {
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      cost: estimateCost(cfg.model, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0),
    },
  };
}

// ── Cost Estimation ──────────────────────────────────────
const COST_TABLE: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "claude-3-opus-20240229": { input: 0.015, output: 0.075 },
  "claude-3-sonnet-20240229": { input: 0.003, output: 0.015 },
  "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = COST_TABLE[model];
  if (!rates) return 0;
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

// ── Available Models ─────────────────────────────────────
export function getAvailableModels(): { provider: AIProvider; model: AIModel }[] {
  return [
    { provider: "openai", model: "gpt-4o" },
    { provider: "openai", model: "gpt-4o-mini" },
    { provider: "openai", model: "gpt-4-turbo" },
    { provider: "anthropic", model: "claude-3-sonnet-20240229" },
    { provider: "anthropic", model: "claude-3-haiku-20240307" },
    { provider: "anthropic", model: "claude-3-opus-20240229" },
  ];
}
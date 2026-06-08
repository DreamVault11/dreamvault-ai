// ============================================================
// DreamScape AI — Shared AI Client Configuration
// Centralized client for OpenAI and Anthropic APIs.
// All pipeline modules import from here.
// ============================================================

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
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

// ── Client Instances (lazy init) ──────────────────────────
let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

function getOpenAI(apiKey?: string): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // allowed; API calls proxied through backend in prod
    });
  }
  return _openai;
}

function getAnthropic(apiKey?: string): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }
  return _anthropic;
}

// ── Token Cost Estimator ──────────────────────────────────
const COST_PER_1K: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "claude-3-opus-20240229": { input: 0.015, output: 0.075 },
  "claude-3-sonnet-20240229": { input: 0.003, output: 0.015 },
  "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 },
};

function estimateCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): number {
  const rates = COST_PER_1K[model];
  if (!rates) return 0;
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

// ── Core Chat Completion ──────────────────────────────────
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  config: Partial<AIClientConfig> = {}
): Promise<{ content: string; tokenUsage: TokenUsage }> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (cfg.provider === "openai") {
    return chatOpenAI(messages, cfg);
  } else {
    return chatAnthropic(messages, cfg);
  }
}

// ── Streaming Chat ────────────────────────────────────────
export async function chatStream(
  messages: ChatMessage[],
  onChunk: StreamCallback,
  config: Partial<AIClientConfig> = {}
): Promise<TokenUsage> {
  const cfg = { ...DEFAULT_CONFIG, ...config, streaming: true };

  if (cfg.provider === "openai") {
    return streamOpenAI(messages, onChunk, cfg);
  } else {
    return streamAnthropic(messages, onChunk, cfg);
  }
}

// ── Structured Output (JSON mode) ─────────────────────────
export async function chatStructured<T>(
  messages: ChatMessage[],
  config: Partial<AIClientConfig> = {}
): Promise<{ data: T; tokenUsage: TokenUsage }> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (cfg.provider === "openai") {
    return chatStructuredOpenAI<T>(messages, cfg);
  } else {
    return chatStructuredAnthropic<T>(messages, cfg);
  }
}

// ── OpenAI Implementations ────────────────────────────────
async function chatOpenAI(
  messages: ChatMessage[],
  config: AIClientConfig
): Promise<{ content: string; tokenUsage: TokenUsage }> {
  try {
    const client = getOpenAI(config.apiKey);
    const response = await client.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    const usage = response.usage;
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;

    return {
      content: response.choices[0]?.message?.content || "",
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        cost: estimateCost(config.model, inputTokens, outputTokens),
      },
    };
  } catch (error: any) {
    throw new AIPipelineError(
      `OpenAI chat failed: ${error.message}`,
      "openai",
      "chat",
      error.status === 429 || error.status >= 500
    );
  }
}

async function streamOpenAI(
  messages: ChatMessage[],
  onChunk: StreamCallback,
  config: AIClientConfig
): Promise<TokenUsage> {
  try {
    const client = getOpenAI(config.apiKey);
    const stream = await client.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    });

    let inputTokens = 0;
    let outputTokens = 0;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        onChunk({ delta, finishReason: null });
        outputTokens += delta.split(/\s+/).length;
      }

      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens || inputTokens;
        outputTokens = chunk.usage.completion_tokens || outputTokens;
      }

      if (chunk.choices[0]?.finish_reason) {
        onChunk({
          delta: "",
          finishReason:
            chunk.choices[0].finish_reason === "stop"
              ? "stop"
              : chunk.choices[0].finish_reason === "length"
              ? "length"
              : "error",
        });
      }
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      cost: estimateCost(config.model, inputTokens, outputTokens),
    };
  } catch (error: any) {
    throw new AIPipelineError(
      `OpenAI stream failed: ${error.message}`,
      "openai",
      "stream",
      true
    );
  }
}

async function chatStructuredOpenAI<T>(
  messages: ChatMessage[],
  config: AIClientConfig
): Promise<{ data: T; tokenUsage: TokenUsage }> {
  // Use response_format: json_object for structured output
  const responseFormat = {
    type: "json_object" as const,
  };

  // Add JSON instruction to system prompt
  const systemIndex = messages.findIndex((m) => m.role === "system");
  let enhancedMessages = [...messages];

  if (systemIndex >= 0) {
    enhancedMessages[systemIndex] = {
      ...enhancedMessages[systemIndex],
      content: `${
        enhancedMessages[systemIndex].content
      }\n\nYou MUST respond with valid JSON only. No markdown, no explanation.`,
    };
  } else {
    enhancedMessages.unshift({
      role: "system",
      content:
        "You are a helpful assistant. You MUST respond with valid JSON only. No markdown, no explanation.",
    });
  }

  try {
    const client = getOpenAI(config.apiKey);
    const response = await client.chat.completions.create({
      model: config.model,
      messages: enhancedMessages as any,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      response_format: responseFormat,
    });

    const usage = response.usage;
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;
    const content = response.choices[0]?.message?.content || "{}";

    let data: T;
    try {
      data = JSON.parse(content) as T;
    } catch {
      // If OpenAI fails to return valid JSON, attempt to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      data = jsonMatch ? (JSON.parse(jsonMatch[0]) as T) : ({} as T);
    }

    return {
      data,
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        cost: estimateCost(config.model, inputTokens, outputTokens),
      },
    };
  } catch (error: any) {
    throw new AIPipelineError(
      `OpenAI structured output failed: ${error.message}`,
      "openai",
      "structured",
      error.status === 429 || error.status >= 500
    );
  }
}

// ── Anthropic Implementations ─────────────────────────────
async function chatAnthropic(
  messages: ChatMessage[],
  config: AIClientConfig
): Promise<{ content: string; tokenUsage: TokenUsage }> {
  try {
    const client = getAnthropic(config.apiKey);
    const systemMsg = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await client.messages.create({
      model: config.model,
      system: systemMsg,
      messages: userMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
    });

    const inputTokens = response.usage?.input_tokens || 0;
    const outputTokens = response.usage?.output_tokens || 0;

    const content =
      response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as any).text)
        .join("") || "";

    return {
      content,
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        cost: estimateCost(config.model, inputTokens, outputTokens),
      },
    };
  } catch (error: any) {
    throw new AIPipelineError(
      `Anthropic chat failed: ${error.message}`,
      "anthropic",
      "chat",
      error.status === 429 || error.status >= 500
    );
  }
}

async function streamAnthropic(
  messages: ChatMessage[],
  onChunk: StreamCallback,
  config: AIClientConfig
): Promise<TokenUsage> {
  try {
    const client = getAnthropic(config.apiKey);
    const systemMsg = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const stream = await client.messages.create({
      model: config.model,
      system: systemMsg,
      messages: userMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
      stream: true,
    });

    let inputTokens = 0;
    let outputTokens = 0;

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        onChunk({ delta: event.delta.text, finishReason: null });
        outputTokens += event.delta.text.split(/\s+/).length;
      }
      if (event.type === "message_delta") {
        if (event.delta.stop_reason) {
          onChunk({
            delta: "",
            finishReason:
              event.delta.stop_reason === "end_turn" ? "stop" : "length",
          });
        }
        if (event.usage) {
          outputTokens = event.usage.output_tokens || outputTokens;
        }
      }
      if (event.type === "message_start" && event.message.usage) {
        inputTokens = event.message.usage.input_tokens || 0;
      }
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      cost: estimateCost(config.model, inputTokens, outputTokens),
    };
  } catch (error: any) {
    throw new AIPipelineError(
      `Anthropic stream failed: ${error.message}`,
      "anthropic",
      "stream",
      true
    );
  }
}

async function chatStructuredAnthropic<T>(
  messages: ChatMessage[],
  config: AIClientConfig
): Promise<{ data: T; tokenUsage: TokenUsage }> {
  // Anthropic doesn't have native JSON mode.
  // We instruct it strongly in the system prompt.
  const systemIndex = messages.findIndex((m) => m.role === "system");
  let enhancedMessages = [...messages];

  const jsonInstruction =
    "\n\nYou MUST respond with valid JSON only. No markdown, no explanation. Return ONLY a raw JSON object.";

  if (systemIndex >= 0) {
    enhancedMessages[systemIndex] = {
      ...enhancedMessages[systemIndex],
      content: enhancedMessages[systemIndex].content + jsonInstruction,
    };
  } else {
    enhancedMessages.unshift({
      role: "system",
      content: `You are a helpful assistant.${jsonInstruction}`,
    });
  }

  const result = await chatAnthropic(enhancedMessages, config);

  let data: T;
  try {
    data = JSON.parse(result.content) as T;
  } catch {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    data = jsonMatch ? (JSON.parse(jsonMatch[0]) as T) : ({} as T);
  }

  return { data, tokenUsage: result.tokenUsage };
}

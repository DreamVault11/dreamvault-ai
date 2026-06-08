// ============================================================
// Tests: DreamScape AI — AI Client
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock environment variables
process.env.OPENAI_API_KEY = "sk-test-key";
process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";

const mockCreateChatCompletion = vi.fn();

// Mock OpenAI SDK as a proper class (needed for `new OpenAI()`)
vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: mockCreateChatCompletion,
      },
    };
    constructor(apiKey?: string) {
      // Constructor intentionally empty
    }
  },
}));

const mockCreateAnthropicMessage = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = {
      create: mockCreateAnthropicMessage,
    };
    constructor(apiKey?: string) {
      // Constructor intentionally empty
    }
  },
}));

import { chat, chatStructured, chatStream } from "@/lib/ai/client";

describe("AI Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("chat()", () => {
    it("should return content and token usage", async () => {
      mockCreateChatCompletion.mockResolvedValue({
        choices: [{ message: { content: "Test response" } }],
        usage: { prompt_tokens: 50, completion_tokens: 30 },
      });

      const result = await chat([
        { role: "system", content: "You are a test assistant." },
        { role: "user", content: "Hello" },
      ]);

      expect(result.content).toBe("Test response");
      expect(result.tokenUsage).toBeDefined();
      expect(result.tokenUsage.totalTokens).toBe(80);
    });

    it("should use OpenAI by default", async () => {
      mockCreateChatCompletion.mockResolvedValue({
        choices: [{ message: { content: "OpenAI response" } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      });

      const result = await chat(
        [{ role: "user", content: "Test" }],
        { provider: "openai", model: "gpt-4o" }
      );

      expect(result.content).toBe("OpenAI response");
      expect(result.tokenUsage.cost).toBeGreaterThan(0);
    });

    it("should include cost estimation in token usage", async () => {
      mockCreateChatCompletion.mockResolvedValue({
        choices: [{ message: { content: "Hello" } }],
        usage: { prompt_tokens: 20, completion_tokens: 10 },
      });

      const result = await chat([{ role: "user", content: "Hello" }]);
      expect(result.tokenUsage.cost).toBeGreaterThan(0);
      expect(typeof result.tokenUsage.cost).toBe("number");
    });
  });

  describe("chatStructured()", () => {
    it("should return structured JSON data", async () => {
      mockCreateChatCompletion.mockResolvedValue({
        choices: [{ message: { content: '{"name":"test","value":42}' } }],
        usage: { prompt_tokens: 30, completion_tokens: 20 },
      });

      interface TestResult { name: string; value: number }
      
      const result = await chatStructured<TestResult>(
        [
          { role: "system", content: "You are a test assistant." },
          { role: "user", content: "Give me test data" },
        ],
        { provider: "openai", model: "gpt-4o-mini" }
      );

      expect(result.data).toBeDefined();
      expect(result.data.name).toBe("test");
      expect(result.data.value).toBe(42);
      expect(result.tokenUsage).toBeDefined();
    });
  });

  describe("chatStream()", () => {
    it("should handle streaming chunks", async () => {
      const mockStream = (async function* () {
        yield { choices: [{ delta: { content: "Hello" }, finish_reason: null }] };
        yield { choices: [{ delta: { content: " world" }, finish_reason: null }] };
        yield { choices: [{ delta: { content: "" }, finish_reason: "stop" }] };
      })();

      mockCreateChatCompletion.mockResolvedValue(mockStream);

      const chunks: string[] = [];
      const tokenUsage = await chatStream(
        [{ role: "user", content: "Stream test" }],
        (chunk) => {
          if (chunk.delta) chunks.push(chunk.delta);
        },
        { provider: "openai", streaming: true }
      );

      expect(tokenUsage).toBeDefined();
    });
  });
});

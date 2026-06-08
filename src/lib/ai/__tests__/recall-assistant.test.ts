// ============================================================
// Tests: DreamScape AI — Recall Assistant
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the AI client
vi.mock("@/lib/ai/client", () => ({
  chatStructured: vi.fn().mockResolvedValue({
    data: { question: "Where did your dream take place?" },
    tokenUsage: { inputTokens: 30, outputTokens: 20, totalTokens: 50, cost: 0.0005 },
  }),
  chat: vi.fn().mockResolvedValue({
    content: "You were in a vast forest with towering trees and strange glowing plants.",
    tokenUsage: { inputTokens: 40, outputTokens: 30, totalTokens: 70, cost: 0.001 },
  }),
}));

import {
  startRecallSession,
  processRecallAnswer,
  summarizeRecall,
} from "@/lib/ai/recall-assistant";

describe("Recall Assistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startRecallSession()", () => {
    it("should start a recall session with a location question", async () => {
      const result = await startRecallSession();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.sessionState.currentStep).toBe(1);
      expect(result.data!.sessionState.category).toBe("location");
      expect(result.data!.question.question).toBeTruthy();
    });

    it("should initialize session with empty answers", async () => {
      const result = await startRecallSession();
      expect(result.data!.sessionState.answers).toEqual([]);
      expect(result.data!.sessionState.isComplete).toBe(false);
    });

    it("should have correct total steps (7 categories)", async () => {
      const result = await startRecallSession();
      expect(result.data!.sessionState.totalSteps).toBe(7);
    });
  });

  describe("processRecallAnswer()", () => {
    it("should process an answer and advance to next category", async () => {
      const session = await startRecallSession();
      const result = await processRecallAnswer(
        session.data!.sessionState,
        "I was in a dark forest."
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Should have moved to "people" category
      expect(result.data!.sessionState.currentStep).toBe(2);
      expect(result.data!.sessionState.answers.length).toBe(1);
      expect(result.data!.question.question).toBeTruthy();
    });

    it("should accumulate raw transcript from answers", async () => {
      const session = await startRecallSession();
      const result = await processRecallAnswer(
        session.data!.sessionState,
        "I was in a dark forest."
      );

      expect(result.data!.rawTranscript).toContain("dark forest");
    });
  });

  describe("summarizeRecall()", () => {
    it("should generate a summary from answers", async () => {
      const result = await summarizeRecall([
        {
          questionId: "q_1",
          category: "location",
          question: "Where?",
          answer: "A dark forest",
          timestamp: new Date().toISOString(),
        },
        {
          questionId: "q_2",
          category: "people",
          question: "Who?",
          answer: "A shadow figure",
          timestamp: new Date().toISOString(),
        },
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.summary).toBeTruthy();
      expect(result.data!.rawTranscript).toContain("dark forest");
    });
  });
});

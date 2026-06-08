// ============================================================
// DreamScape AI — Guided Dream Recall Assistant
// Conversational AI that helps users remember forgotten dream
// details. Asks one question at a time, adapting based on
// previous answers.
// ============================================================

import {
  RecallAssistantResponse,
  RecallQuestion,
  RecallAnswer,
  RecallSessionState,
  RecallQuestionCategory,
  AIResponse,
  AIPipelineError,
} from "@/types/ai";
import { chatStructured, chat } from "./client";

// ── Question Flow ─────────────────────────────────────────
// Progressive recall: location → people → sensory → emotion → story → symbol → wake-up
const QUESTION_CATEGORIES: RecallQuestionCategory[] = [
  "location",
  "people",
  "sensory",
  "emotion",
  "story",
  "symbol",
  "wake-up",
];

interface GeneratedQuestions {
  questions: { category: RecallQuestionCategory; text: string }[];
}

// ── Context Builder ───────────────────────────────────────
function buildRecallContext(answers: RecallAnswer[]): string {
  if (answers.length === 0) return "No details recalled yet.";

  return answers
    .map(
      (a) =>
        `[${a.category.toUpperCase()}] Q: ${a.question}\nA: ${a.answer}`
    )
    .join("\n\n");
}

function getCategoryLabel(category: RecallQuestionCategory): string {
  const labels: Record<RecallQuestionCategory, string> = {
    location: "Where the dream took place",
    people: "People in the dream",
    sensory: "Sensory details (sights, sounds, smells, touch, taste)",
    emotion: "Emotions felt during the dream",
    story: "What happened in the dream",
    symbol: "Symbolic elements or recurring motifs",
    "wake-up": "How you woke up and immediate feelings",
  };
  return labels[category];
}

// ── Generate Next Question ────────────────────────────────
async function generateQuestion(
  category: RecallQuestionCategory,
  context: string,
  currentStep: number,
  totalSteps: number
): Promise<RecallQuestion> {
  const systemPrompt = `You are a compassionate dream recall guide. Your role is to help someone remember their dream by asking gentle, evocative questions.

You ask ONE question at a time. The question should:
- Be open-ended and evocative (not yes/no)
- Use sensory-rich language to trigger memories
- Be warm and encouraging
- Match the current recall category: ${getCategoryLabel(category)}
- Adapt to what they've already shared

Current recall stage: Step ${currentStep} of ${totalSteps} (${category.toUpperCase()})
Previous context: ${context || "No previous answers yet."}

Generate ONE thoughtful question for this stage.`;

  const result = await chatStructured<{ question: string }>(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Ask me a question to help remember the "${category}" aspect of my dream.`,
      },
    ],
    {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.8,
    }
  );

  return {
    id: `q_${category}_${Date.now()}`,
    category,
    question: result.data.question,
    options: undefined,
  };
}

// ── Start Recall Session ──────────────────────────────────
export async function startRecallSession(): Promise<
  AIResponse<RecallAssistantResponse>
> {
  try {
    const question = await generateQuestion(
      "location",
      "",
      1,
      QUESTION_CATEGORIES.length
    );

    const sessionState: RecallSessionState = {
      sessionId: `recall_${Date.now()}`,
      currentStep: 1,
      totalSteps: QUESTION_CATEGORIES.length,
      category: "location",
      answers: [],
      isComplete: false,
    };

    return {
      success: true,
      data: {
        question,
        sessionState,
        rawTranscript: "",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to start recall session",
    };
  }
}

// ── Process Answer & Get Next Question ────────────────────
export async function processRecallAnswer(
  sessionState: RecallSessionState,
  answerText: string
): Promise<AIResponse<RecallAssistantResponse>> {
  try {
    // Record the current answer
    const previousQuestion = sessionState.answers.length > 0
      ? sessionState.answers[sessionState.answers.length - 1]
      : null;

    const newAnswer: RecallAnswer = {
      questionId: previousQuestion?.questionId || `q_init`,
      category: sessionState.category,
      question: previousQuestion?.question || "What do you remember?",
      answer: answerText,
      timestamp: new Date().toISOString(),
    };

    const updatedAnswers = [...sessionState.answers, newAnswer];
    const nextStep = sessionState.currentStep + 1;
    const context = buildRecallContext(updatedAnswers);
    const rawTranscript = updatedAnswers
      .map((a) => a.answer)
      .join(" ");

    // Check if session is complete
    if (nextStep > QUESTION_CATEGORIES.length) {
      const finalState: RecallSessionState = {
        ...sessionState,
        currentStep: nextStep,
        answers: updatedAnswers,
        isComplete: true,
      };

      return {
        success: true,
        data: {
          question: {
            id: "complete",
            category: "wake-up",
            question: "Thank you for sharing your dream. Would you like me to reconstruct the full story?",
          },
          sessionState: finalState,
          rawTranscript,
        },
      };
    }

    // Generate next question for the next category
    const nextCategory = QUESTION_CATEGORIES[nextStep - 1];
    const question = await generateQuestion(
      nextCategory,
      context,
      nextStep,
      QUESTION_CATEGORIES.length
    );

    const updatedState: RecallSessionState = {
      ...sessionState,
      currentStep: nextStep,
      category: nextCategory,
      answers: updatedAnswers,
    };

    return {
      success: true,
      data: {
        question,
        sessionState: updatedState,
        rawTranscript,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to process answer",
    };
  }
}

// ── Generate a Summary of Recall Session ──────────────────
export async function summarizeRecall(
  answers: RecallAnswer[]
): Promise<AIResponse<{ summary: string; rawTranscript: string }>> {
  try {
    const context = buildRecallContext(answers);
    const rawTranscript = answers.map((a) => a.answer).join(" ");

    const result = await chat(
      [
        {
          role: "system",
          content:
            "You are a dream recall summarizer. Create a warm, flowing narrative summary of the dream based on the recalled details. Write in first-person as if the dreamer is telling their story. Be poetic but accurate to what was shared.",
        },
        {
          role: "user",
          content: `Here are the recalled dream details:\n\n${context}\n\nCreate a flowing narrative summary.`,
        },
      ],
      {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.7,
      }
    );

    return {
      success: true,
      data: {
        summary: result.content,
        rawTranscript,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to summarize recall",
    };
  }
}
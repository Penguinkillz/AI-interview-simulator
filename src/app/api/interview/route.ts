import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import {
  EVALUATION_SYSTEM_PROMPT,
  FINAL_SUMMARY_SYSTEM_PROMPT,
  buildEvaluationUserPrompt,
  buildFinalSummaryUserPrompt,
} from "@/lib/rubric";
import {
  InterviewConfig,
  Question,
  QuestionEvaluation,
  QuestionResult,
  FinalSummary,
} from "@/lib/types";

type ApiAction = "generate-question" | "evaluate-answer" | "final-summary";

interface GenerateQuestionBody {
  action: "generate-question";
  config: InterviewConfig;
  previousQuestions: Question[];
}

interface EvaluateAnswerBody {
  action: "evaluate-answer";
  config: InterviewConfig;
  question: Question;
  answer: string;
}

interface FinalSummaryBody {
  action: "final-summary";
  config: InterviewConfig;
  results: QuestionResult[];
}

type RequestBody = GenerateQuestionBody | EvaluateAnswerBody | FinalSummaryBody;

function parseJsonSafely<T>(text: string): T {
  const raw = text.trim();

  // First try a direct parse.
  try {
    return JSON.parse(raw) as T;
  } catch (_) {
    // Continue to more tolerant parsing below.
  }

  // Some models wrap JSON in ```json ... ``` fences.
  const fenceMatch = raw.match(/```(?:json)?([\s\S]*?)```/i);
  const fenced = fenceMatch ? fenceMatch[1].trim() : raw;

  // Try to extract the substring between the first "{" and last "}".
  const firstBrace = fenced.indexOf("{");
  const lastBrace = fenced.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const sliced = fenced.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(sliced) as T;
    } catch (_) {
      // fall through
    }
  }

  throw new Error("Failed to parse LLM JSON. Try again.");
}

function buildQuestionPrompt(config: InterviewConfig, index: number): string {
  return [
    `You are acting as an interviewer.`,
    `Generate a single interview question for this candidate.`,
    "",
    `ROLE & CONTEXT:`,
    `- Role: ${config.role}`,
    `- Seniority: ${config.seniority}`,
    `- Interview type: ${config.interviewType}`,
    `- Skills / technologies: ${config.skills.join(", ") || "not specified"}`,
    "",
    `Question number: ${index + 1} of ${config.numQuestions}.`,
    "",
    `Return ONLY the question text, no numbering, no quotes, no commentary.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body || typeof (body as any).action !== "string") {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const action = (body as any).action as ApiAction;

    if (action === "generate-question") {
      const { config, previousQuestions } = body as GenerateQuestionBody;
      const nextIndex = previousQuestions.length;

      if (nextIndex >= config.numQuestions) {
        return NextResponse.json(
          { message: "All questions already generated" },
          { status: 400 }
        );
      }

      const prompt = buildQuestionPrompt(config, nextIndex);
      const content = await callLLM(prompt, { maxTokens: 200 });

      const question: Question = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        index: nextIndex,
        total: config.numQuestions,
        text: content.trim(),
      };

      return NextResponse.json(question);
    }

    if (action === "evaluate-answer") {
      const { config, question, answer } = body as EvaluateAnswerBody;
      const userPrompt = buildEvaluationUserPrompt({
        config,
        question: question.text,
        answer,
      });

      const content = await callLLM(userPrompt, {
        systemPrompt: EVALUATION_SYSTEM_PROMPT,
        maxTokens: 800,
        jsonMode: true,
      });

      const evaluation = parseJsonSafely<QuestionEvaluation>(content);
      return NextResponse.json(evaluation);
    }

    if (action === "final-summary") {
      const { config, results } = body as FinalSummaryBody;
      const userPrompt = buildFinalSummaryUserPrompt({ config, results });
      const content = await callLLM(userPrompt, {
        systemPrompt: FINAL_SUMMARY_SYSTEM_PROMPT,
        maxTokens: 600,
        jsonMode: true,
      });

      const summary = parseJsonSafely<FinalSummary>(content);
      return NextResponse.json(summary);
    }

    return NextResponse.json({ message: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("API /api/interview error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}


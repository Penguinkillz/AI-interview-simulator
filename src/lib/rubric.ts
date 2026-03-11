import { InterviewConfig, QuestionResult } from "./types";

export const EVALUATION_SYSTEM_PROMPT = `You are an expert technical interviewer helping a candidate practice for interviews.

You are evaluating written answers only. Follow these rules strictly:

- Always return a SINGLE JSON object.
- Do NOT include any markdown, code fences, commentary, or explanations.
- The JSON MUST match this exact TypeScript type:

{
  "score_overall": number,               // 0-100
  "scores": {
    "relevance": number,                 // 0-10
    "technical_correctness": number,     // 0-10
    "depth": number,                     // 0-10
    "communication": number,             // 0-10
    "seniority_fit": number             // 0-10
  },
  "feedback": {
    "summary": string,                   // 1-2 sentences
    "strengths": string[],               // bullet points
    "areas_for_improvement": string[],   // bullet points
    "suggested_improvements": string[]   // 3-6 short, actionable bullet points
  }
}

If the answer is empty or the user clearly skipped, give low scores and focus feedback on encouraging the candidate to attempt an answer next time.

SCORING RUBRIC:

1. Relevance
   - 0-3: Mostly off-topic or missing.
   - 4-6: Partially addresses the question but misses key aspects.
   - 7-8: Mostly on-topic with minor gaps.
   - 9-10: Direct, focused, and fully addresses the question.

2. Technical correctness
   - 0-3: Major misunderstandings or incorrect information.
   - 4-6: Mixed correctness with some important mistakes.
   - 7-8: Mostly correct with minor inaccuracies.
   - 9-10: Fully correct and precise.

3. Depth and completeness
   - 0-3: Very shallow, surface-level.
   - 4-6: Covers basics but lacks depth or edge cases.
   - 7-8: Shows good understanding and some edge cases or tradeoffs.
   - 9-10: Deep, comprehensive, and considers edge cases and real-world constraints.

4. Communication & structure
   - 0-3: Hard to follow, disorganized.
   - 4-6: Understandable but somewhat scattered or verbose.
   - 7-8: Clear, reasonably structured and concise.
   - 9-10: Very clear, well-structured, and concise with good sequencing.

5. Seniority expectation match
   - For interns/juniors, reward basic correctness, clarity, and willingness to reason.
   - For mid/senior, expect more depth, tradeoffs, and real-world awareness.

OVERALL SCORE:
- Use a 0-100 scale that roughly reflects the weighted combination of the 5 dimensions
  (technical correctness and depth can be slightly more important than the others).
`;

export function buildEvaluationUserPrompt(params: {
  config: InterviewConfig;
  question: string;
  answer: string;
}): string {
  const { config, question, answer } = params;

  return [
    `You are evaluating an interview answer.`,
    "",
    `ROLE & CONTEXT:`,
    `- Role: ${config.role}`,
    `- Seniority: ${config.seniority}`,
    `- Interview type: ${config.interviewType}`,
    `- Skills / technologies: ${config.skills.join(", ") || "not specified"}`,
    "",
    `QUESTION:`,
    question,
    "",
    `CANDIDATE ANSWER:`,
    answer || "(no answer provided)",
    "",
    `Now return the evaluation strictly as a JSON object with the required schema. Do not include any extra text.`,
  ].join("\n");
}

export const FINAL_SUMMARY_SYSTEM_PROMPT = `You are summarizing a full interview session.

Always return a SINGLE JSON object with this exact structure:

{
  "overallScore": number,          // 0-100
  "summaryText": string,           // 2-4 sentences
  "strengths": string[],           // top 3-5 strengths
  "areasToImprove": string[],      // top 3-5 areas to improve
  "roleSpecificAdvice": string     // tailored advice for this role + seniority
}

Do NOT include markdown, code fences, or commentary.
`;

export function buildFinalSummaryUserPrompt(params: {
  config: InterviewConfig;
  results: QuestionResult[];
}): string {
  const { config, results } = params;

  const serialized = results
    .map((r, index) => {
      return {
        index: index + 1,
        question: r.question.text,
        answer: r.answer,
        evaluation: r.evaluation,
      };
    })
    .map((o) => JSON.stringify(o))
    .join("\n");

  return [
    `Summarize the following interview.`,
    "",
    `ROLE & CONTEXT:`,
    `- Role: ${config.role}`,
    `- Seniority: ${config.seniority}`,
    `- Interview type: ${config.interviewType}`,
    `- Skills / technologies: ${config.skills.join(", ") || "not specified"}`,
    "",
    `PER-QUESTION RESULTS (one JSON object per line):`,
    serialized || "(no results)",
    "",
    `Now return the final summary strictly as a JSON object with the required schema.`,
  ].join("\n");
}


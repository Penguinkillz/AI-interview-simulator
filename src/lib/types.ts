export type Role =
  | "frontend-engineer"
  | "backend-engineer"
  | "fullstack-engineer"
  | "ml-engineer"
  | "data-scientist"
  | "product-manager";

export type SeniorityLevel = "intern" | "junior" | "mid" | "senior";

export type InterviewType = "coding" | "system-design" | "behavioral" | "mixed";

export interface InterviewConfig {
  role: Role;
  seniority: SeniorityLevel;
  skills: string[];
  interviewType: InterviewType;
  numQuestions: number;
}

export interface Question {
  id: string;
  index: number;
  total: number;
  text: string;
}

export interface QuestionEvaluationScores {
  relevance: number; // 0-10
  technical_correctness: number; // 0-10
  depth: number; // 0-10
  communication: number; // 0-10
  seniority_fit: number; // 0-10
}

export interface QuestionEvaluationFeedback {
  summary: string;
  strengths: string[];
  areas_for_improvement: string[];
  suggested_improvements: string[];
}

export interface QuestionEvaluation {
  score_overall: number; // 0-100
  scores: QuestionEvaluationScores;
  feedback: QuestionEvaluationFeedback;
}

export interface QuestionResult {
  question: Question;
  answer: string;
  evaluation: QuestionEvaluation | null;
}

export interface FinalSummary {
  overallScore: number;
  summaryText: string;
  strengths: string[];
  areasToImprove: string[];
  roleSpecificAdvice: string;
}

export interface ApiError {
  message: string;
}


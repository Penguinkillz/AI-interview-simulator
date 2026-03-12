"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MessageSquare,
  SkipForward,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FinalSummary,
  InterviewConfig,
  Question,
  QuestionEvaluation,
  QuestionResult,
} from "@/lib/types";

interface Props {
  config: InterviewConfig;
  onComplete(summary: FinalSummary, results: QuestionResult[]): void;
}

type Phase = "loading-question" | "answering" | "evaluating" | "done";

function scoreColor(v: number) {
  if (v >= 8) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function overallColor(v: number) {
  if (v >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

export function InterviewSession({ config, onComplete }: Props) {
  const [phase,           setPhase]           = useState<Phase>("loading-question");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer,          setAnswer]          = useState("");
  const [results,         setResults]         = useState<QuestionResult[]>([]);
  const [evaluation,      setEvaluation]      = useState<QuestionEvaluation | null>(null);
  const [error,           setError]           = useState<string | null>(null);

  const progressValue = useMemo(() => {
    const answered = results.length + (evaluation ? 1 : 0);
    return (answered / config.numQuestions) * 100;
  }, [results.length, evaluation, config.numQuestions]);

  const questionNumber = currentQuestion
    ? currentQuestion.index + 1
    : results.length + 1;

  async function fetchQuestion(previousQuestions: Question[]): Promise<Question | null> {
    try {
      setError(null);
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-question", config, previousQuestions }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(d?.message || "Failed to generate the next question.");
      }
      return (await res.json()) as Question;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate the next question.");
      return null;
    }
  }

  async function evaluateCurrentAnswer(
    question: Question,
    answerText: string
  ): Promise<QuestionEvaluation | null> {
    try {
      setError(null);
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate-answer", config, question, answer: answerText }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(d?.message || "Failed to evaluate your answer.");
      }
      return (await res.json()) as QuestionEvaluation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to evaluate your answer.");
      return null;
    }
  }

  async function fetchFinalSummary(allResults: QuestionResult[]): Promise<FinalSummary | null> {
    try {
      setError(null);
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "final-summary", config, results: allResults }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(d?.message || "Failed to generate final summary.");
      }
      return (await res.json()) as FinalSummary;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate final summary.");
      return null;
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setPhase("loading-question");
      const q = await fetchQuestion([]);
      if (cancelled) return;
      if (q) { setCurrentQuestion(q); setAnswer(""); setEvaluation(null); setPhase("answering"); }
    }
    void init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.role, config.seniority, config.interviewType, config.numQuestions]);

  const handleSubmit = async () => {
    if (!currentQuestion || !answer.trim()) {
      setError("Please type an answer before submitting.");
      return;
    }
    setPhase("evaluating");
    const ev = await evaluateCurrentAnswer(currentQuestion, answer);
    if (ev) setEvaluation(ev);
    setPhase("answering");
  };

  const advance = async (ans: string, ev: QuestionEvaluation | null) => {
    if (!currentQuestion) return;
    const updated = [...results, { question: currentQuestion, answer: ans, evaluation: ev }];
    setResults(updated); setEvaluation(null); setAnswer("");
    if (updated.length >= config.numQuestions) {
      setPhase("done");
      const summary = await fetchFinalSummary(updated);
      if (summary) onComplete(summary, updated);
      return;
    }
    setPhase("loading-question");
    const next = await fetchQuestion(updated.map((r) => r.question));
    if (next) { setCurrentQuestion(next); setPhase("answering"); }
  };

  const handleSkip         = () => advance("", null);
  const handleNextQuestion = () => advance(answer, evaluation);
  const disableActions     = phase === "loading-question" || phase === "evaluating";
  const isLastQuestion     = results.length + 1 >= config.numQuestions;
  const wordCount          = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      className="w-full max-w-3xl space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Session meta bar ──────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-border/60 bg-white px-5 py-4 shadow-sm dark:bg-card"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold capitalize text-foreground">
              {config.role.replace(/-/g, " ")}
            </span>
            <span className="text-xs text-border">·</span>
            <span className="text-sm capitalize text-muted-foreground">{config.seniority}</span>
            <Badge
              variant="outline"
              className="rounded-md border-indigo-300/50 bg-indigo-50/80 px-1.5 py-0 text-[11px] uppercase tracking-wide text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
              {config.interviewType}
            </Badge>
            {config.skills.slice(0, 4).map((s) => (
              <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {s}
              </span>
            ))}
            {config.skills.length > 4 && (
              <span className="text-[11px] text-muted-foreground">+{config.skills.length - 4}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold tabular-nums text-foreground">
                {questionNumber} / {config.numQuestions}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {Math.round(progressValue)}% done
              </p>
            </div>
            <div className="w-20">
              <Progress
                value={progressValue}
                className="h-1.5 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Error banner ──────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-5 py-4"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Something went wrong</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Question + answer card ────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm shadow-neutral-200/60 dark:bg-card dark:shadow-none">
          <CardHeader className="px-6 pt-6 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 ring-1 ring-indigo-400/30 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {questionNumber}
              </div>

              {/* Animate question text when it changes */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentQuestion?.id ?? "loading"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-medium leading-relaxed text-foreground"
                >
                  {phase === "loading-question" ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                      Generating question…
                    </span>
                  ) : (
                    currentQuestion?.text || "Waiting…"
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-5 px-6 pt-5 pb-6">
            {/* Answer area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Your answer
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={7}
                placeholder="Write your answer as you would in a real interview. Explain your reasoning, mention tradeoffs, and give concrete examples."
                disabled={disableActions || phase === "done"}
                className="resize-none rounded-xl border-border/70 bg-background text-sm leading-relaxed transition-shadow focus:shadow-[0_0_0_3px] focus:shadow-indigo-500/10"
              />
            </div>

            {/* Evaluation panel */}
            <AnimatePresence>
              {evaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <EvaluationPanel evaluation={evaluation} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <motion.button
                type="button"
                onClick={handleSkip}
                disabled={disableActions || phase === "done"}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip question
              </motion.button>

              <div className="flex items-center gap-2">
                {/* Evaluate button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={disableActions || phase === "done" || !answer.trim()}
                  whileHover={!disableActions && answer.trim() ? { y: -1 } : {}}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "border-indigo-300/60 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                  )}
                >
                  {phase === "evaluating" ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Evaluating…</>
                  ) : (
                    <><TrendingUp className="h-3.5 w-3.5" />Evaluate</>
                  )}
                </motion.button>

                {/* Next / Finish button */}
                <motion.button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={disableActions || !evaluation || phase === "done" || !answer.trim()}
                  whileHover={evaluation && answer.trim() ? { y: -1 } : {}}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200",
                    "bg-gradient-to-r from-indigo-600 to-purple-600",
                    "hover:from-indigo-500 hover:to-purple-500",
                    "shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/25",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  )}
                >
                  {isLastQuestion ? "Finish interview" : "Next question"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ── Evaluation panel ─────────────────────────────────────────── */
function EvaluationPanel({ evaluation }: { evaluation: QuestionEvaluation }) {
  const SUB_SCORES = [
    { label: "Relevance",  value: evaluation.scores.relevance             },
    { label: "Technical",  value: evaluation.scores.technical_correctness },
    { label: "Depth",      value: evaluation.scores.depth                 },
    { label: "Clarity",    value: evaluation.scores.communication         },
    { label: "Seniority",  value: evaluation.scores.seniority_fit         },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:border-indigo-500/15 dark:from-indigo-500/8 dark:to-purple-500/5">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-indigo-200/40 px-5 py-4 dark:border-indigo-500/10">
        <div>
          <p className="text-xs font-semibold text-foreground">AI Evaluation</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Relevance · Correctness · Depth · Communication · Seniority fit
          </p>
        </div>
        <div className="text-right">
          <p className={cn("text-3xl font-bold tabular-nums leading-none", overallColor(evaluation.score_overall))}>
            {Math.round(evaluation.score_overall)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">/100</p>
        </div>
      </div>

      {/* Sub-score grid */}
      <div className="grid grid-cols-5 divide-x divide-indigo-200/40 border-b border-indigo-200/40 dark:divide-indigo-500/10 dark:border-indigo-500/10">
        {SUB_SCORES.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
            <p className={cn("text-base font-bold tabular-nums leading-none", scoreColor(s.value))}>
              {Math.round(s.value)}
            </p>
            <p className="text-[10px] leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feedback accordion */}
      <Accordion type="single" collapsible defaultValue="feedback">
        <AccordionItem value="feedback" className="border-none">
          <AccordionTrigger className="px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:no-underline">
            Detailed feedback
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-xs">
              <p className="leading-relaxed text-foreground/80">
                {evaluation.feedback.summary}
              </p>

              {evaluation.feedback.strengths.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    What you did well
                  </p>
                  <ul className="space-y-1.5 pl-5">
                    {evaluation.feedback.strengths.map((s, i) => (
                      <li key={i} className="list-disc leading-relaxed text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.feedback.areas_for_improvement.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                    <XCircle className="h-3.5 w-3.5" />
                    What could be stronger
                  </p>
                  <ul className="space-y-1.5 pl-5">
                    {evaluation.feedback.areas_for_improvement.map((s, i) => (
                      <li key={i} className="list-disc leading-relaxed text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.feedback.suggested_improvements.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Concrete next steps
                  </p>
                  <ul className="space-y-1.5 pl-5">
                    {evaluation.feedback.suggested_improvements.map((s, i) => (
                      <li key={i} className="list-disc leading-relaxed text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InterviewConfig, FinalSummary, QuestionResult } from "@/lib/types";
import { InterviewConfigForm } from "@/components/InterviewConfigForm";
import { InterviewSession } from "@/components/InterviewSession";
import { FinalSummaryView } from "@/components/FinalSummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "config" | "session" | "summary";

const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: "config",  label: "Configure", desc: "Role, skills & format"    },
  { id: "session", label: "Interview", desc: "Answer questions live"    },
  { id: "summary", label: "Summary",   desc: "Scores & next steps"      },
];

const RUBRIC_ITEMS = [
  "Relevance to the question",
  "Technical correctness",
  "Depth & completeness",
  "Communication clarity",
  "Seniority-level fit",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const stepTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

export default function Home() {
  const [step,    setStep]    = useState<Step>("config");
  const [config,  setConfig]  = useState<InterviewConfig | null>(null);
  const [summary, setSummary] = useState<FinalSummary | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const handleStart = (c: InterviewConfig) => {
    setConfig(c); setSummary(null); setResults([]); setStep("session");
  };
  const handleCompleted = (s: FinalSummary, r: QuestionResult[]) => {
    setSummary(s); setResults(r); setStep("summary");
  };
  const handleRestart = () => {
    setStep("config"); setSummary(null); setResults([]); setConfig(null);
  };

  const currentIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="relative min-h-screen bg-background text-foreground">

      {/* ── Ambient gradient orbs ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-[300px] right-[5%] h-[700px] w-[700px] rounded-full bg-indigo-500/8 blur-[120px] dark:bg-indigo-500/12" />
        <div className="absolute bottom-[5%] -left-[200px] h-[600px] w-[600px] rounded-full bg-purple-500/6 blur-[100px] dark:bg-purple-600/10" />
        <div className="absolute top-[40%] left-[40%] h-[400px] w-[400px] rounded-full bg-indigo-400/4 blur-[80px] dark:bg-indigo-400/6" />
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Interview<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">AI</span>
            </span>
          </div>

          {/* Breadcrumb */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Progress">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-1 transition-all duration-300",
                    i < currentIdx  && "bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-transparent shadow-sm shadow-indigo-500/30",
                    i === currentIdx && "bg-indigo-50 text-indigo-600 ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-400 dark:ring-indigo-500/40",
                    i > currentIdx  && "bg-muted text-muted-foreground ring-border"
                  )}>
                    {i + 1}
                  </span>
                  <span className={cn(
                    "text-xs transition-colors duration-200",
                    i === currentIdx ? "font-medium text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="mx-1 text-xs text-border/80">›</span>
                )}
              </div>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[268px_1fr]">

          {/* ── Sidebar ───────────────────────────────────── */}
          <aside className="hidden lg:block">
            <motion.div
              className="sticky top-[72px] space-y-7"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Hero copy */}
              <motion.div variants={fadeUp} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-400">
                    AI Interview Practice
                  </p>
                </div>
                <h1 className="text-xl font-semibold leading-snug tracking-tight">
                  Practice.{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                    Get feedback.
                  </span>{" "}
                  Improve.
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Configure a session, answer questions, and receive structured
                  AI feedback with an overall performance summary.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Separator />
              </motion.div>

              {/* Steps */}
              <motion.div variants={fadeUp} className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                  Steps
                </p>
                <ol className="space-y-4">
                  {STEPS.map((s, i) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <span className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1 transition-all duration-300",
                        i < currentIdx  && "bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-transparent shadow-sm shadow-indigo-500/25",
                        i === currentIdx && "bg-indigo-50 text-indigo-600 ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-400 dark:ring-indigo-500/40",
                        i > currentIdx  && "bg-muted text-muted-foreground ring-border"
                      )}>
                        {i + 1}
                      </span>
                      <div>
                        <p className={cn(
                          "text-sm font-medium leading-none transition-colors",
                          i === currentIdx ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {s.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Separator />
              </motion.div>

              {/* Pro tip */}
              <motion.div
                variants={fadeUp}
                className="rounded-xl border border-indigo-200/60 bg-indigo-50/60 px-4 py-3.5 dark:border-indigo-500/15 dark:bg-indigo-500/5"
              >
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  Pro tip
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-indigo-700/70 dark:text-indigo-300/60">
                  Answer like it&apos;s a real interview. Mention tradeoffs, real constraints,
                  and concrete examples to score higher on depth and seniority fit.
                </p>
              </motion.div>

              {/* Rubric */}
              <motion.div variants={fadeUp} className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                  How you&apos;re scored
                </p>
                <ul className="space-y-2">
                  {RUBRIC_ITEMS.map((r) => (
                    <li key={r} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-indigo-500/60" />
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </aside>

          {/* ── Main ──────────────────────────────────────── */}
          <main className="min-w-0">
            {/* Mobile progress bar */}
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-500",
                    i <= currentIdx
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-border"
                  )}
                />
              ))}
              <span className="ml-2 shrink-0 text-xs capitalize text-muted-foreground">
                {step}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === "config" && (
                <motion.div key="config" {...stepTransition}>
                  <InterviewConfigForm onStart={handleStart} />
                </motion.div>
              )}
              {step === "session" && config && (
                <motion.div key="session" {...stepTransition}>
                  <InterviewSession config={config} onComplete={handleCompleted} />
                </motion.div>
              )}
              {step === "summary" && config && summary && (
                <motion.div key="summary" {...stepTransition}>
                  <FinalSummaryView
                    config={config}
                    summary={summary}
                    results={results}
                    onRestart={handleRestart}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { InterviewConfig, FinalSummary, QuestionResult } from "@/lib/types";
import { InterviewConfigForm } from "@/components/InterviewConfigForm";
import { InterviewSession } from "@/components/InterviewSession";
import { FinalSummaryView } from "@/components/FinalSummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "config" | "session" | "summary";

const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: "config",  label: "Configure",  desc: "Choose role, skills & format" },
  { id: "session", label: "Interview",  desc: "Answer questions in real time"  },
  { id: "summary", label: "Summary",    desc: "Review scores & next steps"     },
];

const RUBRIC_ITEMS = [
  "Relevance to the question",
  "Technical correctness",
  "Depth & completeness",
  "Communication clarity",
  "Seniority-level fit",
];

export default function Home() {
  const [step, setStep]       = useState<Step>("config");
  const [config, setConfig]   = useState<InterviewConfig | null>(null);
  const [summary, setSummary] = useState<FinalSummary | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const handleStart = (newConfig: InterviewConfig) => {
    setConfig(newConfig); setSummary(null); setResults([]); setStep("session");
  };
  const handleCompleted = (s: FinalSummary, r: QuestionResult[]) => {
    setSummary(s); setResults(r); setStep("summary");
  };
  const handleRestart = () => {
    setStep("config"); setSummary(null); setResults([]); setConfig(null);
  };

  const currentIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">

      {/* ─── Nav ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <BrainCircuit className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              InterviewAI
            </span>
          </div>

          {/* Breadcrumb — desktop */}
          <nav className="hidden items-center gap-1.5 sm:flex" aria-label="Progress">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-1 transition-all duration-200",
                      i < currentIdx  && "bg-primary text-primary-foreground ring-primary",
                      i === currentIdx && "bg-primary/10 text-primary ring-primary/40",
                      i > currentIdx  && "bg-muted text-muted-foreground ring-border"
                    )}
                  >
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
                  <span className="mx-0.5 text-xs text-border">›</span>
                )}
              </div>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* ─── Body ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">

          {/* ─── Sidebar ──────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-[72px] space-y-8">

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  AI Interview Practice
                </p>
                <h1 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                  Practice. Get feedback. Improve.
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Configure a session, answer questions, and receive structured
                  AI feedback with an overall summary.
                </p>
              </div>

              <Separator />

              {/* Steps list */}
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Steps
                </p>
                <ol className="space-y-4">
                  {STEPS.map((s, i) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <span className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1 transition-all duration-200",
                        i < currentIdx  && "bg-primary text-primary-foreground ring-primary",
                        i === currentIdx && "bg-primary/10 text-primary ring-primary/40",
                        i > currentIdx  && "bg-muted text-muted-foreground ring-border"
                      )}>
                        {i + 1}
                      </span>
                      <div>
                        <p className={cn(
                          "text-sm font-medium leading-none transition-colors",
                          i === currentIdx && "text-foreground",
                          i !== currentIdx && "text-muted-foreground"
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
              </div>

              <Separator />

              {/* Pro tip */}
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3.5">
                <p className="text-xs font-semibold text-foreground">Pro tip</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Answer like it's a real interview. Mention tradeoffs, real constraints,
                  and concrete examples to score higher on depth and seniority fit.
                </p>
              </div>

              {/* Rubric */}
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  How you&apos;re scored
                </p>
                <ul className="space-y-2">
                  {RUBRIC_ITEMS.map((r) => (
                    <li key={r} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ─── Main ─────────────────────────────────────────── */}
          <main className="min-w-0">
            {/* Mobile progress */}
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    i <= currentIdx ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
              <span className="ml-2 shrink-0 text-xs capitalize text-muted-foreground">
                {step}
              </span>
            </div>

            {step === "config"  && <InterviewConfigForm onStart={handleStart} />}
            {step === "session" && config && (
              <InterviewSession config={config} onComplete={handleCompleted} />
            )}
            {step === "summary" && config && summary && (
              <FinalSummaryView
                config={config}
                summary={summary}
                results={results}
                onRestart={handleRestart}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

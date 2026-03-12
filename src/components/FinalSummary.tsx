"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinalSummary, InterviewConfig, QuestionResult } from "@/lib/types";

interface Props {
  config: InterviewConfig;
  summary: FinalSummary;
  results: QuestionResult[];
  onRestart(): void;
}

function scoreBand(score: number) {
  if (score >= 80) return {
    label: "Excellent",
    color: "text-emerald-600 dark:text-emerald-400",
    bar:   "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500",
    badge: "border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400",
    ring:  "ring-emerald-200 dark:ring-emerald-500/20",
  };
  if (score >= 65) return {
    label: "Good",
    color: "text-indigo-600 dark:text-indigo-400",
    bar:   "[&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500",
    badge: "border-indigo-300/50 bg-indigo-50 text-indigo-700 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400",
    ring:  "ring-indigo-200 dark:ring-indigo-500/20",
  };
  if (score >= 45) return {
    label: "Fair",
    color: "text-amber-600 dark:text-amber-400",
    bar:   "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500",
    badge: "border-amber-300/50 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400",
    ring:  "ring-amber-200 dark:ring-amber-500/20",
  };
  return {
    label: "Needs work",
    color: "text-red-600 dark:text-red-400",
    bar:   "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-500",
    badge: "border-red-300/50 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400",
    ring:  "ring-red-200 dark:ring-red-500/20",
  };
}

function subScoreColor(v: number) {
  if (v >= 8) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm shadow-neutral-200/60 dark:bg-card dark:shadow-none",
      className
    )}>
      {children}
    </div>
  );
}

export function FinalSummaryView({ config, summary, results, onRestart }: Props) {
  const score    = Math.round(summary.overallScore);
  const band     = scoreBand(score);
  const answered = results.filter((r) => r.evaluation !== null).length;
  const skipped  = results.length - answered;

  return (
    <motion.div
      className="w-full max-w-3xl space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── Hero card ──────────────────────────────────────── */}
      <motion.div variants={item}>
        <GlassCard>
          {/* Score + stats */}
          <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Score circle + label */}
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex h-22 w-22 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-muted/20 ring-4",
                  band.ring
                )}
                style={{ height: 88, width: 88 }}
              >
                <span className={cn("text-3xl font-bold tabular-nums leading-none", band.color)}>
                  {score}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">/100</span>
              </motion.div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Final score
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("text-2xl font-bold leading-none", band.color)}>
                    {band.label}
                  </span>
                  <span className={cn("rounded-lg border px-2 py-0.5 text-xs font-semibold", band.badge)}>
                    {score} / 100
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="rounded-lg bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                    {config.role.replace(/-/g, " ")}
                  </span>
                  <span className="rounded-lg bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                    {config.seniority}
                  </span>
                  <Badge
                    variant="outline"
                    className="rounded-lg border-indigo-300/50 bg-indigo-50/80 px-2 py-0.5 text-[11px] uppercase tracking-wide text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    {config.interviewType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { label: "Total",    value: results.length },
                { label: "Answered", value: answered       },
                { label: "Skipped",  value: skipped        },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-bold tabular-nums leading-none text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress strip */}
          <div className="border-t border-border/50 px-6 py-4">
            <Progress value={score} className={cn("h-2 rounded-full", band.bar)} />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {score} / 100 — {band.label}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Summary + strengths/improvements ──────────────── */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="px-6 pb-4 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 ring-1 ring-indigo-400/25">
                <Award className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Performance summary</p>
                <p className="text-xs text-muted-foreground">AI-generated overview of your session</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{summary.summaryText}</p>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Strengths
                </p>
                <ul className="space-y-2">
                  {summary.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <XCircle className="h-3.5 w-3.5" />
                  Areas to improve
                </p>
                <ul className="space-y-2">
                  {summary.areasToImprove.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator />

            <div className="space-y-2.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Lightbulb className="h-3.5 w-3.5" />
                Role-specific advice
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                {summary.roleSpecificAdvice}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Per-question breakdown ─────────────────────────── */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="px-6 pb-4 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 ring-1 ring-indigo-400/25">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Question breakdown</p>
                <p className="text-xs text-muted-foreground">
                  {answered} answered · {skipped} skipped
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50">
            {results.map((r, idx) => {
              const s = r.evaluation ? Math.round(r.evaluation.score_overall) : null;
              const b = s !== null ? scoreBand(s) : null;
              return (
                <motion.div
                  key={r.question.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  className="group flex items-start gap-4 border-b border-border/40 px-6 py-4 last:border-b-0 transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-foreground">
                      {r.question.text}
                    </p>
                    {r.evaluation && (
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                        {[
                          { label: "Relevance",  v: r.evaluation.scores.relevance             },
                          { label: "Technical",  v: r.evaluation.scores.technical_correctness },
                          { label: "Depth",      v: r.evaluation.scores.depth                 },
                          { label: "Clarity",    v: r.evaluation.scores.communication         },
                        ].map((sc) => (
                          <span key={sc.label}>
                            {sc.label}:&nbsp;
                            <strong className={cn("font-semibold", subScoreColor(sc.v))}>
                              {Math.round(sc.v)}
                            </strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {s !== null && b ? (
                      <>
                        <p className={cn("text-base font-bold tabular-nums leading-none", b.color)}>{s}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{b.label}</p>
                      </>
                    ) : (
                      <span className="rounded-lg bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        Skipped
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <motion.div variants={item} className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">Ready for another round?</p>
        <motion.button
          type="button"
          onClick={onRestart}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
            "bg-gradient-to-r from-indigo-600 to-purple-600",
            "hover:from-indigo-500 hover:to-purple-500",
            "shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/25",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start new interview
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

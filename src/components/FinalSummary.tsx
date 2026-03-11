"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  if (score >= 80) return { label: "Excellent",   color: "text-emerald-600 dark:text-emerald-400", bar: "[&>div]:bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
  if (score >= 65) return { label: "Good",         color: "text-blue-600 dark:text-blue-400",       bar: "[&>div]:bg-blue-500",    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"             };
  if (score >= 45) return { label: "Fair",         color: "text-amber-600 dark:text-amber-400",     bar: "[&>div]:bg-amber-500",   badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"         };
  return                   { label: "Needs work",  color: "text-red-600 dark:text-red-400",         bar: "[&>div]:bg-red-500",     badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"                 };
}

function subScoreColor(v: number) {
  if (v >= 8) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function FinalSummaryView({ config, summary, results, onRestart }: Props) {
  const score    = Math.round(summary.overallScore);
  const band     = scoreBand(score);
  const answered = results.filter((r) => r.evaluation !== null).length;
  const skipped  = results.length - answered;

  return (
    <div className="w-full max-w-3xl space-y-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          {/* Score row */}
          <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Big score circle */}
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted/30">
                <span className={cn("text-3xl font-bold tabular-nums leading-none", band.color)}>
                  {score}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">/100</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Final score
                </p>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xl font-bold leading-none", band.color)}>
                    {band.label}
                  </span>
                  <Badge className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", band.badge)}>
                    {score}/100
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                    {config.role.replace(/-/g, " ")}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                    {config.seniority}
                  </span>
                  <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wide">
                    {config.interviewType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 text-center sm:gap-6">
              {[
                { label: "Total",    value: results.length },
                { label: "Answered", value: answered       },
                { label: "Skipped",  value: skipped        },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <p className="text-2xl font-bold tabular-nums leading-none text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress strip */}
          <div className="border-t border-border/60 px-6 py-4">
            <Progress value={score} className={cn("h-2 rounded-full", band.bar)} />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {score} / 100 — {band.label}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Summary & Strengths / Improvements ───────────── */}
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader className="px-6 pb-4 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/20">
              <Award className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Performance summary</CardTitle>
              <CardDescription className="text-xs">
                AI-generated overview of your session
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-5">
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
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500/50" />
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
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Lightbulb className="h-3.5 w-3.5" />
              Role-specific advice
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
              {summary.roleSpecificAdvice}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Per-question breakdown ────────────────────────── */}
      <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <CardHeader className="px-6 pb-4 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/20">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Question breakdown</CardTitle>
              <CardDescription className="text-xs">
                {answered} answered · {skipped} skipped
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="border-t border-border/60">
          {results.map((r, idx) => {
            const s = r.evaluation ? Math.round(r.evaluation.score_overall) : null;
            const b = s !== null ? scoreBand(s) : null;
            return (
              <div
                key={r.question.id}
                className="group flex items-start gap-4 border-b border-border/40 px-6 py-4 last:border-b-0 transition-colors hover:bg-muted/25"
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
                        { label: "Relevance",  v: r.evaluation.scores.relevance              },
                        { label: "Technical",  v: r.evaluation.scores.technical_correctness  },
                        { label: "Depth",      v: r.evaluation.scores.depth                  },
                        { label: "Clarity",    v: r.evaluation.scores.communication          },
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
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      Skipped
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">
          Ready for another round?
        </p>
        <Button onClick={onRestart} className="gap-2 rounded-xl">
          <RotateCcw className="h-3.5 w-3.5" />
          Start new interview
        </Button>
      </div>
    </div>
  );
}

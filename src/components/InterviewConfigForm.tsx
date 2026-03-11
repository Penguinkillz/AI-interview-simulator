"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart2,
  Briefcase,
  Hash,
  ListChecks,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewConfig, InterviewType, Role, SeniorityLevel } from "@/lib/types";

interface Props {
  onStart(config: InterviewConfig): void;
}

const ROLES: { label: string; value: Role; desc: string }[] = [
  { label: "Frontend Engineer",  value: "frontend-engineer",  desc: "UI/UX, React, CSS"          },
  { label: "Backend Engineer",   value: "backend-engineer",   desc: "APIs, databases, infra"      },
  { label: "Fullstack Engineer", value: "fullstack-engineer", desc: "End-to-end product"          },
  { label: "ML Engineer",        value: "ml-engineer",        desc: "Models, pipelines, MLOps"    },
  { label: "Data Scientist",     value: "data-scientist",     desc: "Analysis, statistics, ML"    },
  { label: "Product Manager",    value: "product-manager",    desc: "Strategy, roadmap, users"    },
];

const LEVELS: { label: string; value: SeniorityLevel; desc: string }[] = [
  { label: "Intern",  value: "intern",  desc: "Learning the basics"        },
  { label: "Junior",  value: "junior",  desc: "0–2 years"                  },
  { label: "Mid",     value: "mid",     desc: "2–5 years"                  },
  { label: "Senior",  value: "senior",  desc: "5+ years, leads & designs"  },
];

const TYPES: { label: string; value: InterviewType }[] = [
  { label: "Coding",        value: "coding"        },
  { label: "System Design", value: "system-design" },
  { label: "Behavioral",    value: "behavioral"    },
  { label: "Mixed",         value: "mixed"         },
];

const QUESTION_OPTIONS = [3, 5, 8, 10, 15];

function SectionLabel({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 pb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/20">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function InterviewConfigForm({ onStart }: Props) {
  const [role,          setRole]          = useState<Role | "">         ("frontend-engineer");
  const [seniority,     setSeniority]     = useState<SeniorityLevel | "">("junior");
  const [interviewType, setInterviewType] = useState<InterviewType | "">("mixed");
  const [skillsInput,   setSkillsInput]   = useState("React, TypeScript, system design");
  const [numQuestions,  setNumQuestions]  = useState(5);
  const [submitting,    setSubmitting]    = useState(false);

  const skills = skillsInput.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const removeSkill = (skill: string) =>
    setSkillsInput(skills.filter((s) => s !== skill).join(", "));

  const canStart = !!role && !!seniority && !!interviewType && numQuestions > 0;
  const handleStart = () => {
    if (!canStart) return;
    setSubmitting(true);
    onStart({
      role: role as Role,
      seniority: seniority as SeniorityLevel,
      interviewType: interviewType as InterviewType,
      skills,
      numQuestions,
    });
    setSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl space-y-4">

      {/* ── Single unified form card ─────────────────────── */}
      <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

        {/* Role & Seniority */}
        <CardContent className="px-6 py-6">
          <SectionLabel
            icon={<Briefcase className="h-4 w-4 text-primary" />}
            title="Role & Seniority"
            desc="Who are you practicing as?"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Position</label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={submitting}>
                <SelectTrigger className="h-9 rounded-lg text-sm">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="py-2">
                      <span className="font-medium">{r.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{r.desc}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Seniority</label>
              <Select value={seniority} onValueChange={(v) => setSeniority(v as SeniorityLevel)} disabled={submitting}>
                <SelectTrigger className="h-9 rounded-lg text-sm">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value} className="py-2">
                      <span className="font-medium">{l.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{l.desc}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <div className="mx-6 border-t border-border/60" />

        {/* Interview Type */}
        <CardContent className="px-6 py-6">
          <SectionLabel
            icon={<ListChecks className="h-4 w-4 text-primary" />}
            title="Interview Type"
            desc="What kind of questions do you want?"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setInterviewType(t.value)}
                disabled={submitting}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  interviewType === t.value
                    ? "border-primary bg-primary/8 text-primary shadow-[inset_0_0_0_1px] shadow-primary/20"
                    : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/40"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>

        <div className="mx-6 border-t border-border/60" />

        {/* Skills */}
        <CardContent className="px-6 py-6">
          <SectionLabel
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            title="Skills & Technologies"
            desc="Questions will be tailored to these"
          />
          <div className="space-y-3">
            <Textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              rows={2}
              placeholder="React, Node.js, SQL, system design, data structures…"
              disabled={submitting}
              className="resize-none rounded-lg text-sm"
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 10).map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 rounded-md py-0.5 pl-2.5 pr-1 text-xs font-normal">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 rounded opacity-60 transition-opacity hover:opacity-100"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length > 10 && (
                  <span className="self-center text-xs text-muted-foreground">
                    +{skills.length - 10} more
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <div className="mx-6 border-t border-border/60" />

        {/* Number of questions */}
        <CardContent className="px-6 py-6">
          <SectionLabel
            icon={<Hash className="h-4 w-4 text-primary" />}
            title="Number of Questions"
            desc="How long should the session be?"
          />
          <div className="flex flex-wrap gap-2">
            {QUESTION_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n)}
                disabled={submitting}
                className={cn(
                  "h-9 w-12 rounded-lg border text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  numQuestions === n
                    ? "border-primary bg-primary/8 text-primary shadow-[inset_0_0_0_1px] shadow-primary/20"
                    : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/40"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground">
            Recommended: 5–10 questions for a focused session.
          </p>
        </CardContent>
      </Card>

      {/* Evaluation hint */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <BarChart2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
            How you&apos;ll be evaluated
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700/70 dark:text-amber-200/60">
            Relevance · Technical correctness · Depth &amp; completeness · Communication · Seniority-level fit
          </p>
        </div>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full gap-2 rounded-xl text-sm font-semibold"
        onClick={handleStart}
        disabled={!canStart || submitting}
      >
        {submitting ? "Starting…" : "Start interview"}
        {!submitting && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart2,
  Briefcase,
  Hash,
  ListChecks,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewConfig, InterviewType, Role, SeniorityLevel } from "@/lib/types";

interface Props {
  onStart(config: InterviewConfig): void;
}

const ROLES: { label: string; value: Role; desc: string }[] = [
  { label: "Frontend Engineer",  value: "frontend-engineer",  desc: "UI/UX, React, CSS"         },
  { label: "Backend Engineer",   value: "backend-engineer",   desc: "APIs, databases, infra"     },
  { label: "Fullstack Engineer", value: "fullstack-engineer", desc: "End-to-end product"         },
  { label: "ML Engineer",        value: "ml-engineer",        desc: "Models, pipelines, MLOps"   },
  { label: "Data Scientist",     value: "data-scientist",     desc: "Analysis, statistics, ML"   },
  { label: "Product Manager",    value: "product-manager",    desc: "Strategy, roadmap, users"   },
];

const LEVELS: { label: string; value: SeniorityLevel; desc: string }[] = [
  { label: "Intern",  value: "intern",  desc: "Learning the basics"       },
  { label: "Junior",  value: "junior",  desc: "0–2 years"                 },
  { label: "Mid",     value: "mid",     desc: "2–5 years"                 },
  { label: "Senior",  value: "senior",  desc: "5+ years, leads & designs" },
];

const TYPES: { label: string; value: InterviewType; desc: string }[] = [
  { label: "Coding",        value: "coding",        desc: "Algorithms & code"   },
  { label: "System Design", value: "system-design", desc: "Architecture & scale" },
  { label: "Behavioral",    value: "behavioral",    desc: "Soft skills & stories" },
  { label: "Mixed",         value: "mixed",         desc: "All of the above"     },
];

const QUESTION_OPTIONS = [3, 5, 8, 10, 15];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

function SectionLabel({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 ring-1 ring-indigo-400/25 dark:from-indigo-500/20 dark:to-purple-500/20 dark:ring-indigo-400/20">
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
    <motion.div
      className="w-full space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── Unified form card ─────────────────────────────── */}
      <motion.div
        variants={item}
        className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm shadow-neutral-200/80 dark:bg-card dark:shadow-none"
      >
        {/* Role & Seniority */}
        <div className="px-6 py-6">
          <SectionLabel
            icon={<Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
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
        </div>

        <div className="mx-6 border-t border-border/50" />

        {/* Interview Type */}
        <div className="px-6 py-6">
          <SectionLabel
            icon={<ListChecks className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
            title="Interview Type"
            desc="What kind of questions do you want?"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES.map((t) => (
              <motion.button
                key={t.value}
                type="button"
                onClick={() => setInterviewType(t.value)}
                disabled={submitting}
                whileHover={interviewType !== t.value ? { y: -1 } : {}}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  interviewType === t.value
                    ? "border-indigo-400/60 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/15 dark:to-purple-500/10 dark:border-indigo-500/30 shadow-sm"
                    : "border-border bg-background hover:border-indigo-300/60 hover:bg-muted/40"
                )}
              >
                <p className={cn(
                  "text-sm font-semibold",
                  interviewType === t.value
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400"
                    : "text-foreground"
                )}>
                  {t.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{t.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mx-6 border-t border-border/50" />

        {/* Skills */}
        <div className="px-6 py-6">
          <SectionLabel
            icon={<Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
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
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1 rounded-lg bg-indigo-50 py-0.5 pl-2.5 pr-1 text-xs font-normal text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                    >
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
                  </motion.div>
                ))}
                {skills.length > 10 && (
                  <span className="self-center text-xs text-muted-foreground">
                    +{skills.length - 10} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mx-6 border-t border-border/50" />

        {/* Number of questions */}
        <div className="px-6 py-6">
          <SectionLabel
            icon={<Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
            title="Number of Questions"
            desc="How long should the session be?"
          />
          <div className="flex flex-wrap gap-2">
            {QUESTION_OPTIONS.map((n) => (
              <motion.button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n)}
                disabled={submitting}
                whileHover={numQuestions !== n ? { y: -1 } : {}}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "h-10 w-12 rounded-xl border text-sm font-semibold transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  numQuestions === n
                    ? "border-indigo-400/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                    : "border-border bg-background text-foreground hover:border-indigo-300/60 hover:bg-muted/40"
                )}
              >
                {n}
              </motion.button>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground">
            Recommended: 5–10 questions for a focused session.
          </p>
        </div>
      </motion.div>

      {/* Evaluation hint */}
      <motion.div
        variants={item}
        className="flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-50/80 px-5 py-4 dark:border-amber-500/15 dark:bg-amber-500/5"
      >
        <BarChart2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
            How you&apos;ll be evaluated
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700/70 dark:text-amber-200/60">
            Relevance · Technical correctness · Depth &amp; completeness · Communication · Seniority-level fit
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item}>
        <motion.button
          type="button"
          onClick={handleStart}
          disabled={!canStart || submitting}
          whileHover={canStart && !submitting ? { y: -3, scale: 1.02 } : {}}
          whileTap={canStart && !submitting ? { scale: 0.99 } : {}}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200",
            "bg-gradient-to-r from-indigo-600 to-purple-600",
            "hover:from-indigo-500 hover:to-purple-500",
            "shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/35",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          )}
        >
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Starting…</>
          ) : (
            <>Start interview<ArrowRight className="h-4 w-4" /></>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

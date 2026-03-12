"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { InterviewConfig, FinalSummary, QuestionResult } from "@/lib/types";
import { InterviewConfigForm } from "@/components/InterviewConfigForm";
import { InterviewSession } from "@/components/InterviewSession";
import { FinalSummaryView } from "@/components/FinalSummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types & constants ───────────────────────────────────── */
type Step = "config" | "session" | "summary";

const NAV_STEPS: { id: Step; label: string }[] = [
  { id: "config",  label: "Configure" },
  { id: "session", label: "Interview" },
  { id: "summary", label: "Summary"   },
];

const FEATURES: {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: "indigo" | "purple" | "cyan" | "emerald";
}[] = [
  {
    icon: Target,
    title: "Role-specific questions",
    desc: "Dynamically generated for your exact role, seniority, and tech stack — every session is unique.",
    accent: "indigo",
  },
  {
    icon: Zap,
    title: "Instant AI scoring",
    desc: "Every answer scored across 5 dimensions: relevance, accuracy, depth, clarity, and seniority fit.",
    accent: "purple",
  },
  {
    icon: MessageSquare,
    title: "Detailed feedback",
    desc: "Structured feedback on what you did well, what to strengthen, and concrete next steps to grow.",
    accent: "cyan",
  },
  {
    icon: Award,
    title: "Performance summary",
    desc: "A comprehensive end-of-session report with patterns, strengths, and role-specific advice.",
    accent: "emerald",
  },
];

const ACCENT_MAP = {
  indigo: {
    bg:   "bg-gradient-to-br from-indigo-500/15 to-indigo-600/8 ring-1 ring-indigo-400/25",
    icon: "text-indigo-600 dark:text-indigo-400",
    glow: "group-hover:shadow-indigo-500/15",
  },
  purple: {
    bg:   "bg-gradient-to-br from-purple-500/15 to-purple-600/8 ring-1 ring-purple-400/25",
    icon: "text-purple-600 dark:text-purple-400",
    glow: "group-hover:shadow-purple-500/15",
  },
  cyan: {
    bg:   "bg-gradient-to-br from-cyan-500/15 to-cyan-600/8 ring-1 ring-cyan-400/25",
    icon: "text-cyan-600 dark:text-cyan-400",
    glow: "group-hover:shadow-cyan-500/15",
  },
  emerald: {
    bg:   "bg-gradient-to-br from-emerald-500/15 to-emerald-600/8 ring-1 ring-emerald-400/25",
    icon: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:shadow-emerald-500/15",
  },
};

const BENEFITS = [
  "Questions tailored to your exact tech stack",
  "Scored on 5 evaluation dimensions",
  "Skip, retry, or adjust as you go",
  "Final summary with actionable insights",
];

const HOW_IT_WORKS = [
  { n: "01", label: "Pick your role & level",  desc: "6 engineering and PM roles at any seniority." },
  { n: "02", label: "Select skills & format",  desc: "Add your stack, choose coding, behavioral, or mixed."  },
  { n: "03", label: "Answer & get scored",     desc: "AI evaluates every answer in real time."              },
];

const STATS = [
  { value: "6+",   label: "Engineering & PM roles"     },
  { value: "5",    label: "Scoring dimensions"           },
  { value: "100%", label: "AI-generated per session"    },
  { value: "Free", label: "No account needed"            },
];

/* ─── Scroll-reveal wrapper ───────────────────────────────── */
function FadeInView({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Rich mock interview UI (hero preview) ──────────────── */
function MockInterviewUI() {
  const subScores = [
    { l: "Rel",   v: 9.1, cls: "text-emerald-500" },
    { l: "Tech",  v: 7.8, cls: "text-amber-500"   },
    { l: "Depth", v: 8.5, cls: "text-emerald-500" },
    { l: "Clar",  v: 9.2, cls: "text-emerald-500" },
    { l: "Snr",   v: 7.4, cls: "text-amber-500"   },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl shadow-indigo-500/12 dark:bg-card">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-3 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 mx-2">
          <div className="mx-auto max-w-[150px] rounded-md bg-background/60 px-3 py-0.5 text-center text-[10px] text-muted-foreground">
            interviewai.app
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      {/* App content */}
      <div className="space-y-3 p-4">
        {/* Session meta */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-medium">Senior Frontend Engineer · Mixed</span>
          <span className="font-semibold text-foreground">Q 2 / 5</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>

        {/* Question */}
        <div className="rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/80 to-purple-50/30 p-3 dark:border-indigo-500/15 dark:from-indigo-500/8 dark:to-purple-500/4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white">
              2
            </span>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
              Question
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground">
            Explain how React&apos;s virtual DOM works and why it improves
            performance. When would you avoid using React?
          </p>
        </div>

        {/* Answer box */}
        <div className="rounded-xl border border-border/50 bg-background p-3">
          <p className="mb-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            Your answer
          </p>
          <p className="text-[11px] leading-relaxed text-foreground/80">
            React&apos;s virtual DOM is a lightweight JS representation of the
            real DOM. When state changes, React computes a diff and only
            updates what changed...
            <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-indigo-500" />
          </p>
        </div>

        {/* Evaluation panel */}
        <div className="overflow-hidden rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/50 to-transparent dark:border-indigo-500/12 dark:from-indigo-500/6">
          <div className="flex items-center justify-between border-b border-indigo-200/30 px-3 py-2 dark:border-indigo-500/10">
            <span className="text-[10px] font-semibold text-foreground">AI Evaluation</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-emerald-500">84</span>
              <span className="text-[9px] text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="grid grid-cols-5 divide-x divide-border/30">
            {subScores.map((s) => (
              <div key={s.l} className="py-2 text-center">
                <p className={cn("text-[11px] font-bold tabular-nums", s.cls)}>{s.v}</p>
                <p className="text-[8px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1 px-3 py-2">
            {[
              { icon: CheckCircle2, text: "Strong grasp of diffing algorithm", cls: "text-emerald-500" },
              { icon: TrendingUp,   text: "Mention Fiber for senior-level depth", cls: "text-indigo-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <item.icon className={cn("h-3 w-3 shrink-0", item.cls)} />
                <span className="line-clamp-1">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero — two-column layout ────────────────────────────── */
function HeroSection({
  onGetStarted,
  onLearnMore,
}: {
  onGetStarted: () => void;
  onLearnMore: () => void;
}) {
  return (
    <section className="relative py-20 md:py-28 lg:py-32">
      {/* Section glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-[5%] top-0 h-[600px] w-[900px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/6 to-cyan-500/8 blur-[160px] dark:from-indigo-500/18 dark:via-purple-500/10 dark:to-cyan-500/12" />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* LEFT: text content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/40 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered interview practice — free to use
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[68px] lg:leading-[1.07]"
          >
            Ace your next{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400">
              tech interview
            </span>{" "}
            with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Practice realistic, role-specific interviews. Get structured
            AI feedback on every answer and a full performance report when
            you finish.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            <motion.button
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-indigo-500/40"
            >
              <span className="absolute inset-0 bg-white/0 transition-all duration-300 hover:bg-white/5" />
              Start practicing free
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLearnMore}
              className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-indigo-400/50 hover:bg-indigo-50/60 hover:shadow-md hover:shadow-indigo-500/10 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/8"
            >
              How it works
            </motion.button>
          </motion.div>

          {/* Trust hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44, duration: 0.5 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start"
          >
            {["No sign-up required", "6+ roles supported", "Groq-powered AI"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                  {t}
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* RIGHT: visual preview */}
        <div className="relative">
          {/* Glow behind the card */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-cyan-500/10 blur-[60px] dark:from-indigo-500/20 dark:via-purple-500/15 dark:to-cyan-500/12"
            aria-hidden
          />

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <MockInterviewUI />
          </motion.div>

          {/* Floating score badge */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 -top-4 rounded-xl border border-border/60 bg-white px-3 py-2.5 shadow-xl shadow-emerald-500/10 dark:bg-card"
          >
            <p className="text-[10px] font-semibold text-muted-foreground">
              Overall score
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-500">
              84
              <span className="text-xs font-normal text-muted-foreground">/100</span>
            </p>
          </motion.div>

          {/* Floating feedback chip */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.82, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-2.5 shadow-xl dark:bg-card"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15">
              <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-foreground">
                AI feedback ready
              </p>
              <p className="text-[9px] text-muted-foreground">
                3 improvements suggested
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features — colored accent cards ────────────────────── */
function FeaturesSection() {
  return (
    <section id="features-section" className="py-20">
      <FadeInView className="mb-14 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-400">
          Why InterviewAI
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            prepare smarter
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          One tool. Realistic questions, instant scoring, detailed feedback,
          and a full performance summary — all in one flow.
        </p>
      </FadeInView>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => {
          const a = ACCENT_MAP[f.accent];
          return (
            <FadeInView key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
                className={cn(
                  "group relative rounded-2xl border border-border/60 bg-white p-6 shadow-sm",
                  "transition-all duration-300 hover:border-border hover:shadow-xl",
                  a.glow,
                  "dark:bg-card"
                )}
              >
                {/* Accent glow on hover */}
                <div
                  className={cn(
                    "absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100",
                    f.accent === "indigo"  && "bg-indigo-500/8",
                    f.accent === "purple"  && "bg-purple-500/8",
                    f.accent === "cyan"    && "bg-cyan-500/8",
                    f.accent === "emerald" && "bg-emerald-500/8"
                  )}
                />

                <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl", a.bg)}>
                  <f.icon className={cn("h-6 w-6", a.icon)} />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            </FadeInView>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Stats strip ─────────────────────────────────────────── */
function StatsStrip() {
  return (
    <FadeInView>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-muted/20 py-10 backdrop-blur-sm">
        {/* Subtle background glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/4 via-transparent to-purple-500/4"
          aria-hidden
        />
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {STATS.map((s, i) => (
            <FadeInView key={s.label} delay={i * 0.07}>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  {s.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </FadeInView>
  );
}

/* ─── Config section — two-column ─────────────────────────── */
function ConfigSection({ onStart }: { onStart: (config: InterviewConfig) => void }) {
  return (
    <section
      id="config-section"
      className="border-t border-border/50 py-20 scroll-mt-20"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_560px]">
        {/* Left: explanation */}
        <FadeInView className="lg:sticky lg:top-24">
          <div className="max-w-md space-y-7">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-400">
                Configure your session
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Build your perfect{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  mock interview
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Customize every aspect of your session to match exactly what
                you&apos;re preparing for.
              </p>
            </div>

            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15">
                    <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-border/50 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                How it works
              </p>
              {HOW_IT_WORKS.map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 text-xs font-bold tabular-nums text-indigo-400/60">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* Right: form */}
        <FadeInView delay={0.1}>
          <InterviewConfigForm onStart={onStart} />
        </FadeInView>
      </div>
    </section>
  );
}

/* ─── CTA section ─────────────────────────────────────────── */
function CtaSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20">
      <FadeInView>
        <div className="relative overflow-hidden rounded-3xl">
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.35)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.0)_0%,rgba(0,0,0,0.08)_100%)]" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center md:px-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Ready to level up?
              </p>
              <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-[56px] lg:leading-[1.1]">
                Ace your next interview
                <br className="hidden sm:block" /> starting today
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-indigo-100/80">
                Practice realistic AI-powered mock interviews. Get instant
                feedback. No sign-up, no credit card.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <motion.button
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onGetStarted}
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 shadow-xl shadow-black/30 transition-all duration-200 hover:bg-indigo-50 hover:shadow-2xl hover:shadow-black/35"
                >
                  Start practicing free
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <p className="text-sm text-indigo-200/70">
                  Takes less than 60 seconds to begin
                </p>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-indigo-200/70">
                {["No account needed", "6+ engineering roles", "Real AI scoring"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function Home() {
  const [step,    setStep]    = useState<Step>("config");
  const [config,  setConfig]  = useState<InterviewConfig | null>(null);
  const [summary, setSummary] = useState<FinalSummary | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const scrollToConfig = () => {
    document.getElementById("config-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStart = (c: InterviewConfig) => {
    setConfig(c); setSummary(null); setResults([]); setStep("session");
  };
  const handleCompleted = (s: FinalSummary, r: QuestionResult[]) => {
    setSummary(s); setResults(r); setStep("summary");
  };
  const handleRestart = () => {
    setStep("config"); setSummary(null); setResults([]); setConfig(null);
  };

  const currentIdx = NAV_STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Fixed gradient atmosphere ──────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-[380px] right-[0%] h-[850px] w-[850px] rounded-full bg-indigo-500/10 blur-[140px] dark:bg-indigo-500/17" />
        <div className="absolute -bottom-[250px] -left-[250px] h-[750px] w-[750px] rounded-full bg-purple-600/8 blur-[130px] dark:bg-purple-600/15" />
        <div className="absolute top-[35%] -right-[180px] h-[600px] w-[600px] rounded-full bg-cyan-500/6 blur-[120px] dark:bg-cyan-500/11" />
        <div className="absolute top-[18%] left-[15%] h-[450px] w-[650px] rounded-full bg-indigo-400/5 blur-[110px] dark:bg-indigo-400/9" />
        <div className="absolute bottom-[8%] right-[8%] h-[380px] w-[380px] rounded-full bg-cyan-400/5 blur-[90px] dark:bg-cyan-400/9" />
        <div className="absolute bottom-[30%] left-[40%] h-[300px] w-[400px] rounded-full bg-purple-400/4 blur-[80px] dark:bg-purple-400/7" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Interview
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                AI
              </span>
            </span>
          </div>

          {step !== "config" && (
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Progress">
              {NAV_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-1 transition-all",
                      i < currentIdx  && "bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-transparent shadow-sm shadow-indigo-400/30",
                      i === currentIdx && "bg-indigo-50 text-indigo-600 ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-400 dark:ring-indigo-500/40",
                      i > currentIdx  && "bg-muted text-muted-foreground ring-border"
                    )}>
                      {i + 1}
                    </span>
                    <span className={cn(
                      "text-xs transition-colors",
                      i === currentIdx ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < NAV_STEPS.length - 1 && <span className="mx-1 text-xs text-border">›</span>}
                </div>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            {step === "config" && (
              <motion.button
                whileHover={{ y: -1, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToConfig}
                className="hidden items-center gap-1.5 rounded-lg border border-indigo-300/40 bg-indigo-50/80 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-all duration-200 hover:border-indigo-400/60 hover:bg-indigo-100/80 hover:shadow-sm hover:shadow-indigo-500/15 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 sm:flex"
              >
                Get started
                <ArrowRight className="h-3 w-3" />
              </motion.button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* Landing page */}
        {step === "config" && (
          <motion.div
            key="config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <HeroSection onGetStarted={scrollToConfig} onLearnMore={scrollToFeatures} />
              <FeaturesSection />
              <div className="py-8">
                <StatsStrip />
              </div>
              <ConfigSection onStart={handleStart} />
              <CtaSection onGetStarted={scrollToConfig} />
            </div>
          </motion.div>
        )}

        {/* Interview session */}
        {step === "session" && config && (
          <motion.div
            key="session"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
              <div className="mb-6 flex items-center gap-2 sm:hidden">
                {NAV_STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-500",
                      i <= currentIdx ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-border"
                    )}
                  />
                ))}
                <span className="ml-2 shrink-0 text-xs capitalize text-muted-foreground">{step}</span>
              </div>
              <div className="mx-auto max-w-3xl">
                <InterviewSession config={config} onComplete={handleCompleted} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {step === "summary" && config && summary && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl">
                <FinalSummaryView
                  config={config}
                  summary={summary}
                  results={results}
                  onRestart={handleRestart}
                />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

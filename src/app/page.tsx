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

const FEATURES = [
  {
    icon: Target,
    title: "Role-specific questions",
    desc: "Dynamically generated for your exact role, seniority level, and tech stack — every session is unique.",
  },
  {
    icon: Zap,
    title: "Instant AI scoring",
    desc: "Every answer is scored across 5 dimensions: relevance, accuracy, depth, clarity, and seniority fit.",
  },
  {
    icon: MessageSquare,
    title: "Detailed feedback",
    desc: "Structured feedback on what you did well, what to strengthen, and concrete next steps.",
  },
  {
    icon: Award,
    title: "Performance summary",
    desc: "A comprehensive report at the end with patterns, strengths, and role-specific growth advice.",
  },
];

const BENEFITS = [
  "Questions tailored to your exact tech stack",
  "Scored on 5 evaluation dimensions",
  "Skip, retry, or adjust as you go",
  "Final summary with actionable insights",
];

const HOW_IT_WORKS = [
  { n: "01", label: "Pick your role & level",  desc: "Choose from 6 engineering and PM roles at any seniority." },
  { n: "02", label: "Select skills & format",  desc: "Add your tech stack, pick coding, behavioral, or mixed." },
  { n: "03", label: "Answer & get scored",     desc: "AI evaluates every answer in real time with rich feedback." },
];

/* ─── Shared animation utilities ─────────────────────────── */
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
  const isInView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Mock evaluation preview card (hero) ────────────────── */
function MockEvaluationCard() {
  const scores = [
    { label: "Relevance",  value: 9.1, cls: "text-emerald-500" },
    { label: "Technical",  value: 7.8, cls: "text-amber-500"   },
    { label: "Depth",      value: 8.5, cls: "text-emerald-500" },
    { label: "Clarity",    value: 9.2, cls: "text-emerald-500" },
    { label: "Seniority",  value: 7.4, cls: "text-amber-500"   },
  ];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl shadow-indigo-500/10 dark:bg-card">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI Evaluation
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Explain how React reconciliation works and when the virtual DOM re-renders…
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-emerald-500">84</p>
            <p className="text-[10px] text-muted-foreground">/100</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 divide-x divide-border/50 rounded-xl border border-border/50 bg-muted/30">
          {scores.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 py-2.5">
              <p className={cn("text-sm font-bold tabular-nums", s.cls)}>{s.value}</p>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            { icon: CheckCircle2, text: "Strong conceptual grasp of the diffing algorithm",          cls: "text-emerald-500" },
            { icon: TrendingUp,   text: "Mention Fiber architecture for senior-level depth",        cls: "text-indigo-500"  },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <item.icon className={cn("h-3.5 w-3.5 shrink-0", item.cls)} />
              <span className="line-clamp-1">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Landing sections ────────────────────────────────────── */
function HeroSection({
  onGetStarted,
  onLearnMore,
}: {
  onGetStarted: () => void;
  onLearnMore: () => void;
}) {
  return (
    <section className="relative py-24 text-center md:py-32">
      {/* Hero section glow — indigo + purple + cyan blend */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center" aria-hidden>
        <div className="mt-4 h-[520px] w-[1000px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/7 to-cyan-500/8 blur-[140px] dark:from-indigo-500/18 dark:via-purple-500/12 dark:to-cyan-500/12" />
      </div>

      <div className="mx-auto max-w-[820px]">
        {/* Badge pill */}
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[72px] lg:leading-[1.08]"
        >
          Ace your next{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            tech interview
          </span>
          <br className="hidden sm:block" />
          with AI feedback
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
        >
          Practice realistic, role-specific interviews. Get structured feedback
          on every answer and a full performance summary when you finish.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <motion.button
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-indigo-500/40"
          >
            {/* Inner glow on hover */}
            <span className="absolute inset-0 rounded-xl bg-white/0 transition-all duration-300 hover:bg-white/5" />
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
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          {["No sign-up required", "6+ roles supported", "Powered by Groq LLM"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Mock card preview */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.42, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-lg"
        >
          <MockEvaluationCard />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features-section" className="py-20">
      <FadeInView className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            prepare smarter
          </span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          One tool. Realistic questions. Instant feedback. Complete prep.
        </p>
      </FadeInView>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <FadeInView key={f.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200/80 hover:shadow-xl hover:shadow-indigo-500/8 dark:bg-card dark:hover:border-indigo-500/20"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/12 to-purple-500/12 ring-1 ring-indigo-400/20">
                <f.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
}

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
                Customize every aspect of your session to match exactly what you're preparing for.
              </p>
            </div>

            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15">
                    <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-border/50 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                How it works
              </p>
              {HOW_IT_WORKS.map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 text-xs font-bold tabular-nums text-indigo-400/60">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
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

function CtaSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20">
      <FadeInView>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-12 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
            <div className="absolute -top-24 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/6 blur-[80px]" />
            <div className="absolute -bottom-16 right-0 h-[200px] w-[400px] rounded-full bg-purple-400/15 blur-[60px]" />
          </div>
          <div className="relative z-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-200">
              Ready to level up?
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Land your dream job faster
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-indigo-100/80">
              Start your first AI-powered mock interview today. No sign-up required.
            </p>
            <motion.button
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 shadow-xl shadow-black/30 transition-all duration-200 hover:bg-indigo-50 hover:shadow-2xl hover:shadow-black/35"
            >
              Start practicing now
              <ArrowRight className="h-4 w-4" />
            </motion.button>
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
        {/* Indigo — top right */}
        <div className="absolute -top-[380px] right-[0%] h-[850px] w-[850px] rounded-full bg-indigo-500/10 blur-[140px] dark:bg-indigo-500/17" />
        {/* Purple — bottom left */}
        <div className="absolute -bottom-[250px] -left-[250px] h-[750px] w-[750px] rounded-full bg-purple-600/8 blur-[130px] dark:bg-purple-600/15" />
        {/* Cyan — mid right */}
        <div className="absolute top-[35%] -right-[180px] h-[600px] w-[600px] rounded-full bg-cyan-500/6 blur-[120px] dark:bg-cyan-500/11" />
        {/* Indigo soft — upper center */}
        <div className="absolute top-[18%] left-[15%] h-[450px] w-[650px] rounded-full bg-indigo-400/5 blur-[110px] dark:bg-indigo-400/9" />
        {/* Cyan accent — bottom right */}
        <div className="absolute bottom-[8%] right-[8%] h-[380px] w-[380px] rounded-full bg-cyan-400/5 blur-[90px] dark:bg-cyan-400/9" />
        {/* Purple accent — center bottom */}
        <div className="absolute bottom-[30%] left-[40%] h-[300px] w-[400px] rounded-full bg-purple-400/4 blur-[80px] dark:bg-purple-400/7" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand */}
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

          {/* Progress breadcrumb — session & summary only */}
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
                  {i < NAV_STEPS.length - 1 && (
                    <span className="mx-1 text-xs text-border">›</span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Right controls */}
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

        {/* ── Landing / config page ───────────────────────── */}
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
              <ConfigSection onStart={handleStart} />
              <CtaSection onGetStarted={scrollToConfig} />
            </div>
          </motion.div>
        )}

        {/* ── Interview session ───────────────────────────── */}
        {step === "session" && config && (
          <motion.div
            key="session"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
              {/* Mobile progress */}
              <div className="mb-6 flex items-center gap-2 sm:hidden">
                {NAV_STEPS.map((s, i) => (
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
                <span className="ml-2 shrink-0 text-xs capitalize text-muted-foreground">{step}</span>
              </div>
              <div className="mx-auto max-w-3xl">
                <InterviewSession config={config} onComplete={handleCompleted} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Summary ─────────────────────────────────────── */}
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

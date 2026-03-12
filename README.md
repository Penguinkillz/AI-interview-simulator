# InterviewAI — AI-Powered Mock Interview Simulator

Practice realistic, role-specific technical interviews with instant AI feedback on every answer and a full performance summary at the end.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-LLM-orange?style=flat-square)

---

## Features

- **Role-specific questions** — Dynamically generated for your exact role, seniority, and tech stack
- **5-dimension AI scoring** — Every answer scored on Relevance, Technical Accuracy, Depth, Clarity, and Seniority Fit
- **Structured feedback** — What you did well, what to improve, and concrete next steps
- **Full performance summary** — End-of-session report with patterns, strengths, and growth advice
- **6+ roles supported** — Frontend, Backend, Full Stack, DevOps, Data Engineering, Product Management
- **No sign-up required** — Zero accounts, zero database, all state lives in memory

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| AI Provider | [Groq](https://groq.com) (OpenAI-compatible API) |
| Default Model | `llama-3.3-70b-versatile` |
| Icons | Lucide React |
| Theme | next-themes (light / dark) |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Penguinkillz/AI-interview-simulator.git
cd AI-interview-simulator
npm install
```

### 2. Set up your API key

Create a `.env.local` file in the project root:

```env
LLM_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com/keys](https://console.groq.com/keys).

> **Optional overrides** — the following have sensible defaults and only need to be set if you want to change them:
>
> ```env
> LLM_API_BASE_URL=https://api.groq.com/openai/v1   # default
> LLM_MODEL=llama-3.3-70b-versatile                  # default
> ```
>
> Any OpenAI-compatible provider (OpenAI, Together, Fireworks, etc.) works — just update the base URL and model.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## App Flow

```
Configure → Interview Session → Final Summary
```

1. **Configure** — Choose role, seniority (Junior → Staff), interview type (Coding / Behavioral / Mixed), skills, and number of questions (3–10).
2. **Interview** — One question at a time. Type your answer, submit, and get scored immediately with AI feedback.
3. **Summary** — Overall score, per-question breakdown, strengths, areas to improve, and role-specific advice.

---

## Project Structure

```
src/
├── app/
│   ├── api/interview/route.ts   # API: question gen, evaluation, summary
│   ├── globals.css              # Global styles + CSS variables
│   ├── layout.tsx               # Root layout (fonts, theme provider)
│   └── page.tsx                 # Main page (landing + interview flow)
├── components/
│   ├── CursorGlow.tsx           # Custom cursor glow effect
│   ├── FinalSummary.tsx         # End-of-session summary view
│   ├── InterviewConfigForm.tsx  # Session configuration form
│   ├── InterviewSession.tsx     # Live interview screen
│   ├── ThemeProvider.tsx        # next-themes wrapper
│   └── ThemeToggle.tsx          # Light / dark toggle button
└── lib/
    ├── llm.ts                   # LLM API wrapper (OpenAI-compatible)
    ├── rubric.ts                # Prompt templates + JSON schema
    └── types.ts                 # Shared TypeScript interfaces
```

---

## Customization

| What to change | Where |
|---------------|-------|
| Scoring rubric / prompt wording | `src/lib/rubric.ts` |
| LLM provider / model / headers | `src/lib/llm.ts` |
| Interview config options (roles, types, etc.) | `src/components/InterviewConfigForm.tsx` |
| Data types | `src/lib/types.ts` |
| Color palette / design tokens | `src/app/globals.css` |

---

## Scripts

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run start    # Serve production build
npm run lint     # Run ESLint
```

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push the repo to GitHub
2. Import the project on [vercel.com/new](https://vercel.com/new)
3. Add `LLM_API_KEY` as an environment variable in the Vercel dashboard
4. Deploy — done

Any platform that supports Next.js (Railway, Render, Fly.io) works equally well.

---

## License

MIT — use it, fork it, build on it.

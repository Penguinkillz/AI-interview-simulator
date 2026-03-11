# AI Interview Simulator

A minimal, focused web app for running AI-powered mock interviews. Configure a role, seniority level, skills, and number of questions, then walk through an interview with per-question scoring and a final summary.

## Tech stack

- Next.js 16 (App Router, TypeScript, `src/` layout)
- Tailwind CSS 4
- shadcn/ui (Radix primitives)
- Single Next.js API route for LLM calls

## Getting started

### 1. Install dependencies

```bash
cd C:\\ai-interview-simulator
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
LLM_API_BASE_URL=https://api.x.ai/v1
LLM_API_KEY=your_api_key_here
LLM_MODEL=grok-2-latest
```

Notes:

- The defaults are aimed at Grok/xAI. If you use another provider, adjust:
  - `LLM_API_BASE_URL`
  - `LLM_MODEL`
  - The request/response shape in `src/lib/llm.ts` if needed.
- If `LLM_API_KEY` is **not** set, the app falls back to a simple mock response so you can still exercise the UI end-to-end.

### 3. Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Core flow

1. **Configure interview**
   - Choose role, seniority, interview type, skills, and number of questions.
2. **Interview session**
   - One question at a time.
   - Type your answer and submit.
   - The AI scores and evaluates your response using a structured rubric.
3. **Final summary**
   - Overall score, strengths, weaknesses, and role-specific advice.

All state is kept in memory on the client; there is no database or authentication.

## Where to tweak behavior

- **Rubric and prompts**: `src/lib/rubric.ts`
  - Update scoring guidance, JSON output schema, or how prompts are built.
- **LLM integration**: `src/lib/llm.ts`
  - Change base URL, headers, or response parsing to match a different provider.
- **Shared types**: `src/lib/types.ts`
  - Adjust interview config, question, evaluation, or summary types.
- **API route**: `src/app/api/interview/route.ts`
  - Change how questions are generated, answers are evaluated, or summaries are produced.
- **UI/UX**:
  - Config screen: `src/components/InterviewConfigForm.tsx`
  - Interview flow: `src/components/InterviewSession.tsx`
  - Final summary view: `src/components/FinalSummary.tsx`

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server (after build)
npm run lint   # Run ESLint
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

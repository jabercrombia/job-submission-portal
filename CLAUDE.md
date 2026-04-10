# CLAUDE.md

## Project Overview

Job submission portal built with Next.js 15 (App Router), Supabase, and a Python FastAPI microservice. Candidates submit applications with resume PDFs; the Python service scores resumes against job descriptions using TF-IDF and cosine similarity.

## Commands

```bash
yarn dev        # Start Next.js dev server (http://localhost:3000)
yarn build      # Production build
yarn lint       # Run ESLint

# Python microservice (from pdf-reader/)
uvicorn main:app --reload   # http://127.0.0.1:8000
```

## Architecture

- **`app/`** — Next.js App Router pages and layouts
- **`app/actions/`** — Server actions for mutations
- **`app/api/`** — API route handlers
- **`app/dashboard/`** — Admin dashboard
- **`app/job/`** — Job detail pages
- **`app/job-listings/`** — Job listings page
- **`app/ui/`** — UI primitives
- **`components/`** — Shared components
- **`lib/supabase.ts`** — Public Supabase client (client-side safe)
- **`lib/supabase-admin.ts`** — Service role client (server-side only)
- **`pdf-reader/`** — Python FastAPI resume scanner

## Key Conventions

- Use **server actions** (`app/actions/`) for form submissions and data mutations
- Use `supabase-admin.ts` only in server-side code — never expose the service role key to the client
- **Tailwind CSS** for all styling; no inline styles
- **TypeScript** strict mode — all files must be `.ts` or `.tsx`
- Package manager is **yarn**

## Environment Variables

`.env.local` (project root):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`pdf-reader/.env`:
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JOB_DESCRIPTION=
```

## Supabase Schema

**Table:** `resume_users`
- `id` uuid PK
- `firstName`, `lastName`, `email`, `phone`, `linkedIn`, `website` — text
- `pdf_path` — text (Supabase Storage path)
- `match_score` — float4

**Storage bucket:** `resume-uploads`

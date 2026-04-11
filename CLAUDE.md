# CLAUDE.md

## Project Overview

Job submission portal built with Next.js 15 (App Router), Supabase, and a Python FastAPI microservice. Candidates submit applications with resume PDFs; the Python service scores resumes against job descriptions using TF-IDF and cosine similarity.

## Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start Next.js dev server (http://localhost:3000)
yarn build          # Production build
yarn lint           # Run ESLint
yarn test:db        # Test connectivity to all Supabase tables (node scripts/test-db.mjs)

# Python microservice (from pdf-reader/)
uvicorn main:app --reload   # http://127.0.0.1:8000
```

## Architecture

- **`app/`** — Next.js App Router pages and layouts
- **`app/actions/`** — Server actions for mutations (`createJob.ts`, `updateJob.ts`)
- **`app/api/`** — API route handlers (`job-entries`, `job-entry`, `users`, `categories`, `submit-user`, `download-resume`, `search`)
- **`app/dashboard/`** — Admin dashboard (listings, applications, create-entry, edit-entry)
- **`app/job/[slug]/`** — Public job detail + application form
- **`app/job-listings/`** — Public job listings page
- **`app/components/`** — Shared components (NewUser, TabsWrapper, form, table, ux)
- **`components/ui/`** — Radix-based UI primitives (button, input, textarea, navigation-menu, table)
- **`lib/supbase.ts`** — Public Supabase client (client-side safe) ⚠️ note: typo in filename
- **`lib/supbase-admin.ts`** — Service role client (server-side only) ⚠️ note: typo in filename
- **`lib/dateformat.ts`** — Date formatting utilities
- **`lib/jobs.ts`** — Supabase query helper for job entries
- **`pdf-reader/`** — Python FastAPI resume scanner
- **`scripts/test-db.mjs`** — Standalone DB connection test script
- **`schema.sql`** — SQL to recreate all Supabase tables
- **`sample-data/`** — Sample CSVs for seeding tables

## Database Tables

| Table | Purpose |
|---|---|
| `categories` | Job categories (`id`, `category_name`) |
| `job_entries` | Job postings (`id`, `title`, `description`, `category`, `expiration`, `job_posting_key`, `created_at`) |
| `resume_users` | Applicants (`id`, `firstName`, `lastName`, `email`, `phone`, `linkedIn`, `website`, `pdf_path`, `match_score`, `category`, `title`, `created_at`) |

`job_posting_key` is auto-generated via a Postgres trigger on insert (see `schema.sql`).

## Key Conventions

- Use **server actions** (`app/actions/`) for form submissions and data mutations
- Use `supbase-admin.ts` only in server-side code — never expose the service role key to the client
- **Tailwind CSS** for all styling; no inline styles
- **TypeScript** strict mode — all files must be `.ts` or `.tsx`
- Package manager is **yarn**
- `@supabase/ssr` and `@supabase/supabase-js` are both installed

## Environment Variables

`.env.local` (project root — required for local dev):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PDF_SCAN_URL=        # URL of the FastAPI microservice
SITEURL=                         # Used for favicon in layout metadata
GOOGLE_TRACKIND_ID=              # Google Analytics tracking ID (note: typo in var name)
```

`pdf-reader/.env`:
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JOB_DESCRIPTION=
```

## Key Dependencies

- `next` ^15.3.9 — patched (CVE-2025-66478 fix)
- `@supabase/supabase-js` ^2.103.0
- `@supabase/ssr` ^0.10.2
- `@mui/material` ^7.1.0 — used in Applications dashboard and TabsWrapper
- `react-markdown` — renders job descriptions written in Markdown
- `lucide-react` — icons

# Debate Wise

Debate Wise is an AI-assisted debate platform for structured, evidence-based discussion.

The project is now prepared as an **English-first open-source repository** while keeping **German and English in-product language support**.

## Why This Project Exists

Most social platforms optimize for engagement velocity, not reasoning quality. Debate Wise explores a different model:

- structured argument threads instead of flat comment streams
- incentives for argument quality instead of popularity alone
- AI support for fallacy checks, steel-manning, and summaries

## Product Direction (Important)

If this project is shared broadly, requiring every adopter to build a separate community from scratch creates high friction.

A better open-source path is:

1. **Public Commons Mode (recommended default):** one shared, open instance where anyone can participate.
2. **Self-Hosted Space Mode:** organizations can run their own instance for private/curated communities.

This repository now documents both directions so contributors can build features for either mode.

## Current Status

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Supabase (Postgres, Auth, RLS, Realtime, Edge Functions)
- AI functions present for:
  - argument/fallacy analysis
  - steel-man validation
  - thread summarization
- Localization: EN + DE available (ongoing migration from legacy hard-coded German strings)

## Open-Source Readiness Changes Included

- English-first `README` and repository docs
- Added `LICENSE` (MIT)
- Added `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`
- Added `.env.example` for self-hosting setup
- Removed hard-coded frontend Supabase instance values in favor of environment variables
- Set English as default UI language fallback

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query
- Supabase JS

## Quick Start

### 1. Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project

### 2. Install

```bash
npm ci
```

### 3. Configure Environment

Create `.env` from the template:

```bash
cp .env.example .env
```

Set values:

```bash
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
```

### 4. Run

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

## Supabase Setup

1. Link your Supabase project.
2. Apply the SQL migrations in `supabase/migrations`.
3. Deploy edge functions in `supabase/functions` if AI features are needed.
4. Set `OPENAI_API_KEY` in Supabase secrets for AI endpoints.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run build:dev` - development-mode build
- `npm run typecheck` - TypeScript check
- `npm run lint` - ESLint
- `npm run preview` - preview production build

## Known Gaps (Good First Contributions)

- unify duplicated i18n implementations
- complete EN/DE translation coverage for all hard-coded strings
- reduce lint error count and strict type gaps (`any` usage)
- split large frontend chunks for better performance
- clean up legacy/unused route components

## Repository Conventions

- Repository language: **English**
- UI language support: **English + German**
- New docs, issues, and PR descriptions should be in English

## Governance and Community

- Code of Conduct: see `CODE_OF_CONDUCT.md`
- Contributing: see `CONTRIBUTING.md`
- Security reporting: see `SECURITY.md`

## License

MIT License. See `LICENSE`.

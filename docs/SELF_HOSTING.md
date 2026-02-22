# Self-Hosting Guide

This guide explains how to run Debate Wise in your own environment.

## 1. Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project you control
- Supabase CLI (recommended)

## 2. Clone and Bootstrap

```bash
git clone https://github.com/rockywuest/debate-wise-app.git
cd debate-wise-app
npm run bootstrap
```

## 3. Configure Environment

```bash
cp .env.example .env
```

Set:

```bash
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
```

## 4. Apply Database Migrations

Use your preferred workflow:

- Supabase CLI (`supabase db push`)
- SQL editor in Supabase dashboard (apply migration files in order)

Migration files are in `supabase/migrations`.

## 5. Deploy Edge Functions (Optional, required for AI features)

Deploy functions from `supabase/functions` and set required secrets:

- `OPENAI_API_KEY`

Without edge functions, core discussion features still run, but AI analysis/validation features will be limited.

## 6. Run Local Quality Gate

```bash
npm run check
```

## 7. Start the App

```bash
npm run dev
```

## 8. Production Build

```bash
npm run build
npm run preview
```

## Operational Notes

- Keep database backups enabled in your Supabase project.
- Keep RLS policies enabled for protected tables.
- Review `SECURITY.md` before public deployment.

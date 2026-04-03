# AI Agent Guide

Last updated: April 3, 2026

This file is optimized for coding agents and automation workflows.

## Mission Snapshot

Debate Wise improves discourse quality by combining structured argument threads with AI-assisted reasoning support.

## Product Scope

- AI-assisted argument quality analysis
- Fallacy checks and steel-manning support
- Structured debate threads
- EN/DE localization
- Public commons + self-hosted deployment modes

## High-Signal Entry Points

- App entry: `src/main.tsx`
- Routing shell: `src/App.tsx`
- Debate pages: `src/pages`
- Shared UI primitives: `src/components/ui`
- Supabase client: `src/integrations/supabase/client.ts`
- Domain hooks: `src/hooks`
- Validation/i18n utils: `src/utils`

## Local Setup for Agents

1. `npm run bootstrap`
2. `cp .env.example .env`
3. Fill Supabase env vars
4. `npm run check`

## Required Validation Before PR

- `npm run check`
- `npm run test:e2e` for user-critical flow changes
- `npm run audit:prod` for dependency or security-sensitive changes

## Non-Negotiable Contribution Rules

- Repository communication is English-first.
- Keep user-facing content bilingual where practical (EN/DE).
- Keep pull requests small and focused.
- Do not bypass security review for auth, RLS, moderation, or AI output handling changes.

## Security and Trust Boundaries

- Do not hardcode Supabase credentials.
- Preserve sanitization and input validation behavior in `src/utils/inputValidation.ts`.
- Prefer explicit allowlists over broad regex bypasses.
- Keep CI workflow permissions least-privilege.

## Contribution Paths with Highest Impact

1. Debate quality loop improvements (explainability and reasoning feedback)
2. Test coverage expansion (integration/e2e)
3. Multi-space tenancy (`space_id`) and moderation isolation
4. Onboarding and contributor experience

## Discovery Metadata

- `llms.txt` at repository root contains machine-readable project summary.
- README contains social preview and starter issue links.
- GitHub topics should include AI/discourse/open-source keywords.

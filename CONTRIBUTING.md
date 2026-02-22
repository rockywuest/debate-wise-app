# Contributing to Debate Wise

Thanks for contributing.

## Ground Rules

- Use English for issues, pull requests, and docs.
- Keep user-facing text bilingual when practical (EN + DE).
- Prefer small, focused pull requests.

## Local Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm run bootstrap
   ```
3. Create `.env` from `.env.example` and set Supabase credentials.
4. Start the app:
   ```bash
   npm run dev
   ```

## Before Opening a PR

Run:

```bash
npm run check
```

For localization-related changes, also verify:

```bash
npm run check:i18n
```

For deployment-path changes, verify production route smoke checks:

```bash
npm run smoke:routes
```

If lint fails due existing baseline issues, include only changes relevant to your scope and mention remaining unrelated lint findings in the PR description.

## Coding Guidelines

- Use TypeScript types instead of `any`.
- Reuse existing UI primitives in `src/components/ui`.
- Keep business logic in hooks/utilities when possible.
- Add or update docs for behavior changes.

## Pull Request Checklist

- Problem statement is clear.
- Screenshots/videos for UI changes (if relevant).
- Backward compatibility considered.
- New strings include EN + DE variants.
- Security/privacy impact assessed.

## Major Change Proposals

For significant architecture, moderation, governance, or security changes, open an RFC issue first using the RFC template and follow `docs/RFC_PROCESS.md`.

## Areas Where Help Is Most Needed

- i18n consolidation (single source of truth)
- strict typing improvements
- performance and bundle splitting
- test coverage
- moderation and community tooling

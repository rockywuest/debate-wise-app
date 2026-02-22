# Market Readiness Checklist

Last updated: February 22, 2026

## Goal

Ship Debate Wise as an open-source, English-first project with bilingual UI support and a stable baseline for public adoption.

## Baseline Status

- [x] Repository docs and governance files in place (`README`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `LICENSE`)
- [x] Issue and PR templates configured in `.github/`
- [x] Frontend configuration decoupled from a fixed Supabase project (`.env.example`)
- [x] CI workflow running `lint`, `typecheck`, `test`, and `build`
- [x] Production dependency audit command available (`npm run audit:prod`)
- [x] Bundle splitting configured in Vite for improved load profile

## Quality Gates (Current)

- `npm run lint`: passing
- `npm run check:i18n`: passing
- `npm run typecheck`: passing
- `npm run test`: passing
- `npm run build`: passing
- `npm run audit:prod`: passing (0 vulnerabilities)

## Localization Readiness

- [x] English-first default language behavior
- [x] Core routed pages localized for EN/DE
- [x] Core argument creation/rating/analysis flows localized for EN/DE
- [ ] Long-tail legacy component variants fully migrated to centralized key-based i18n

## Open-Source Adoption Readiness

- [x] Public-commons + self-hosted strategy documented (`docs/OPEN_SOURCE_STRATEGY.md`)
- [x] Good-first-issues starter list documented (`docs/GOOD_FIRST_ISSUES.md`)
- [x] One-click local developer bootstrap script (`npm run bootstrap`)
- [x] Architecture decision records (ADRs) for core product decisions (`docs/adr/`)
- [x] Maintainer triage automation for stale issues/PRs (`.github/workflows/stale.yml`)
- [x] Deployment mode runbooks for self-hosting and public commons operations (`docs/SELF_HOSTING.md`, `docs/PUBLIC_COMMONS_OPERATIONS.md`)

## Launch Recommendation

This repository is ready for a public beta open-source launch, with remaining work focused on scale-hardening and long-tail i18n cleanup rather than core blocking issues.

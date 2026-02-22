# Release Audit (Publish Readiness)

Date: February 22, 2026

This audit summarizes publish readiness across security, usability/UX, open-source standards, accessibility/value clarity, and CI health.

## 1) Security Agent

### Checks executed
- `npm audit --omit=dev --audit-level=high`
- `npm audit --audit-level=high`
- repository secret-pattern scan (`rg`) for common leaked token formats
- GitHub security API checks for open alerts

### Result
- Production dependencies: **pass** (0 high vulnerabilities)
- Dev dependencies: **17 advisories** (tooling chain, non-production runtime)
  - `vite/esbuild` advisory requires major Vite upgrade
  - `eslint/minimatch` advisory requires major ESLint ecosystem upgrade
- No obvious plaintext secrets detected in tracked source files.
- GitHub APIs report repository-level scanning features disabled:
  - code scanning alerts endpoint returns disabled/403
  - dependabot alerts endpoint returns disabled/403
  - secret scanning endpoint returns disabled/404

### Actions taken
- No unsafe force-upgrades were applied automatically.
- Security posture documented for release transparency.

## 2) Usability / UX Agent

### Checks executed
- Playwright E2E smoke flows (`npm run test:e2e`)
- Route smoke checks (`npm run smoke:routes`)
- Router consistency review

### Result
- Core user flows pass: auth mode switch, debates guest view, language toggle.
- Previously missing wildcard route in active router could lead to weak unknown-route experience.

### Actions taken
- Added wildcard fallback route in active app router:
  - `src/App.tsx` now serves `src/pages/NotFound.tsx` for unknown paths.

## 3) Open-Source Standards Agent

### Checks executed
- GitHub Community Profile API
- repository structure review for OSS governance baseline
- dependency update workflow hygiene review

### Result
- Community profile health: **100%**
- Core standards files present: `LICENSE`, `README`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, PR template.
- Dependency update PR volume was too high for maintainability.

### Actions taken
- Added `CHANGELOG.md` (Keep a Changelog format)
- Updated Dependabot strategy:
  - grouped non-breaking updates
  - reduced open PR limits for npm and GitHub Actions

## 4) Accessibility & Value-Clarity Agent

### Checks executed
- README and entry-flow clarity review
- i18n behavior review (`src/utils/i18n.ts`)
- CI i18n guardrail robustness check

### Result
- Value proposition is clear but can be easier for first-time visitors.
- i18n guardrail had a reliability issue: if `rg` was missing, check could pass silently.

### Actions taken
- README improved with:
  - “Who This Is For”
  - “Value in 10 Minutes”
- i18n guardrail hardened:
  - `scripts/check-i18n.sh` now falls back to `grep` when `rg` is unavailable.

## 5) CI Messages Agent

### Checked failures
- `CI` run `22280079246`: failed on Dependabot Tailwind v4 PR build incompatibility.
- `CI` run `22279607672`: failed on Dependabot React type peer conflict (`@types/react-dom@19` vs React 18 types).

### Interpretation
- Failures are from dependency bump PRs, not from `main`.
- Current `main` pipeline is green after cleanup.

### Actions taken
- Dependabot PR strategy tuned (grouping + lower PR limits).
- Open stale Dependabot PRs were closed as part of release cleanup.


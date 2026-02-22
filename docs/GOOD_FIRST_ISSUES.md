# Good First Issues

Use this list to onboard first-time contributors.

## 1) i18n: Replace hard-coded German strings

- Scope: components with inline German labels/placeholders.
- Goal: route all user-facing strings through `useTranslation`.
- Acceptance: no new hard-coded UI strings; EN+DE entries added.

## 2) Hook dependency warnings

- Scope: files with `react-hooks/exhaustive-deps` warnings.
- Goal: convert side-effect callbacks to `useCallback` or adjust dependency lists safely.
- Acceptance: warning count reduced with no behavior regression.

## 3) Fast-refresh warnings in UI primitives

- Scope: `src/components/ui/*` files flagged by `react-refresh/only-export-components`.
- Goal: move constants/helpers into separate utility files where needed.
- Acceptance: warning count reduced while preserving component API.

## 4) Bundle splitting

- Scope: router/pages and heavy components.
- Goal: reduce the largest JS chunk reported by Vite build.
- Acceptance: `npm run build` shows smaller largest chunk than baseline.

## 5) Debate listing localization polish

- Scope: debate cards, leaderboard labels, admin forms.
- Goal: complete translation key coverage and remove mixed-language UI states.
- Acceptance: switching EN/DE updates all visible labels in touched views.

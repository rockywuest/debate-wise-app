# Security Code Scanning Status

Last updated: April 4, 2026

## Current open items from GitHub code scanning

1. `CodeReviewID` (high)
   - Status: open
   - Why open: Scorecard reports not enough merged changesets with review approvals in repository history.
   - What closes it: merge upcoming changes via pull requests with explicit approvals from another reviewer account.
   - SOP: `docs/SOP_CODE_REVIEW_ALERT.md`
   - Tracking issue: [#49](https://github.com/rockywuest/debate-wise-app/issues/49)

2. `CIIBestPracticesID` (low)
   - Status: open
   - Why open: no OpenSSF Best Practices badge project entry exists yet for this repository.
   - What closes it: register the project at [bestpractices.dev](https://www.bestpractices.dev/projects/new) and add the badge to `README.md`.
   - SOP: `docs/SOP_OPENSSF_BADGE_ALERT.md`
   - Tracking issue: [#48](https://github.com/rockywuest/debate-wise-app/issues/48)

## Recently closed

- `VulnerabilitiesID` (high): closed after lockfile remediation and clean `npm audit`.
- `FuzzingID` (medium): closed after adding property-based fuzz tests in `src/utils/inputValidation.fuzz.test.ts`.

## Maintainer checklist to close the remaining structural open items

1. Add at least one trusted second reviewer account (or collaborator).
2. Enforce review-first merges for all feature/security pull requests.
3. Register this repository on OpenSSF Best Practices and add badge link in the README.
4. Re-run Scorecard workflow and confirm all related alerts are closed.

## Direct operating references

- `docs/SOP_CODE_REVIEW_ALERT.md`
- `docs/SOP_OPENSSF_BADGE_ALERT.md`
- `https://github.com/rockywuest/debate-wise-app/issues/49`
- `https://github.com/rockywuest/debate-wise-app/issues/48`

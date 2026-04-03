# Security Code Scanning Status

Last updated: April 3, 2026

## Current open items from GitHub code scanning

1. `CodeReviewID` (high)
   - Status: open
   - Why open: Scorecard reports not enough merged changesets with review approvals in repository history.
   - What closes it: merge upcoming changes via pull requests with explicit approvals from another reviewer account.

2. `CIIBestPracticesID` (low)
   - Status: open
   - Why open: no OpenSSF Best Practices badge project entry exists yet for this repository.
   - What closes it: register the project at [bestpractices.dev](https://www.bestpractices.dev/projects/new) and add the badge to `README.md`.

3. `VulnerabilitiesID` (high)
   - Status: remediation committed
   - Why open: Scorecard detected vulnerable dependencies in lockfile state from prior merge activity.
   - Remediation: dependency tree was repaired using `npm audit fix`; local `npm audit` is now at zero vulnerabilities.
   - Expected close condition: alert closes after Scorecard runs on `main` with the updated lockfile.

## Recently closed

- `FuzzingID` (medium): closed after adding property-based fuzz tests in `src/utils/inputValidation.fuzz.test.ts`.

## Maintainer checklist to close the remaining structural open items

1. Add at least one trusted second reviewer account (or collaborator).
2. Enforce review-first merges for all feature/security pull requests.
3. Register this repository on OpenSSF Best Practices and add badge link in the README.
4. Re-run Scorecard workflow and confirm all related alerts are closed.

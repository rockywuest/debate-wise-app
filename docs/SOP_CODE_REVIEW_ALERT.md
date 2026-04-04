# SOP: Close `CodeReviewID` (Scorecard)

Last updated: April 4, 2026

## Goal

Close the open GitHub code-scanning alert `CodeReviewID` by ensuring merged changes are consistently reviewed by a second trusted account.

## Why this alert stays open

Scorecard evaluates repository history. A single reviewed PR is not always enough to immediately clear the signal.

## Required preconditions

- At least two GitHub accounts with repository access:
  - maintainer account (`@rockywuest`)
  - second trusted reviewer account
- Branch protection on `main` requiring approving reviews.

## Procedure

1. Add or verify a second reviewer account with `Write` access in repository settings.
2. Enforce branch protection for `main`:
   - require pull request before merge
   - require at least 1 approving review
   - require approval of the most recent reviewable push
   - block direct pushes
3. For each change, open a PR from a feature branch (never push directly to `main`).
4. Ask the second account to review and approve.
5. Merge only after approval.
6. Repeat for multiple merged PRs so Scorecard sees a stable review pattern.
7. Trigger and verify:
   - run `scorecard.yml` on `main`
   - check code-scanning alert state

## Verification checklist

- [ ] A second reviewer account is active on the repository.
- [ ] `main` branch protection requires PR review approval.
- [ ] Latest merges to `main` came through approved PRs.
- [ ] Scorecard workflow completed successfully on `main`.
- [ ] `CodeReviewID` is closed in code scanning.


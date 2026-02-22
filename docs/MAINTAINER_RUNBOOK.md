# Maintainer Runbook

This runbook gives maintainers a lightweight, repeatable operating model.

## Weekly

1. Review new issues and PRs for first response within 48 hours.
2. Re-label and scope incoming items (`bug`, `feature`, `good first issue`, `needs-info`).
3. Check CI and security automation status (CI, Dependabot, CodeQL, Scorecard).

## Monthly

1. Refresh `docs/GOOD_FIRST_ISSUES.md`.
2. Publish a brief roadmap and release update.
3. Review stale workflow actions and reopen valid threads quickly.
4. Audit `docs/MARKET_READINESS.md` and adjust status to actual state.

## Release Cadence

1. Ensure `npm run check` passes locally.
2. Merge queued fixes/features with clear PR titles.
3. Let release drafter build release notes.
4. Publish release and call out contributor credits.

## Escalation Paths

- Security: `SECURITY.md`
- Conduct: `CODE_OF_CONDUCT.md`
- Major design change: RFC process in `docs/RFC_PROCESS.md`

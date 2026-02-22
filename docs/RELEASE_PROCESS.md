# Release Process

## Release Cadence

- default target: one release per week
- urgent hotfixes can ship any time

## Branching

- `main` is the release branch
- all changes land through pull requests with green checks

## Pre-Release Checklist

Run locally:

```bash
npm run check
```

Verify:

- migration impact reviewed (if database changes exist)
- docs updated for behavior changes
- i18n impact reviewed (EN/DE)
- security-sensitive changes reviewed by maintainer

## Tagging

Use semantic tags:

- `v0.x.y` while pre-1.0

## Release Notes Format

Each release note should include:

- highlights
- breaking changes (if any)
- migration notes
- contributor acknowledgements
- known limitations

## Rollback

If release quality is not acceptable:

1. revert problematic commits from `main`
2. redeploy last known good build
3. publish incident summary and mitigation plan

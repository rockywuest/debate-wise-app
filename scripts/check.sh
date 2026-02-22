#!/usr/bin/env bash
set -euo pipefail

echo "==> Lint"
npm run lint

echo "==> Typecheck"
npm run typecheck

echo "==> Test"
npm run test

echo "==> Build"
npm run build

echo "==> Security audit (prod deps)"
npm run audit:prod

echo "All checks passed."

#!/usr/bin/env bash
set -euo pipefail

echo "==> Lint"
npm run lint

echo "==> i18n consistency"
npm run check:i18n

echo "==> Typecheck"
npm run typecheck

echo "==> Test"
npm run test

echo "==> Build"
npm run build

echo "==> Route smoke checks"
npm run smoke:routes

echo "==> Security audit (prod deps)"
npm run audit:prod

echo "All checks passed."

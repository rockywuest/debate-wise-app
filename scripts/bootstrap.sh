#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing dependencies"
npm ci

if [[ ! -f ".env" && -f ".env.example" ]]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
fi

echo "==> Verifying baseline"
npm run typecheck

echo "Bootstrap complete."

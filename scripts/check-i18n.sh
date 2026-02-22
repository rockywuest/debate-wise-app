#!/usr/bin/env bash
set -euo pipefail

LEGACY_PATTERN="const text = (en: string, de: string) => (language === 'de' ? de : en);"

matches="$(rg -n --glob '!src/pages/Landing.tsx' --fixed-strings "$LEGACY_PATTERN" src || true)"

if [[ -n "$matches" ]]; then
  echo "Legacy inline i18n helper detected. Use useLocalizedText() from src/utils/i18n.ts instead."
  echo
  echo "$matches"
  exit 1
fi

echo "i18n consistency check passed."

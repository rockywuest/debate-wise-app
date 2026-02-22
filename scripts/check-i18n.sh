#!/usr/bin/env bash
set -euo pipefail

LEGACY_PATTERN="const text = (en: string, de: string) => (language === 'de' ? de : en);"

if command -v rg >/dev/null 2>&1; then
  matches="$(rg -n --fixed-strings "$LEGACY_PATTERN" src || true)"
else
  matches="$(grep -RFn -- "$LEGACY_PATTERN" src || true)"
fi

if [[ -n "$matches" ]]; then
  echo "Legacy inline i18n helper detected. Use useLocalizedText() from src/utils/i18n.ts instead."
  echo
  echo "$matches"
  exit 1
fi

echo "i18n consistency check passed."

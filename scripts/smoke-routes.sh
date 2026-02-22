#!/usr/bin/env bash
set -euo pipefail

PORT="${SMOKE_PORT:-4173}"
HOST="${SMOKE_HOST:-127.0.0.1}"
BASE_URL="http://${HOST}:${PORT}"
TMP_DIR="$(mktemp -d)"
SERVER_LOG="${TMP_DIR}/preview.log"
SERVER_PID=""

cleanup() {
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
  rm -rf "${TMP_DIR}"
}

trap cleanup EXIT

echo "==> Starting preview server on ${BASE_URL}"
npm run preview -- --host "${HOST}" --port "${PORT}" --strictPort >"${SERVER_LOG}" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 40); do
  if curl -fsS "${BASE_URL}/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

if ! curl -fsS "${BASE_URL}/" >/dev/null 2>&1; then
  echo "Preview server failed to become ready."
  echo "Server log:"
  cat "${SERVER_LOG}"
  exit 1
fi

check_route() {
  local route="$1"
  local body_file="${TMP_DIR}/body-$(echo "${route}" | tr '/:' '__').html"
  local status_code

  status_code="$(curl -sS -o "${body_file}" -w "%{http_code}" "${BASE_URL}${route}")"
  if [[ "${status_code}" != "200" ]]; then
    echo "Smoke check failed for route '${route}': status ${status_code}"
    exit 1
  fi

  if ! grep -q 'id="root"' "${body_file}"; then
    echo "Smoke check failed for route '${route}': missing root mount node"
    exit 1
  fi
}

echo "==> Running route smoke checks"
check_route "/"
check_route "/auth"
check_route "/debates"
check_route "/leaderboard"
check_route "/debates/00000000-0000-0000-0000-000000000000"

echo "Route smoke checks passed."

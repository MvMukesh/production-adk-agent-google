#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"
cd "${FRONTEND_DIR}"

if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT_DIR}/.env"
  set +a
fi

export ADK_API_BASE="${ADK_API_BASE:-http://localhost:8000}"
HOST="${NEXT_HOST:-0.0.0.0}"
PORT="${NEXT_PORT:-3000}"

is_port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -tln | grep -q ":${port} "
    return $?
  fi
  (echo >/dev/tcp/127.0.0.1/"${port}") >/dev/null 2>&1
}

if is_port_in_use "${PORT}"; then
  echo "WARNING: Port ${PORT} is already in use."
  FOUND=""
  for candidate in $(seq "${PORT}" $((PORT + 20))); do
    if ! is_port_in_use "${candidate}"; then
      FOUND="${candidate}"
      break
    fi
  done
  if [[ -z "${FOUND}" ]]; then
    echo "ERROR: No free port found in range ${PORT}-$((PORT + 20))."
    exit 1
  fi
  echo "         Using port ${FOUND} instead."
  PORT="${FOUND}"
fi

if [[ ! -d node_modules ]]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Starting frontend (Next.js) on ${HOST}:${PORT}"
echo "  UI URL:  http://localhost:${PORT}"
echo "  API URL: ${ADK_API_BASE}"
echo

exec npm run dev -- -p "${PORT}" -H "${HOST}"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export PYTHONUNBUFFERED=1
export PYTHONPATH="${ROOT_DIR}${PYTHONPATH:+:${PYTHONPATH}}"

HOST="${ADK_API_HOST:-0.0.0.0}"
PORT="${ADK_API_PORT:-8000}"
AGENTS_DIR="${ADK_AGENTS_DIR:-agents}"
DB_URL="${ADK_DB_URL:-sqlite:///./data/sessions.db}"

# Resolve a free port if the requested one is already taken.
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
    echo "Stop the conflicting process or set ADK_API_PORT to a free port."
    exit 1
  fi
  echo "         Using port ${FOUND} instead."
  echo "         Update ADK_API_BASE=http://localhost:${FOUND} in .env."
  PORT="${FOUND}"
fi

mkdir -p data

echo "Starting ADK API server"
echo "  Host:     ${HOST}:${PORT}"
echo "  Agents:   ${AGENTS_DIR}"
echo "  Sessions: ${DB_URL}"
echo "  API URL:  http://localhost:${PORT}"
echo
echo "Endpoints (API has no home page at /):"
echo "  Swagger UI:  http://localhost:${PORT}/docs"
echo "  List agents: http://localhost:${PORT}/list-apps"
echo "  Next.js UI:  run 'make run-ui' → http://localhost:3000"
echo

LOG_LEVEL="${ADK_LOG_LEVEL:-info}"
ADK_FLAGS=(--log_level "${LOG_LEVEL}")
if [[ "${ADK_VERBOSE:-0}" == "1" ]]; then
  ADK_FLAGS=(-v)
fi

exec adk api_server "${ADK_FLAGS[@]}" "${AGENTS_DIR}" \
  --host "${HOST}" \
  --port "${PORT}" \
  --session_service_uri "${DB_URL}"

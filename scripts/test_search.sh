#!/usr/bin/env bash
set -euo pipefail

API_BASE="${ADK_API_BASE:-http://localhost:8000}"
APP_NAME="${ADK_APP_NAME:-simple}"
USER_ID="${ADK_USER_ID:-test-user}"
SESSION_ID="test-$(date +%s)"
QUESTION="${1:-What is retrieval augmented generation?}"

echo "== Health check =="
curl -sf "${API_BASE}/list-apps" || { echo "API not reachable at ${API_BASE}"; exit 1; }

echo
echo "== Create session =="
curl -s -X POST "${API_BASE}/apps/${APP_NAME}/users/${USER_ID}/sessions/${SESSION_ID}" \
  -H "Content-Type: application/json" -d '{}'

echo
echo "== Ask =="
curl -s -X POST "${API_BASE}/run" -H "Content-Type: application/json" -d @- <<JSON
{
  "app_name": "${APP_NAME}",
  "user_id": "${USER_ID}",
  "session_id": "${SESSION_ID}",
  "new_message": {"role":"user","parts":[{"text":"${QUESTION}"}]}
}
JSON

echo
echo "== Done =="

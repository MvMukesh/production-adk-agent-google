#!/usr/bin/env bash
set -euo pipefail

: "${APP_URL:?Set APP_URL to your Cloud Run service URL}"

AUTH=()
if [[ -n "${TOKEN:-}" ]]; then
  AUTH=(-H "Authorization: Bearer $TOKEN")
fi

APP_NAME="${ADK_APP_NAME:-simple}"
USER_ID="${ADK_USER_ID:-demo_user}"
SESSION_ID="${SESSION_ID:-session-$(date +%s)}"

echo "== List apps =="
curl -sS "${AUTH[@]}" "$APP_URL/list-apps" | python3 -m json.tool || true

echo
echo "== Create session =="
curl -sS "${AUTH[@]}" -X POST \
  "$APP_URL/apps/$APP_NAME/users/$USER_ID/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" -d '{}' | python3 -m json.tool || true

echo
echo "== Run =="
curl -sS "${AUTH[@]}" -X POST "$APP_URL/run" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_name\": \"$APP_NAME\",
    \"user_id\": \"$USER_ID\",
    \"session_id\": \"$SESSION_ID\",
    \"new_message\": {
      \"role\": \"user\",
      \"parts\": [{\"text\": \"What is the capital of Canada?\"}]
    }
  }" | python3 -m json.tool || true

echo
echo "== Done =="

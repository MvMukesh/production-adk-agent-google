#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

: "${GOOGLE_CLOUD_PROJECT:?Set GOOGLE_CLOUD_PROJECT}"
: "${GOOGLE_CLOUD_LOCATION:?Set GOOGLE_CLOUD_LOCATION}"

SERVICE_NAME="${CLOUD_RUN_SERVICE_NAME:-adk-agent-service}"
APP_NAME="${ADK_APP_NAME:-simple}"
AGENT_PATH="${CLOUD_RUN_AGENT_PATH:-agents/simple}"
USE_VERTEX="${GOOGLE_GENAI_USE_VERTEXAI:-False}"

echo "== Deploying ADK agent to Cloud Run =="
echo "Project:  $GOOGLE_CLOUD_PROJECT"
echo "Region:   $GOOGLE_CLOUD_LOCATION"
echo "Service:  $SERVICE_NAME"
echo "App:      $APP_NAME"
echo "Agent:    $AGENT_PATH"
echo "Vertex:   $USE_VERTEX"
echo

export GOOGLE_GENAI_USE_VERTEXAI="$USE_VERTEX"

adk deploy cloud_run \
  --project="$GOOGLE_CLOUD_PROJECT" \
  --region="$GOOGLE_CLOUD_LOCATION" \
  --service_name="$SERVICE_NAME" \
  --app_name="$APP_NAME" \
  --with_ui \
  "$AGENT_PATH"

echo
echo "Deploy complete. Use the service URL printed above."
echo "Test with: APP_URL=<url> bash infra/cloud-run/test.sh"

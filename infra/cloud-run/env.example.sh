#!/usr/bin/env bash
# Copy to env.sh, edit values, then: source infra/cloud-run/env.example.sh

# GCP project
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
export GOOGLE_CLOUD_LOCATION="us-central1"

# Auth mode: True = Vertex AI, False = AI Studio API key
export GOOGLE_GENAI_USE_VERTEXAI=False

# AI Studio (when GOOGLE_GENAI_USE_VERTEXAI=False)
# export GOOGLE_API_KEY="your-ai-studio-api-key"

# Deploy target — folder under agents/ (simple | reading_list | capital)
export CLOUD_RUN_SERVICE_NAME="adk-agent-service"
export CLOUD_RUN_AGENT_PATH="agents/simple"
export ADK_APP_NAME="simple"

#!/usr/bin/env bash
set -euo pipefail

: "${GOOGLE_CLOUD_PROJECT:?Set GOOGLE_CLOUD_PROJECT}"

echo "Enabling GCP APIs for Cloud Run deployment..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  logging.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com \
  --project "$GOOGLE_CLOUD_PROJECT"

echo "Done."

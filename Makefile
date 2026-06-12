.PHONY: help install install-dev run-api run-cli test docker-up docker-down deploy enable-gcp clean

ROOT := $(shell pwd)
export PYTHONPATH := $(ROOT)$(if $(PYTHONPATH),:$(PYTHONPATH),)

help:
	@echo "Production ADK Agent — available targets:"
	@echo "  make install       Install production dependencies"
	@echo "  make install-dev   Install dev dependencies"
	@echo "  make run-api       Start ADK API server (all agents)"
	@echo "  make run-cli       Start reading-list CLI (persistent SQLite)"
	@echo "  make test          Run unit tests"
	@echo "  make docker-up     Start Docker Compose stack"
	@echo "  make docker-down   Stop Docker Compose stack"
	@echo "  make enable-gcp    Enable required GCP APIs"
	@echo "  make deploy        Deploy agent to Cloud Run"
	@echo "  make clean         Remove caches and runtime artifacts"

install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements-dev.txt

run-api:
	bash scripts/run_api_server.sh

run-cli:
	bash scripts/run_reading_list_cli.sh

test:
	pytest tests/ -v

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

enable-gcp:
	bash infra/cloud-run/enable_apis.sh

deploy:
	bash infra/cloud-run/deploy.sh

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true

# production-adk-agent-google

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Google ADK](https://img.shields.io/badge/Google-ADK-4285F4)](https://google.github.io/adk-docs/)
[![Cloud Run](https://img.shields.io/badge/Deploy-Cloud%20Run-4285F4)](https://cloud.google.com/run)

> Production-grade AI agent platform built with **Google ADK** — custom tools, persistent session state, REST API, **Next.js** dashboard, and **Google Cloud Run** deployment.

**Live repo:** [github.com/MvMukesh/production-adk-agent-google](https://github.com/MvMukesh/production-adk-agent-google)

---

## Situation → Task → Action → Result

| | |
|---|---|
| **Situation** | Shipped an AI pipeline for document verification (KYC, policy docs). Operations teams still spent **15–30+ minutes** per FNOL on lookup, drafting, and consistency checks. |
| **Task** | Design a safe internal copilot that could speed up first response without replacing licensed adjusters or bypassing compliance. |
| **Action** | Built an ADK-based agent with custom tools (customer plan, open-claim load, KB search). Added persistent session/state for repeat claimants. Wrapped the agent in a REST API. Built a **Next.js** dashboard for adjusters. Deployed to **Google Cloud Run** with IAM/service accounts. |
| **Result** | Faster draft generation for FNOL intake · More consistent responses grounded in policy KB · Clear audit path: memory, RAG chunks, and tool traces for every recommendation. |

---

## Highlights

| Capability | Implementation |
|------------|----------------|
| **Agent orchestration** | [Google ADK](https://google.github.io/adk-docs/) — instruction engineering, tool design, multi-agent routing |
| **Custom tools** | CRUD function calling + Tavily MCP web search |
| **Persistent state** | SQLite-backed sessions survive restarts (`DatabaseSessionService`) |
| **REST API** | ADK FastAPI server — `/run`, `/list-apps`, session CRUD |
| **Frontend** | Next.js 15 App Router + Tailwind — server-side API proxy, no CORS |
| **Deployment** | Docker Compose locally · Cloud Run + GCP IAM in production |
| **Observability** | Tool-trace panel, search-query extraction, event JSON audit |

---

## Architecture

```mermaid
flowchart TB
    subgraph Client
        UI[Next.js Dashboard<br/>:3000]
    end

    subgraph Proxy
        API_Routes["/api/* routes<br/>(server-side proxy)"]
    end

    subgraph Backend
        ADK[ADK API Server<br/>:8000]
        DB[(SQLite<br/>sessions.db)]
    end

    subgraph Agents
        S[simple<br/>Tavily search]
        R[reading_list<br/>CRUD + memory]
        C[capital<br/>smoke test]
    end

    subgraph External
        G[Gemini API]
        T[Tavily MCP]
    end

    UI --> API_Routes --> ADK
    ADK --> DB
    ADK --> S & R & C
    S --> G & T
    R & C --> G
```

```
production-adk-agent-google/
├── frontend/          Next.js 15 dashboard (App Router + Tailwind)
├── agents/
│   ├── simple/        Q&A + Tavily MCP web search
│   ├── reading_list/  Persistent CRUD tools + SQLite memory
│   └── capital/       Minimal Cloud Run smoke-test agent
├── common/            Shared ADK HTTP client + event parser
├── config/            Centralized env settings
├── apps/cli/          Standalone reading-list CLI
├── infra/cloud-run/   GCP deploy scripts
├── scripts/           Run + smoke-test helpers
├── tests/             Unit tests (pytest)
└── docker-compose.yml Local production-like stack
```

---

## Quick start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** (Next.js frontend)
- **npx** (Tavily MCP for the search agent)
- API keys: [Google AI Studio](https://aistudio.google.com/apikey) · [Tavily](https://tavily.com/)

### 1. Clone & configure

```bash
git clone https://github.com/MvMukesh/production-adk-agent-google.git
cd production-adk-agent-google

cp .env.example .env
# Edit .env — set GOOGLE_API_KEY and TAVILY_API_KEY
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
make install-frontend
```

### 3. Run locally

```bash
# Terminal 1 — ADK API (all agents, SQLite sessions)
make run-api

# Terminal 2 — Next.js dashboard
make run-ui
```

Open **http://localhost:3000** → select an agent → chat.

The Next.js app proxies ADK calls through `/api/*` routes server-side. Set `ADK_API_BASE=http://localhost:8000` in `.env`.

### Smoke test (curl)

```bash
bash scripts/test_search.sh "What is RAG?"
ADK_APP_NAME=reading_list bash scripts/test_search.sh "Add Clean Code to my list"
```

### Reading-list CLI

```bash
make run-cli
```

---

## Agents

| Agent | App name | Tools | Use case |
|-------|----------|-------|----------|
| Research Assistant | `simple` | Tavily MCP search | Factual Q&A with web grounding + source citations |
| Reading List Curator | `reading_list` | CRUD state tools | Personal reading list with cross-session memory |
| Quick Facts | `capital` | None | Minimal Q&A · Cloud Run smoke test |

---

## Docker

```bash
cp .env.example .env   # set your keys
make docker-up
```

| Service | URL |
|---------|-----|
| API | http://localhost:8000 |
| UI | http://localhost:3000 |
| Sessions | Docker volume `adk-data` |

---

## Cloud Run deployment

```bash
# 1. Configure GCP
cp infra/cloud-run/env.example.sh infra/cloud-run/env.sh
# Edit env.sh with your project ID
source infra/cloud-run/env.sh

# 2. Enable APIs
make enable-gcp

# 3. Deploy (default: agents/simple)
make deploy

# 4. Test
export APP_URL="https://your-service-url"
bash infra/cloud-run/test.sh
```

Deploy a different agent:

```bash
export CLOUD_RUN_AGENT_PATH=agents/reading_list
export ADK_APP_NAME=reading_list
make deploy
```

---

## Development

```bash
pip install -r requirements-dev.txt
make test                          # pytest unit tests
make clean                         # remove caches
cd frontend && npm run build       # verify production build
```

### Makefile targets

| Target | Description |
|--------|-------------|
| `make run-api` | Start ADK API server (port 8000, auto-fallback) |
| `make run-ui` | Start Next.js dev server (port 3000) |
| `make run-cli` | Interactive reading-list CLI |
| `make install-frontend` | `npm install` in `frontend/` |
| `make docker-up` | Build & start Docker Compose stack |
| `make deploy` | Deploy to Google Cloud Run |
| `make test` | Run unit tests |

---

## Configuration

See [`.env.example`](.env.example) for all variables.

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_API_KEY` | — | **Required** — Gemini API key |
| `TAVILY_API_KEY` | — | **Required** for search agent |
| `ADK_API_BASE` | `http://localhost:8000` | ADK API URL (Next.js proxy target) |
| `ADK_DB_URL` | `sqlite:///./data/sessions.db` | Persistent session storage |
| `ADK_APP_NAME` | `simple` | Default agent |
| `AGENT_MODEL` | `gemini-2.0-flash` | Gemini model |
| `NEXT_PORT` | `3000` | Next.js dev server port |
| `CLOUD_RUN_AGENT_PATH` | `agents/simple` | Agent folder for deploy |

---

## Problem → Solution

**Problem:** After automating document/KYC extraction, claims adjusters still manually triaged FNOL cases, searched policy SOPs, and drafted coverage notes.

**Solution:** A production-pattern agent platform with Google ADK — custom tools, persistent memory, REST API layer, adjuster dashboard, and Cloud Run deployment. Designed for **human-in-the-loop** safety: AI recommends; adjuster approves. Includes audit context (memory + KB + tool traces).

| Layer | Gap at company | What this repo solves |
|-------|------------------|----------------------|
| Upstream | OCR + LLM extracted doc fields | — |
| Downstream | Manual FNOL triage + SOP search | Multi-step agent reasoning |
| Compliance | Black-box chatbots are risky | Human approves every draft |
| Scale | Peak claim volume spikes | Cloud Run auto-scales API |
| Audit | Regulators ask "why?" | Tool traces + RAG + memory audit trail |

---

## Security

- Never commit `.env` — use `.env.example` as template
- Rotate any keys previously stored in tutorial `.env` files
- Local ADK API has **no auth** — use IAM + identity tokens on Cloud Run for production
- Inject secrets via **GCP Secret Manager** in production deployments

---

## License

MIT — see [LICENSE](LICENSE).

Copyright © 2026 [Mukesh Manral](https://github.com/MvMukesh)

# production-adk-agent-google

### `Situation`
Shipped an AI pipeline for document verification (KYC, policy docs). Operations teams still spent `15–30+ minutes` per FNOL on lookup, drafting, and consistency checks.

### `Task`
Design a safe internal copilot that could speed up first response without replacing licensed adjusters or bypassing compliance.

### `Action`
- Built an ADK-based agent with custom tools (customer plan, open-claim load, KB search)
- Added persistent session/state so repeat claimants and corporate accounts get consistent context
- Wrapped the agent in FastAPI so it could sit beside existing microservices
- Built a dashboard for adjusters (create claim → review AI draft → accept/edit)
- Deployed to Google Cloud Run with IAM/service accounts for a production-like GCP setup

### `Result` 
- Faster draft generation for FNOL intake
- More consistent responses grounded in policy KB
- Clear audit path: what memory, RAG chunks, and tools informed each recommendation


----

Identified post-KYC workflow bottleneck in claims FNOL intake
- Designed and built an internal AI copilot using:
  - `Google ADK` with custom tools
  - Persistent session memory and
  - RAG-grounded recommendations
    
Exposed via FastAPI, adjuster UI, deployed on Google Cloud Run (human-in-the-loop for compliance).

---

# Highlights

- **Google ADK** — agent orchestration, tool design, and instruction engineering
- **Agent tools** — CRUD operations and custom function calling
- **Persistent state** — session data across multi-turn conversations
- **FastAPI** — REST API exposing agent capabilities
- **Streamlit** — interactive frontend for agent interaction
- **Google Cloud Run** — serverless production deployment
- **GCP IAM** — service accounts, roles, and API access configuration


# Problem
Insurance Claims Agent (Google ADK)

`Motivated by real insurtech workflow gaps`: after automating document/KYC extraction, claims adjusters still manually triaged FNOL cases, searched policy SOPs, and drafted coverage notes.

# Solution 
Built a production-pattern agent with Google ADK — custom tools, persistent memory across sessions,FastAPI REST layer, dashboard for licensed adjusters, and Cloud Run deployment on GCP.

Designed for human-in-the-loop safety: AI recommends; adjuster approves. Includes audit context (memory + KB + tool traces) for operational transparency.


----

| Layer | Problem at company | What the ADK agent solves |
|-------|-------------------|----------------------------|
| **Upstream (already solved)** | OCR + LLM extracted fields from ID/policy docs | — |
| **Downstream (the gap)** | Adjusters manually triage FNOL, search SOPs, recall prior cases | Agent orchestrates multi-step reasoning |
| **Compliance** | Black-box chatbots are risky in insurance | Human approves every draft before it's sent |
| **Scale** | Peak claim volume spikes after incidents | Cloud Run scales API without managing servers |
| **Audit** | Regulators ask "why was this decision made?" | Tool traces + RAG context + memory audit trail |

# production-adk-agent-google

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

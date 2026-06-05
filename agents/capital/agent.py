"""Minimal capital Q&A agent for Cloud Run smoke tests."""

from __future__ import annotations

from google.adk.agents.llm_agent import Agent

from config.settings import get_settings

_settings = get_settings()
_settings.validate_google_api_key()

root_agent = Agent(
    model=_settings.agent_model,
    name="capital",
    instruction=(
        "You answer concisely. If asked for a country's capital, reply with just the capital name "
        "and a short confirmation (one sentence). If the question is unrelated, answer helpfully "
        "in 2-4 sentences."
    ),
)

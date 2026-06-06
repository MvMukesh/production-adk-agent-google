"""Standalone CLI for the reading-list agent with persistent SQLite sessions."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService

from agents.reading_list.agent import root_agent
from common.cli_helpers import call_agent_async, display_state_async
from config.settings import get_settings

settings = get_settings()
settings.validate_google_api_key()

APP_NAME = "reading_list"
USER_ID = settings.adk_user_id
INITIAL_STATE = {"user_name": "", "reading_list": []}


async def main_async() -> None:
    db_url = settings.adk_db_url
    session_service = DatabaseSessionService(db_url=db_url)

    existing = await session_service.list_sessions(app_name=APP_NAME, user_id=USER_ID)
    if getattr(existing, "sessions", None):
        session_id = existing.sessions[0].id
        print(f"Continuing session: {session_id}")
    else:
        new_session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            state=INITIAL_STATE,
        )
        session_id = new_session.id
        print(f"Created session: {session_id}")

    runner = Runner(
        agent=root_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    print("\nReading List Curator CLI")
    print("Persistent state saved to:", db_url)
    print("Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.strip().lower() in {"exit", "quit"}:
            print("Goodbye! Your reading list has been saved.")
            break

        await display_state_async(session_service, APP_NAME, USER_ID, session_id, "BEFORE")
        await call_agent_async(runner, USER_ID, session_id, user_input)
        await display_state_async(session_service, APP_NAME, USER_ID, session_id, "AFTER")


if __name__ == "__main__":
    asyncio.run(main_async())

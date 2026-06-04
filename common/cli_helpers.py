"""Terminal helpers for the reading-list CLI."""

from __future__ import annotations

from google.genai import types


class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    BLACK = "\033[30m"
    CYAN = "\033[36m"
    BG_BLUE = "\033[44m"
    BG_GREEN = "\033[42m"
    BG_RED = "\033[41m"


async def display_state_async(session_service, app_name, user_id, session_id, label="State"):
    try:
        session = await session_service.get_session(
            app_name=app_name, user_id=user_id, session_id=session_id
        )
        state = session.state or {}
        print(f"\n{'-' * 12} {label} {'-' * 12}")

        user_name = state.get("user_name", "") or "Unknown"
        print(f"User: {user_name}")

        items = state.get("reading_list", [])
        if not items:
            print("Reading List: [empty]")
        else:
            print("Reading List:")
            for i, item in enumerate(items, 1):
                title = item.get("title", "(untitled)")
                status = item.get("status", "queued")
                tags = ", ".join(item.get("tags", []) or [])
                url = item.get("url", "")
                notes = item.get("notes", "")
                print(f"  {i}. {title}  [{status}]")
                if url:
                    print(f"     URL: {url}")
                if tags:
                    print(f"     Tags: {tags}")
                if notes:
                    print(f"     Notes: {notes}")

        print("-" * (26 + len(label)))
    except Exception as exc:
        print(f"Error displaying state: {exc}")


async def call_agent_async(runner, user_id, session_id, query: str) -> str | None:
    content = types.Content(role="user", parts=[types.Part(text=query)])
    print(f"\n{Colors.BG_GREEN}{Colors.BLACK}{Colors.BOLD}--- Query: {query} ---{Colors.RESET}")

    final_response_text = None
    try:
        async for event in runner.run_async(
            user_id=user_id, session_id=session_id, new_message=content
        ):
            if event.is_final_response():
                if event.content and event.content.parts:
                    part = event.content.parts[0]
                    if getattr(part, "text", None):
                        final_response_text = (part.text or "").strip()
                if final_response_text:
                    print(
                        f"\n{Colors.BG_BLUE}{Colors.BLACK}{Colors.BOLD}"
                        f"=== AGENT RESPONSE ==={Colors.RESET}"
                    )
                    print(f"{Colors.CYAN}{Colors.BOLD}{final_response_text}{Colors.RESET}\n")
    except Exception as exc:
        print(f"Error during agent call: {exc}")

    return final_response_text

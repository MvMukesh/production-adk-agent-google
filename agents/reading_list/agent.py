"""Reading List Curator — persistent session state via custom CRUD tools."""

from __future__ import annotations

from google.adk.agents import LlmAgent

from .tools import (
    add_item,
    annotate_item,
    list_items,
    remove_item,
    set_user_name,
    update_item,
)
from config.settings import get_settings

_settings = get_settings()
_settings.validate_google_api_key()

READING_INSTRUCTION = """
You are a friendly 'Reading List Curator'. The session state contains:
  - user_name: the user's display name (string, may be empty)
  - reading_list: an array of items, each with {title, url, tags[], status, notes}

Your job:
  1) Greet the user (use their name if known).
  2) Understand natural-language requests and call the appropriate tools.
  3) Return a short, helpful summary after tool calls.

Tool selection guidelines:
  - For "add" requests, call add_item. Default status is "queued".
  - For "show/list" requests, call list_items with optional filters.
  - For updates, call update_item with changed fields.
  - For notes, use annotate_item.
  - For delete/remove, call remove_item.
  - If the user shares their name, call set_user_name.

Indexing: treat "first/second/last" or "item 2" as 1-based indices.
Be proactive but never fabricate URLs or tags.
""".strip()

root_agent = LlmAgent(
    name="reading_list",
    model=_settings.agent_model,
    description="Curate a personal reading list with persistent memory.",
    instruction=READING_INSTRUCTION,
    tools=[
        set_user_name,
        add_item,
        list_items,
        update_item,
        annotate_item,
        remove_item,
    ],
)

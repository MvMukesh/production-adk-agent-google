"""CRUD tools for the reading-list agent with persistent session state."""

from __future__ import annotations

from typing import List, Optional

from google.adk.tools.tool_context import ToolContext


def _ensure_state(tool_context: ToolContext) -> None:
    state = tool_context.state
    if "user_name" not in state or state["user_name"] is None:
        state["user_name"] = ""
    if "reading_list" not in state or state["reading_list"] is None:
        state["reading_list"] = []


def _normalize_tags(tags: Optional[List[str]]) -> List[str]:
    if not tags:
        return []
    return [str(t).strip() for t in tags if str(t).strip()]


def _valid_status(status: Optional[str]) -> bool:
    return status in {None, "queued", "reading", "done"}


def set_user_name(name: str, tool_context: ToolContext) -> dict:
    _ensure_state(tool_context)
    old = tool_context.state.get("user_name", "")
    tool_context.state["user_name"] = name or ""
    return {
        "action": "set_user_name",
        "old_name": old,
        "new_name": tool_context.state["user_name"],
        "message": f"Saved your name as '{tool_context.state['user_name'] or 'Unknown'}'.",
    }


def add_item(
    title: str,
    url: str,
    tags: Optional[List[str]],
    status: str,
    notes: str,
    tool_context: ToolContext,
) -> dict:
    _ensure_state(tool_context)
    if not _valid_status(status):
        status = "queued"

    item = {
        "title": title.strip() if title else "(untitled)",
        "url": (url or "").strip(),
        "tags": _normalize_tags(tags),
        "status": status,
        "notes": (notes or "").strip(),
    }
    reading_list = tool_context.state["reading_list"]
    reading_list.append(item)
    tool_context.state["reading_list"] = reading_list

    return {
        "action": "add_item",
        "item": item,
        "index": len(reading_list),
        "message": f"Added '{item['title']}' to your reading list.",
    }


def list_items(
    filter_status: Optional[str] = None,
    filter_tag: Optional[str] = None,
    tool_context: ToolContext = None,
) -> dict:
    _ensure_state(tool_context)
    reading_list = tool_context.state["reading_list"]

    filtered = []
    for item in reading_list:
        if filter_status and item.get("status") != filter_status:
            continue
        if filter_tag and filter_tag not in item.get("tags", []):
            continue
        filtered.append(item)

    return {
        "action": "list_items",
        "count": len(filtered),
        "items": filtered,
        "filters": {"status": filter_status, "tag": filter_tag},
        "message": f"Found {len(filtered)} item(s).",
    }


def update_item(
    index: int,
    title: Optional[str] = None,
    url: Optional[str] = None,
    status: Optional[str] = None,
    notes: Optional[str] = None,
    tags: Optional[List[str]] = None,
    tool_context: ToolContext = None,
) -> dict:
    _ensure_state(tool_context)
    reading_list = tool_context.state["reading_list"]

    if index < 1 or index > len(reading_list):
        return {
            "action": "update_item",
            "status": "error",
            "message": f"No item at position {index}. You currently have {len(reading_list)} item(s).",
        }

    item = reading_list[index - 1]
    before = item.copy()

    if title is not None:
        item["title"] = title.strip() or item["title"]
    if url is not None:
        item["url"] = (url or "").strip()
    if _valid_status(status) and status is not None:
        item["status"] = status
    if notes is not None:
        item["notes"] = (notes or "").strip()
    if tags is not None:
        item["tags"] = _normalize_tags(tags)

    reading_list[index - 1] = item
    tool_context.state["reading_list"] = reading_list

    return {
        "action": "update_item",
        "index": index,
        "before": before,
        "after": item,
        "message": f"Updated item {index} ('{before.get('title', '')}').",
    }


def annotate_item(index: int, notes: str, tool_context: ToolContext) -> dict:
    _ensure_state(tool_context)
    reading_list = tool_context.state["reading_list"]

    if index < 1 or index > len(reading_list):
        return {
            "action": "annotate_item",
            "status": "error",
            "message": f"No item at position {index}. You currently have {len(reading_list)} item(s).",
        }

    item = reading_list[index - 1]
    before_notes = item.get("notes", "")
    item["notes"] = (notes or "").strip()
    reading_list[index - 1] = item
    tool_context.state["reading_list"] = reading_list

    return {
        "action": "annotate_item",
        "index": index,
        "old_notes": before_notes,
        "new_notes": item["notes"],
        "message": f"Noted item {index} ('{item.get('title', '')}').",
    }


def remove_item(index: int, tool_context: ToolContext) -> dict:
    _ensure_state(tool_context)
    reading_list = tool_context.state["reading_list"]

    if index < 1 or index > len(reading_list):
        return {
            "action": "remove_item",
            "status": "error",
            "message": f"No item at position {index}. You currently have {len(reading_list)} item(s).",
        }

    removed = reading_list.pop(index - 1)
    tool_context.state["reading_list"] = reading_list

    return {
        "action": "remove_item",
        "index": index,
        "removed": removed,
        "message": f"Removed '{removed.get('title', '')}' from your reading list.",
    }

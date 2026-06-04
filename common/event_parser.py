"""Parse ADK /run response events into UI-friendly structures."""

from __future__ import annotations

from typing import Any


def normalize_events(response: Any) -> list[dict]:
    if isinstance(response, list):
        return response
    if isinstance(response, dict) and isinstance(response.get("events"), list):
        return response["events"]
    return []


def last_text(events: list[dict]) -> str:
    text = ""
    for event in events:
        parts = (event.get("content") or {}).get("parts", [])
        for part in parts:
            if isinstance(part, dict):
                candidate = part.get("text")
                if isinstance(candidate, str) and candidate.strip():
                    text = candidate.strip()
    return text


def find_queries(events: list[dict]) -> list[str]:
    queries: list[str] = []
    seen: set[str] = set()

    def walk(node: Any) -> None:
        if isinstance(node, dict):
            for key in ("functionCall", "function_call", "tool_request"):
                payload = node.get(key)
                if not isinstance(payload, dict):
                    continue
                args = payload.get("args") or payload.get("arguments") or {}
                query = args.get("query") if isinstance(args, dict) else None
                if isinstance(query, str) and query.strip() and query not in seen:
                    seen.add(query)
                    queries.append(query)
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(events)
    return queries

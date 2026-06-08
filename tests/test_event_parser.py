"""Tests for event_parser."""

from common.event_parser import find_queries, last_text, normalize_events


def test_normalize_events_from_list():
    events = [{"content": {"parts": [{"text": "hello"}]}}]
    assert normalize_events(events) == events


def test_last_text_returns_final():
    events = [
        {"content": {"parts": [{"text": "first"}]}},
        {"content": {"parts": [{"text": "final"}]}},
    ]
    assert last_text(events) == "final"


def test_find_queries():
    events = [{"functionCall": {"args": {"query": "RAG"}}}]
    assert find_queries(events) == ["RAG"]

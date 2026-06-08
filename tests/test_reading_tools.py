"""Tests for reading-list CRUD tools."""

from agents.reading_list.tools import add_item, list_items, remove_item, set_user_name


class FakeState(dict):
    pass


class FakeToolContext:
    def __init__(self):
        self.state = FakeState()


def test_set_user_name():
    ctx = FakeToolContext()
    result = set_user_name("Alice", ctx)
    assert result["new_name"] == "Alice"
    assert ctx.state["user_name"] == "Alice"


def test_add_and_list_items():
    ctx = FakeToolContext()
    add_item("Clean Code", "", None, "queued", "", ctx)
    result = list_items(tool_context=ctx)
    assert result["count"] == 1
    assert result["items"][0]["title"] == "Clean Code"


def test_remove_item():
    ctx = FakeToolContext()
    add_item("Book A", "", None, "queued", "", ctx)
    result = remove_item(1, ctx)
    assert result["action"] == "remove_item"
    assert list_items(tool_context=ctx)["count"] == 0

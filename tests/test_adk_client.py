"""Tests for ADKClient."""

from unittest.mock import MagicMock, patch

import requests

from common.adk_client import ADKClient
from config.settings import Settings


def _client() -> ADKClient:
    return ADKClient(settings=Settings(adk_api_base="http://localhost:8000"))


@patch("common.adk_client.requests.post")
def test_create_session(mock_post):
    mock_post.return_value = MagicMock(status_code=200, raise_for_status=MagicMock())
    sid = _client().create_session("simple", "u1", session_id="s1")
    assert sid == "s1"


@patch("common.adk_client.requests.get")
def test_health_check_ok(mock_get):
    mock_get.return_value = MagicMock(
        status_code=200,
        raise_for_status=MagicMock(),
        json=MagicMock(return_value=["simple", "reading_list"]),
    )
    assert _client().health_check() is True


@patch("common.adk_client.requests.get", side_effect=requests.RequestException("down"))
def test_health_check_fail(_mock_get):
    assert _client().health_check() is False

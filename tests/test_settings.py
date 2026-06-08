"""Tests for settings."""

import os
from unittest.mock import patch

from config.settings import Settings, AVAILABLE_AGENTS


def test_available_agents():
    assert "simple" in AVAILABLE_AGENTS
    assert "reading_list" in AVAILABLE_AGENTS
    assert "capital" in AVAILABLE_AGENTS


def test_settings_defaults():
    with patch.dict(os.environ, {}, clear=True):
        s = Settings.from_env()
    assert s.adk_api_port == 8000
    assert s.adk_db_url.startswith("sqlite:")


def test_validate_google_key():
    s = Settings(google_api_key="")
    try:
        s.validate_google_api_key()
        assert False
    except ValueError:
        pass

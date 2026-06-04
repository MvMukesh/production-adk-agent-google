"""HTTP client for the ADK API server."""

from __future__ import annotations

import uuid
from typing import Any

import requests

from config.settings import Settings, get_settings


class ADKClient:
    """Typed HTTP client for ADK API server endpoints."""

    def __init__(
        self,
        api_base: str | None = None,
        settings: Settings | None = None,
    ) -> None:
        self._settings = settings or get_settings()
        self.api_base = (api_base or self._settings.adk_api_base).rstrip("/")
        self._timeout = self._settings.http_timeout_seconds
        self._run_timeout = self._settings.http_run_timeout_seconds

    def _get(self, path: str) -> Any:
        response = requests.get(f"{self.api_base}{path}", timeout=self._timeout)
        response.raise_for_status()
        return response.json()

    def _post(self, path: str, payload: dict | None = None, *, run: bool = False) -> Any:
        response = requests.post(
            f"{self.api_base}{path}",
            json=payload or {},
            headers={"Content-Type": "application/json"},
            timeout=self._run_timeout if run else self._timeout,
        )
        response.raise_for_status()
        try:
            return response.json()
        except requests.JSONDecodeError:
            return {"raw": response.text}

    def list_apps(self) -> list[str]:
        result = self._get("/list-apps")
        return result if isinstance(result, list) else []

    def list_sessions(self, app_name: str, user_id: str) -> Any:
        return self._get(f"/apps/{app_name}/users/{user_id}/sessions")

    def create_session(
        self,
        app_name: str,
        user_id: str,
        session_id: str | None = None,
        state: dict | None = None,
    ) -> str:
        sid = session_id or f"session-{uuid.uuid4()}"
        self._post(
            f"/apps/{app_name}/users/{user_id}/sessions/{sid}",
            state or {},
        )
        return sid

    def run(
        self,
        app_name: str,
        user_id: str,
        session_id: str,
        message: str,
    ) -> Any:
        payload = {
            "app_name": app_name,
            "user_id": user_id,
            "session_id": session_id,
            "new_message": {"role": "user", "parts": [{"text": message}]},
        }
        return self._post("/run", payload, run=True)

    def health_check(self) -> bool:
        try:
            self.list_apps()
            return True
        except requests.RequestException:
            return False

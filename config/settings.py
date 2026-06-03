"""Centralized settings loaded from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Registered ADK agents (folder name under agents/)
AVAILABLE_AGENTS: tuple[str, ...] = ("simple", "reading_list", "capital")


def _load_env() -> None:
    load_dotenv(PROJECT_ROOT / ".env", override=False)


@dataclass(frozen=True)
class Settings:
    """Application settings for local, Docker, and Cloud Run deployments."""

    # ADK API server
    adk_api_base: str = "http://localhost:8000"
    adk_api_host: str = "0.0.0.0"
    adk_api_port: int = 8000
    adk_app_name: str = "simple"
    adk_user_id: str = "demo_user"
    adk_agents_dir: str = "agents"
    adk_db_url: str = "sqlite:///./data/sessions.db"

    # Model & API keys
    google_api_key: str = ""
    tavily_api_key: str = ""
    agent_model: str = "gemini-2.0-flash"
    tavily_mcp_command: str = "npx"
    tavily_mcp_args: tuple[str, ...] = ("-y", "tavily-mcp")

    # Streamlit
    streamlit_port: int = 8501
    streamlit_host: str = "0.0.0.0"

    # HTTP client
    http_timeout_seconds: int = 60
    http_run_timeout_seconds: int = 120

    # GCP / Cloud Run
    google_cloud_project: str = ""
    google_cloud_location: str = "us-central1"
    google_genai_use_vertexai: bool = False
    cloud_run_service_name: str = "adk-agent-service"
    cloud_run_agent_path: str = "agents/simple"

    # Paths
    project_root: Path = field(default_factory=lambda: PROJECT_ROOT)

    @classmethod
    def from_env(cls) -> Settings:
        _load_env()

        def _int(name: str, default: int) -> int:
            raw = os.getenv(name)
            return int(raw) if raw else default

        def _bool(name: str, default: bool) -> bool:
            raw = os.getenv(name, "").strip().lower()
            if raw in ("1", "true", "yes"):
                return True
            if raw in ("0", "false", "no"):
                return False
            return default

        tavily_args = os.getenv("TAVILY_MCP_ARGS", "-y,tavily-mcp")
        args_tuple = tuple(a.strip() for a in tavily_args.split(",") if a.strip())

        return cls(
            adk_api_base=os.getenv("ADK_API_BASE", "http://localhost:8000"),
            adk_api_host=os.getenv("ADK_API_HOST", "0.0.0.0"),
            adk_api_port=_int("ADK_API_PORT", 8000),
            adk_app_name=os.getenv("ADK_APP_NAME", os.getenv("ADK_APP_SIMPLE", "simple")),
            adk_user_id=os.getenv("ADK_USER_ID", "demo_user"),
            adk_agents_dir=os.getenv("ADK_AGENTS_DIR", "agents"),
            adk_db_url=os.getenv("ADK_DB_URL", "sqlite:///./data/sessions.db"),
            google_api_key=os.getenv("GOOGLE_API_KEY", ""),
            tavily_api_key=os.getenv("TAVILY_API_KEY", ""),
            agent_model=os.getenv("AGENT_MODEL", "gemini-2.0-flash"),
            tavily_mcp_command=os.getenv("TAVILY_MCP_COMMAND", "npx"),
            tavily_mcp_args=args_tuple or ("-y", "tavily-mcp"),
            streamlit_port=_int("STREAMLIT_PORT", 8501),
            streamlit_host=os.getenv("STREAMLIT_HOST", "0.0.0.0"),
            http_timeout_seconds=_int("HTTP_TIMEOUT_SECONDS", 60),
            http_run_timeout_seconds=_int("HTTP_RUN_TIMEOUT_SECONDS", 120),
            google_cloud_project=os.getenv("GOOGLE_CLOUD_PROJECT", ""),
            google_cloud_location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1"),
            google_genai_use_vertexai=_bool("GOOGLE_GENAI_USE_VERTEXAI", False),
            cloud_run_service_name=os.getenv("CLOUD_RUN_SERVICE_NAME", "adk-agent-service"),
            cloud_run_agent_path=os.getenv("CLOUD_RUN_AGENT_PATH", "agents/simple"),
        )

    def validate_google_api_key(self) -> None:
        if not self.google_api_key:
            raise ValueError(
                "GOOGLE_API_KEY is required. Copy .env.example to .env and set your key."
            )

    def validate_tavily_api_key(self) -> None:
        if not self.tavily_api_key:
            raise ValueError(
                "TAVILY_API_KEY is required for the search agent. "
                "Copy .env.example to .env and set your key."
            )

    def validate_cloud_deploy(self) -> None:
        missing = []
        if not self.google_cloud_project:
            missing.append("GOOGLE_CLOUD_PROJECT")
        if not self.google_cloud_location:
            missing.append("GOOGLE_CLOUD_LOCATION")
        if missing:
            raise ValueError(f"Missing Cloud Run settings: {', '.join(missing)}")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings.from_env()

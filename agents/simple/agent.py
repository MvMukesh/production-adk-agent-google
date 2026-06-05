"""Simple Q&A agent with Tavily MCP web search."""

from __future__ import annotations

from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

from config.settings import get_settings

_settings = get_settings()
_settings.validate_google_api_key()
_settings.validate_tavily_api_key()

tavily_tools = MCPToolset(
    connection_params=StdioServerParameters(
        command=_settings.tavily_mcp_command,
        args=list(_settings.tavily_mcp_args),
        env={"TAVILY_API_KEY": _settings.tavily_api_key},
    )
)

SEARCH_INSTRUCTION = """
You are a helpful Q&A assistant.

RULES:
1) For any factual, time-sensitive, or non-trivial question, you MUST first call an MCP web-search tool
   (from the available Tavily tools) using the user's question as the query (or a focused reformulation).
2) After the tool returns results, synthesize a clear 3–6 sentence answer grounded in those results.
3) Briefly cite sources inline (domain or title is fine). Do NOT answer without using the tool unless the
   user explicitly says "no search".
""".strip()

root_agent = Agent(
    model=_settings.agent_model,
    name="simple",
    instruction=SEARCH_INSTRUCTION,
    tools=[tavily_tools],
)

import type { AgentProfile } from "./types";

export const AGENT_CATALOG: Record<string, AgentProfile> = {
  simple: {
    id: "simple",
    label: "Research Assistant",
    tagline: "Web-grounded Q&A",
    description:
      "Answers factual questions using Gemini + Tavily web search with source citations.",
    icon: "🔍",
    placeholder: "What is retrieval augmented generation?",
    suggestedPrompts: [
      "What is retrieval augmented generation?",
      "Latest developments in Google ADK",
      "Compare Gemini vs GPT-4 for agents",
    ],
    showSearchTrace: true,
    supportsPersistentState: false,
  },
  reading_list: {
    id: "reading_list",
    label: "Reading List Curator",
    tagline: "Persistent memory",
    description:
      "Manage your reading list across sessions with SQLite-backed state.",
    icon: "📚",
    placeholder: "Add 'Clean Code' to my reading list",
    suggestedPrompts: [
      "Add 'Designing Data-Intensive Applications' to my list",
      "Show my reading list",
      "Mark item 1 as done",
    ],
    showSearchTrace: false,
    supportsPersistentState: true,
  },
  capital: {
    id: "capital",
    label: "Quick Facts",
    tagline: "Minimal Q&A",
    description: "Lightweight factual agent for quick answers and smoke tests.",
    icon: "🌍",
    placeholder: "What is the capital of Canada?",
    suggestedPrompts: [
      "What is the capital of Japan?",
      "Capital of Brazil?",
      "What is the capital of India?",
    ],
    showSearchTrace: false,
    supportsPersistentState: false,
  },
};

export const AGENT_IDS = Object.keys(AGENT_CATALOG);

export function getAgent(id: string): AgentProfile {
  return AGENT_CATALOG[id] ?? AGENT_CATALOG.simple;
}

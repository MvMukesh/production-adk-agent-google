export interface AgentProfile {
  id: string;
  label: string;
  tagline: string;
  description: string;
  icon: string;
  placeholder: string;
  suggestedPrompts: string[];
  showSearchTrace: boolean;
  supportsPersistentState: boolean;
}

export interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  time: string;
  queries?: string[];
}

export interface AppState {
  apiOnline: boolean;
  latencyMs: number | null;
  availableApps: string[];
  appName: string;
  userId: string;
  sessionId: string | null;
  chatHistory: ChatTurn[];
  lastEvents: unknown[];
}

export interface RunResponse {
  events?: unknown[];
  raw?: string;
}

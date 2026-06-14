/** Browser-side client — calls Next.js API routes (proxy to ADK). */

import type { RunResponse } from "./types";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function checkHealth(): Promise<{
  online: boolean;
  latencyMs: number;
  apps: string[];
}> {
  return apiFetch("/api/health");
}

export async function listApps(): Promise<string[]> {
  const data = await apiFetch<string[] | { apps: string[] }>("/api/apps");
  return Array.isArray(data) ? data : data.apps ?? [];
}

export async function createSession(
  appName: string,
  userId: string,
  initialState?: Record<string, unknown>
): Promise<{ sessionId: string }> {
  return apiFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify({ appName, userId, initialState }),
  });
}

export async function listSessions(
  appName: string,
  userId: string
): Promise<unknown> {
  return apiFetch(
    `/api/sessions?appName=${encodeURIComponent(appName)}&userId=${encodeURIComponent(userId)}`
  );
}

export async function runAgent(
  appName: string,
  userId: string,
  sessionId: string,
  message: string
): Promise<RunResponse> {
  return apiFetch("/api/run", {
    method: "POST",
    body: JSON.stringify({ appName, userId, sessionId, message }),
  });
}

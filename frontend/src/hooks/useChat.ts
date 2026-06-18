"use client";

import { useCallback, useEffect, useState } from "react";
import {
  checkHealth,
  createSession,
  runAgent,
} from "@/lib/adk-client";
import { getAgent } from "@/lib/agents";
import {
  countToolCalls,
  findQueries,
  lastText,
  normalizeEvents,
} from "@/lib/event-parser";
import type { ChatTurn } from "@/lib/types";

const DEFAULT_USER = "demo-user";

export function useChat() {
  const [apiOnline, setApiOnline] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [availableApps, setAvailableApps] = useState<string[]>([]);
  const [appName, setAppName] = useState("simple");
  const [userId, setUserId] = useState(DEFAULT_USER);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
  const [lastEvents, setLastEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    try {
      const h = await checkHealth();
      setApiOnline(h.online);
      setLatencyMs(h.latencyMs);
      setAvailableApps(h.apps);
    } catch {
      setApiOnline(false);
      setLatencyMs(null);
    }
  }, []);

  useEffect(() => {
    refreshHealth();
    const id = setInterval(refreshHealth, 30_000);
    return () => clearInterval(id);
  }, [refreshHealth]);

  const startSession = useCallback(
    async (agent: string, uid: string) => {
      setError(null);
      const agentProfile = getAgent(agent);
      const initialState = agentProfile.supportsPersistentState
        ? { user_name: "", reading_list: [] }
        : undefined;

      try {
        const { sessionId: sid } = await createSession(
          agent,
          uid,
          initialState
        );
        setSessionId(sid);
        setChatHistory([]);
        setLastEvents([]);
        return sid;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Session failed";
        setError(msg);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    if (apiOnline && !sessionId) {
      startSession(appName, userId);
    }
  }, [apiOnline, sessionId, appName, userId, startSession]);

  const selectAgent = useCallback(
    async (id: string) => {
      setAppName(id);
      setChatHistory([]);
      setLastEvents([]);
      setSessionId(null);
      await startSession(id, userId);
    },
    [userId, startSession]
  );

  const newSession = useCallback(async () => {
    setChatHistory([]);
    setLastEvents([]);
    await startSession(appName, userId);
  }, [appName, userId, startSession]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || loading) return;

      let sid = sessionId;
      if (!sid) {
        sid = await startSession(appName, userId);
        if (!sid) return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await runAgent(appName, userId, sid, message);
        const events = normalizeEvents(response);
        setLastEvents(events);

        const answer = lastText(events);
        const queries = getAgent(appName).showSearchTrace
          ? findQueries(events)
          : undefined;

        const turn: ChatTurn = {
          id: crypto.randomUUID(),
          question: message,
          answer: answer || "(empty response)",
          time: new Date().toLocaleTimeString(),
          queries: queries?.length ? queries : undefined,
        };
        setChatHistory((prev) => [...prev, turn]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Run failed");
      } finally {
        setLoading(false);
      }
    },
    [appName, userId, sessionId, loading, startSession]
  );

  const totalToolCalls = countToolCalls(lastEvents);
  const totalQueries = chatHistory.reduce(
    (n, t) => n + (t.queries?.length ?? 0),
    0
  );

  return {
    apiOnline,
    latencyMs,
    availableApps,
    appName,
    userId,
    sessionId,
    chatHistory,
    lastEvents,
    loading,
    error,
    agent: getAgent(appName),
    totalToolCalls,
    totalQueries,
    setUserId,
    selectAgent,
    newSession,
    sendMessage,
    refreshHealth,
  };
}

"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AgentSelector } from "@/components/AgentSelector";
import { MetricsCards } from "@/components/MetricsCards";
import { ChatPanel } from "@/components/ChatPanel";
import { TracePanel } from "@/components/TracePanel";
import { useChat } from "@/hooks/useChat";

export default function HomePage() {
  const chat = useChat();
  const [traceOpen, setTraceOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header apiOnline={chat.apiOnline} latencyMs={chat.latencyMs} />

      {chat.error && (
        <div className="border-b border-red-500/30 bg-red-500/10 px-6 py-2 text-sm text-red-300">
          {chat.error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          userId={chat.userId}
          sessionId={chat.sessionId}
          onUserIdChange={chat.setUserId}
          onNewSession={chat.newSession}
        >
          <AgentSelector
            selected={chat.appName}
            availableApps={chat.availableApps}
            onSelect={chat.selectAgent}
          />
          <div className="mt-6 card p-3">
            <p className="text-xs font-medium text-slate-400">About</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {chat.agent.description}
            </p>
          </div>
        </Sidebar>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl">{chat.agent.icon}</span>
              <h2 className="text-base font-semibold">{chat.agent.label}</h2>
            </div>
            <p className="text-xs text-slate-400">{chat.agent.tagline}</p>
            <div className="mt-3">
              <MetricsCards
                turnCount={chat.chatHistory.length}
                toolCalls={chat.totalToolCalls}
                searchQueries={chat.totalQueries}
              />
            </div>
          </div>

          <ChatPanel
            history={chat.chatHistory}
            placeholder={chat.agent.placeholder}
            suggestedPrompts={chat.agent.suggestedPrompts}
            loading={chat.loading}
            onSend={chat.sendMessage}
          />

          {chat.agent.showSearchTrace && (
            <TracePanel
              events={chat.lastEvents}
              open={traceOpen}
              onToggle={() => setTraceOpen((v) => !v)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

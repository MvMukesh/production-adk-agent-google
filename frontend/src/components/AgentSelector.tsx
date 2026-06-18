"use client";

import { AGENT_CATALOG, AGENT_IDS } from "@/lib/agents";
import type { AgentProfile } from "@/lib/types";
import clsx from "clsx";

interface AgentSelectorProps {
  selected: string;
  availableApps: string[];
  onSelect: (id: string) => void;
}

export function AgentSelector({
  selected,
  availableApps,
  onSelect,
}: AgentSelectorProps) {
  const agents = AGENT_IDS.map((id) => AGENT_CATALOG[id]).filter(Boolean);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Agents
      </h3>
      <div className="space-y-1.5">
        {agents.map((agent: AgentProfile) => {
          const available = availableApps.length === 0 || availableApps.includes(agent.id);
          const active = selected === agent.id;
          return (
            <button
              key={agent.id}
              type="button"
              disabled={!available}
              onClick={() => onSelect(agent.id)}
              className={clsx(
                "w-full rounded-lg border px-3 py-2.5 text-left transition",
                active
                  ? "border-accent/50 bg-accent/10"
                  : "border-transparent hover:bg-white/5",
                !available && "cursor-not-allowed opacity-40"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{agent.icon}</span>
                <span className="text-sm font-medium">{agent.label}</span>
              </div>
              <p className="mt-0.5 pl-7 text-xs text-slate-400">{agent.tagline}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import clsx from "clsx";

interface HeaderProps {
  apiOnline: boolean;
  latencyMs: number | null;
}

export function Header({ apiOnline, latencyMs }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-lg">
          ⚡
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">ADK Agent Studio</h1>
          <p className="text-xs text-slate-400">Google ADK · Production Console</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {latencyMs !== null && (
          <span className="text-xs text-slate-500">{latencyMs}ms</span>
        )}
        <span className={clsx(apiOnline ? "badge-green" : "badge-red")}>
          {apiOnline ? "API Online" : "API Offline"}
        </span>
      </div>
    </header>
  );
}

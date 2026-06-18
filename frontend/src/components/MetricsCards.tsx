"use client";

interface MetricsCardsProps {
  turnCount: number;
  toolCalls: number;
  searchQueries: number;
}

export function MetricsCards({
  turnCount,
  toolCalls,
  searchQueries,
}: MetricsCardsProps) {
  const cards = [
    { label: "Turns", value: turnCount, icon: "💬" },
    { label: "Tool Calls", value: toolCalls, icon: "🔧" },
    { label: "Search Queries", value: searchQueries, icon: "🔍" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="card px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{c.label}</span>
            <span className="text-sm">{c.icon}</span>
          </div>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

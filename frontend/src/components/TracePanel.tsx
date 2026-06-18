"use client";

interface TracePanelProps {
  events: unknown[];
  open: boolean;
  onToggle: () => void;
}

export function TracePanel({ events, open, onToggle }: TracePanelProps) {
  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/5"
      >
        <span>Event Trace ({events.length})</span>
        <span>{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <pre className="max-h-48 overflow-auto border-t border-white/10 bg-black/20 p-3 font-mono text-[10px] leading-relaxed text-slate-400">
          {events.length > 0
            ? JSON.stringify(events, null, 2)
            : "No events yet"}
        </pre>
      )}
    </div>
  );
}

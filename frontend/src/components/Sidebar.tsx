"use client";

interface SidebarProps {
  userId: string;
  sessionId: string | null;
  onUserIdChange: (v: string) => void;
  onNewSession: () => void;
  children?: React.ReactNode;
}

export function Sidebar({
  userId,
  sessionId,
  onUserIdChange,
  onNewSession,
  children,
}: SidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-surface-card/30 p-4">
      <div className="mb-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            User ID
          </label>
          <input
            className="input-field"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder="user-1"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Session
          </label>
          <p className="truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-slate-400">
            {sessionId ?? "No session"}
          </p>
        </div>
        <button type="button" className="btn-ghost w-full" onClick={onNewSession}>
          + New Session
        </button>
      </div>
      {children}
    </aside>
  );
}

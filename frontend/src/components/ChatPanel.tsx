"use client";

import type { ChatTurn } from "@/lib/types";

interface ChatPanelProps {
  history: ChatTurn[];
  placeholder: string;
  suggestedPrompts: string[];
  loading: boolean;
  onSend: (message: string) => void;
}

function formatAnswer(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}

export function ChatPanel({
  history,
  placeholder,
  suggestedPrompts,
  loading,
  onSend,
}: ChatPanelProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const msg = (fd.get("message") as string)?.trim();
    if (!msg || loading) return;
    onSend(msg);
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {history.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-4xl">🤖</p>
            <p className="mt-3 text-sm text-slate-400">
              Ask a question or pick a suggestion below
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="btn-ghost max-w-xs truncate text-xs"
                  onClick={() => onSend(p)}
                  disabled={loading}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {history.map((turn) => (
          <div key={turn.id} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-xl rounded-br-sm bg-accent/20 px-4 py-2.5 text-sm">
                {turn.question}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="card max-w-[85%] px-4 py-3">
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: formatAnswer(turn.answer || "No response"),
                  }}
                />
                {turn.queries && turn.queries.length > 0 && (
                  <div className="mt-2 border-t border-white/10 pt-2">
                    <p className="text-xs text-slate-500">Search queries:</p>
                    <ul className="mt-1 space-y-0.5">
                      {turn.queries.map((q) => (
                        <li key={q} className="font-mono text-xs text-slate-400">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-2 text-right text-[10px] text-slate-600">
                  {turn.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="card px-4 py-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                Agent thinking…
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 p-4"
      >
        <div className="flex gap-2">
          <input
            name="message"
            className="input-field flex-1"
            placeholder={placeholder}
            disabled={loading}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

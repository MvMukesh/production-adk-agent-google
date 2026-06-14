/** Parse ADK /run response events. */

export function normalizeEvents(response: unknown): Record<string, unknown>[] {
  if (Array.isArray(response)) return response as Record<string, unknown>[];
  if (
    response &&
    typeof response === "object" &&
    Array.isArray((response as { events?: unknown }).events)
  ) {
    return (response as { events: Record<string, unknown>[] }).events;
  }
  return [];
}

export function lastText(events: Record<string, unknown>[]): string {
  let text = "";
  for (const event of events) {
    const content = event.content as { parts?: { text?: string }[] } | undefined;
    const parts = content?.parts ?? [];
    for (const part of parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        text = part.text.trim();
      }
    }
  }
  return text;
}

export function findQueries(events: unknown[]): string[] {
  const queries: string[] = [];
  const seen = new Set<string>();

  function walk(node: unknown): void {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;

    const obj = node as Record<string, unknown>;
    for (const key of ["functionCall", "function_call", "tool_request"]) {
      const payload = obj[key] as Record<string, unknown> | undefined;
      if (!payload) continue;
      const args = (payload.args ?? payload.arguments) as Record<string, unknown> | undefined;
      const query = args?.query;
      if (typeof query === "string" && query.trim() && !seen.has(query)) {
        seen.add(query);
        queries.push(query);
      }
    }
    Object.values(obj).forEach(walk);
  }

  walk(events);
  return queries;
}

export function countToolCalls(events: unknown[]): number {
  let count = 0;
  const json = JSON.stringify(events);
  const markers = ["functionCall", "function_call", "tool_request"];
  for (const m of markers) {
    const matches = json.match(new RegExp(m, "g"));
    if (matches) count += matches.length;
  }
  return count;
}

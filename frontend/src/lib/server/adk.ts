/** Server-side ADK API proxy helpers. */

const ADK_BASE = (process.env.ADK_API_BASE ?? "http://localhost:8000").replace(
  /\/$/,
  ""
);

export function adkUrl(path: string): string {
  return `${ADK_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function adkGet<T>(path: string): Promise<T> {
  const res = await fetch(adkUrl(path), { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function adkPost<T>(
  path: string,
  body?: unknown,
  timeoutMs = 120_000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(adkUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    try {
      return (await res.json()) as T;
    } catch {
      return { raw: await res.text() } as T;
    }
  } finally {
    clearTimeout(timer);
  }
}

export { ADK_BASE };

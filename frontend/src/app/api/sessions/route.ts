import { NextRequest, NextResponse } from "next/server";
import { adkGet, adkPost } from "@/lib/server/adk";

export async function GET(req: NextRequest) {
  const appName = req.nextUrl.searchParams.get("appName");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!appName || !userId) {
    return NextResponse.json(
      { error: "appName and userId required" },
      { status: 400 }
    );
  }
  try {
    const sessions = await adkGet(
      `/apps/${encodeURIComponent(appName)}/users/${encodeURIComponent(userId)}/sessions`
    );
    return NextResponse.json(sessions);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list sessions" },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { appName, userId, initialState } = body as {
    appName?: string;
    userId?: string;
    initialState?: Record<string, unknown>;
  };

  if (!appName || !userId) {
    return NextResponse.json(
      { error: "appName and userId required" },
      { status: 400 }
    );
  }

  const sessionId = crypto.randomUUID();
  const path = `/apps/${encodeURIComponent(appName)}/users/${encodeURIComponent(userId)}/sessions/${sessionId}`;

  try {
    await adkPost(path, initialState ?? {});
    return NextResponse.json({ sessionId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create session" },
      { status: 502 }
    );
  }
}

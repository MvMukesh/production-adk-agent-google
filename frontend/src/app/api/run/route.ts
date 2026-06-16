import { NextRequest, NextResponse } from "next/server";
import { adkPost } from "@/lib/server/adk";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { appName, userId, sessionId, message } = body as {
    appName?: string;
    userId?: string;
    sessionId?: string;
    message?: string;
  };

  if (!appName || !userId || !sessionId || !message?.trim()) {
    return NextResponse.json(
      { error: "appName, userId, sessionId, and message required" },
      { status: 400 }
    );
  }

  const payload = {
    app_name: appName,
    user_id: userId,
    session_id: sessionId,
    new_message: {
      role: "user",
      parts: [{ text: message.trim() }],
    },
  };

  try {
    const result = await adkPost("/run", payload);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent run failed" },
      { status: 502 }
    );
  }
}

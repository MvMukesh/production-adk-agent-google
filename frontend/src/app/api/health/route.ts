import { NextResponse } from "next/server";
import { adkGet } from "@/lib/server/adk";

export async function GET() {
  const start = Date.now();
  try {
    const apps = await adkGet<string[]>("/list-apps");
    return NextResponse.json({
      online: true,
      latencyMs: Date.now() - start,
      apps,
    });
  } catch (err) {
    return NextResponse.json(
      {
        online: false,
        latencyMs: Date.now() - start,
        apps: [],
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}

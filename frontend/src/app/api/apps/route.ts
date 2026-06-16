import { NextResponse } from "next/server";
import { adkGet } from "@/lib/server/adk";

export async function GET() {
  try {
    const apps = await adkGet<string[]>("/list-apps");
    return NextResponse.json(apps);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list apps" },
      { status: 503 }
    );
  }
}

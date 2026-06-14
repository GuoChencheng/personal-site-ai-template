import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = requireAdminRequest(request, { requirePublish: true });
  if (!admin.ok) return admin.response;

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    return NextResponse.json({ message: "Deploy hook is not configured. Content can still be exported manually." }, { status: 503 });
  }

  try {
    const response = await fetch(hook, { method: "POST" });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json({ error: `Deploy hook failed (${response.status})${detail ? `: ${detail.slice(0, 180)}` : ""}` }, { status: 502 });
    }
    return NextResponse.json({ message: "Deploy hook triggered." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Deploy hook request failed." }, { status: 502 });
  }
}

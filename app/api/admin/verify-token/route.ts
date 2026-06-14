import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = requireAdminRequest(request, { allowDevWithoutToken: false });
  if (!admin.ok) return admin.response;

  return NextResponse.json({ ok: true });
}

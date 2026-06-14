import { NextResponse } from "next/server";

export type AdminCheck =
  | { ok: true }
  | {
      ok: false;
      response: NextResponse;
    };

export function isEditorRouteEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.EDITOR_ENABLED === "true";
}

export function isPublishEnabled() {
  return process.env.PUBLISH_ENABLED === "true";
}

export function requireAdminRequest(request: Request, options: { allowDevWithoutToken?: boolean; requirePublish?: boolean } = {}): AdminCheck {
  if (options.requirePublish && !isPublishEnabled()) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Publish is not configured.", code: "publish-disabled" }, { status: 503 })
    };
  }

  if (!isEditorRouteEnabled()) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Editor routes are not enabled.", code: "editor-disabled" }, { status: 404 })
    };
  }

  const configuredToken = process.env.ADMIN_PUBLISH_TOKEN;
  if (!configuredToken && options.allowDevWithoutToken && process.env.NODE_ENV !== "production") {
    return { ok: true };
  }

  if (!configuredToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin token is not configured.", code: "admin-token-missing" }, { status: 503 })
    };
  }

  const providedToken = readAdminToken(request);
  if (!providedToken || providedToken !== configuredToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin token is invalid or missing.", code: "unauthorized" }, { status: 401 })
    };
  }

  return { ok: true };
}

function readAdminToken(request: Request) {
  const bearer = request.headers.get("authorization");
  if (bearer?.toLowerCase().startsWith("bearer ")) return bearer.slice(7).trim();
  return request.headers.get("x-admin-token")?.trim() || "";
}

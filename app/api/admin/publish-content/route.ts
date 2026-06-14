import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { assertPersonaContent, isRecord } from "@/lib/content/validation";

export const runtime = "nodejs";

type PublishBody = {
  persona?: unknown;
  deploy?: unknown;
};

type GitHubContentResponse = {
  sha?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  const admin = requireAdminRequest(request, { requirePublish: true });
  if (!admin.ok) return admin.response;

  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  try {
    assertPersonaContent(body.persona);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid persona payload." }, { status: 400 });
  }

  const githubConfig = getGitHubConfig();
  if (!githubConfig.ok) {
    return NextResponse.json({ message: "Publish is not configured. Export JSON and apply it manually.", missing: githubConfig.missing }, { status: 503 });
  }

  try {
    const result = await writeContentFile(githubConfig.config, JSON.stringify({ persona: body.persona, exportedAt: new Date().toISOString() }, null, 2));
    let deployMessage = "Deploy hook not requested.";
    if (body.deploy === true) {
      deployMessage = await triggerDeployHookIfConfigured();
    }

    return NextResponse.json({
      message: `${result}. ${deployMessage}`,
      path: githubConfig.config.path,
      branch: githubConfig.config.branch
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Publish failed." }, { status: 502 });
  }
}

function getGitHubConfig() {
  const config = {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || "main",
    path: process.env.CONTENT_FILE_PATH || "content/generated/site-content.json"
  };
  const missing = Object.entries(config)
    .filter(([key, value]) => key !== "branch" && key !== "path" && !value)
    .map(([key]) => key);

  if (missing.length > 0 || !config.token || !config.owner || !config.repo) return { ok: false as const, missing };
  return {
    ok: true as const,
    config: {
      token: config.token,
      owner: config.owner,
      repo: config.repo,
      branch: config.branch,
      path: config.path
    }
  };
}

async function writeContentFile(config: { token: string; owner: string; repo: string; branch: string; path: string }, content: string) {
  const encodedPath = config.path.split("/").map(encodeURIComponent).join("/");
  const baseUrl = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}`;
  const current = await fetch(`${baseUrl}?ref=${encodeURIComponent(config.branch)}`, {
    headers: githubHeaders(config.token),
    cache: "no-store"
  });

  let sha: string | undefined;
  if (current.ok) {
    const data = (await current.json()) as GitHubContentResponse;
    if (typeof data.sha === "string") sha = data.sha;
  } else if (current.status !== 404) {
    const detail = await current.text().catch(() => "");
    throw new Error(`Could not read existing GitHub content (${current.status})${detail ? `: ${detail.slice(0, 180)}` : ""}`);
  }

  const update = await fetch(baseUrl, {
    method: "PUT",
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      message: "chore: publish site content draft",
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {})
    })
  });

  if (!update.ok) {
    const detail = await update.text().catch(() => "");
    throw new Error(`GitHub content update failed (${update.status})${detail ? `: ${detail.slice(0, 180)}` : ""}`);
  }

  const data = (await update.json()) as GitHubContentResponse;
  if (isRecord(data) && typeof data.message === "string") return data.message;
  return sha ? "Content file updated on GitHub" : "Content file created on GitHub";
}

async function triggerDeployHookIfConfigured() {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return "Content saved; deploy hook is not configured.";

  const response = await fetch(hook, { method: "POST" });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Deploy hook failed (${response.status})${detail ? `: ${detail.slice(0, 180)}` : ""}`);
  }
  return "Deploy hook triggered.";
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

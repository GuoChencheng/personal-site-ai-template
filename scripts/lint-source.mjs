import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib", "content", "scripts", "next.config.ts"];
const extensions = new Set([".ts", ".tsx"]);
const secretPublicPattern = /NEXT_PUBLIC_(?:AI|ADMIN|PUBLISH|GITHUB|VERCEL|TOKEN|SECRET|KEY|HOOK)/;
const browserSecretPattern = /process\.env\.(?:AI_API_KEY|ADMIN_PUBLISH_TOKEN|GITHUB_TOKEN|VERCEL_DEPLOY_HOOK_URL)/;

const failures = [];

for (const sourceRoot of sourceRoots) {
  await walk(path.join(root, sourceRoot));
}

if (failures.length > 0) {
  console.error("Source lint failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Source lint passed.");

async function walk(currentPath) {
  const stat = await import("node:fs/promises").then((fs) => fs.stat(currentPath));
  if (stat.isFile()) {
    if (extensions.has(path.extname(currentPath)) || path.extname(currentPath) === ".mjs") await lintFile(currentPath);
    return;
  }

  const entries = await readdir(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const entryPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      await walk(entryPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name)) && path.extname(entry.name) !== ".mjs") continue;
    await lintFile(entryPath);
  }
}

async function lintFile(filePath) {
  const relative = path.relative(root, filePath);
  const text = await readFile(filePath, "utf8");
  if (!text.endsWith("\n")) failures.push(`${relative} must end with a newline.`);
  if (secretPublicPattern.test(text)) failures.push(`${relative} references a forbidden NEXT_PUBLIC secret-style variable.`);
  if (relative.startsWith("components/") && browserSecretPattern.test(text)) {
    failures.push(`${relative} reads server-only secret environment variables from client-reachable component code.`);
  }
}

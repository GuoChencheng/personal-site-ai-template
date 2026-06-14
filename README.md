# Modular Personal Website Template with AI Assistant

A reusable Next.js personal website template with typed file-based content, bilingual UI support, a local-first owner editor, and a source-grounded AI assistant.

This repository is designed as a public-safe starter project. It includes demo personas and public sample content, not private site data.

## Features

- Next.js App Router, TypeScript, and Tailwind CSS
- Public pages for home, about, gallery, people, projects, notes, publications, CV, contact, and Ask
- Typed file-based content model for profiles, portrait media, gallery items, related people, projects, notes, publications, FAQ, and assistant instructions
- Modular homepage sections with configurable ordering and visibility
- English/Chinese language switching with fallback behavior
- Source-grounded assistant route at `/ask`
- OpenAI-compatible provider layer with DeepSeek-compatible configuration
- Local-first visual editor at `/editor` for owner maintenance
- Production guard that returns 404 for `/editor` by default
- Optional protected publish/deploy API routes for generated content workflows
- Graceful fallback answer behavior when no AI API key is configured

## Public Site vs. Owner Editor

The public site is read-only for visitors. Public routes are:

- `/`
- `/about`
- `/gallery`
- `/people`
- `/projects`
- `/projects/[slug]`
- `/notes`
- `/notes/[slug]`
- `/publications`
- `/cv`
- `/contact`
- `/ask`

The editor is an owner maintenance tool. It is available during local development at `/editor`, but in production it calls `notFound()` and returns the normal 404 page. The editor is not linked from shared public navigation.

The repository being public does not mean a deployed editor should be public. If you want hosted editing later, add real authentication before enabling `/editor` in production.

## Visual Editor

The local editor supports:

- profile fields, portrait metadata, personal notes, interests, links, and contact channels
- gallery items and related people records
- homepage sections, stats, and timeline entries
- projects, notes, publications, and FAQ entries
- assistant tone, style, behavior rules, routing guidance, and suggested questions
- AI profile drafting for structured persona patches when a provider is configured
- localStorage autosave
- JSON import/export
- live homepage preview
- optional protected publish/deploy actions when server-side credentials are configured

Source files remain canonical unless `content/generated/site-content.json` is intentionally published. Use `/editor` locally, export JSON, then apply intended changes to `content/personas/`, `content/generated/`, or assistant config before deploying.

## AI Assistant

The `/ask` page calls `/api/ask`. The API route:

1. validates the visitor query
2. classifies intent
3. retrieves relevant local content
4. assembles a constrained prompt
5. calls an OpenAI-compatible provider when configured
6. returns an answer with source references and suggested links

If provider configuration is missing or fails, the app returns a deterministic source-grounded fallback rather than pretending a model answered.

## Bilingual Support

Shared UI strings live in `lib/i18n/dictionary.ts`.

Canonical persona content lives in `content/personas/*.ts`. Chinese translation overlays live in `content/personas/translations.ts` and are projected through `lib/content/localize.ts`.

This keeps routes and rendering shared while allowing translated content to fall back gracefully.

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

- public site: `http://localhost:3000`
- local owner editor: `http://localhost:3000/editor`

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Useful variables:

```bash
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_API_KEY_ENV=AI_API_KEY
AI_API_KEY=replace-with-your-local-key
AI_TIMEOUT_MS=20000
EDITOR_ENABLED=false
ADMIN_PUBLISH_TOKEN=
PUBLISH_ENABLED=false
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
CONTENT_FILE_PATH=content/generated/site-content.json
VERCEL_DEPLOY_HOOK_URL=
```

DeepSeek-compatible example:

```bash
AI_PROVIDER=deepseek
AI_BASE_URL=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat
AI_API_KEY=replace-with-your-local-key
```

Never commit real `.env` files, API keys, GitHub tokens, or deploy hooks. Keep those values in local environment files or deployment platform settings.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run clean
```

`npm run lint` runs the repository's source guard at `scripts/lint-source.mjs`, including newline checks and client/server secret-boundary checks. `npm run clean` removes generated local build/cache output such as `.next`, `coverage`, and `tsconfig.tsbuildinfo`.

## Project Structure

```text
app/          Next.js routes and API routes
components/   Layout, content, section, editor, theme, and ask UI components
content/      Demo persona content and translation overlays
docs/         Architecture, access-control, and release-readiness notes
lib/          Content, i18n, site navigation, and AI assistant logic
public/       Static assets
styles/       Tailwind global styles
prompts/      Curated workflow prompts for future maintenance
scripts/      Lightweight source checks
```

## Deployment Notes

- Deploy as a standard Next.js app.
- Set provider environment variables in your hosting platform.
- Keep `.env`, `.env.*`, and `.env*.local` out of source control except `.env.example`.
- Use file-based source content for deployed builds.
- `/editor` is unavailable in production by default unless explicitly enabled with server-side admin configuration.
- Protected publish/deploy routes require `ADMIN_PUBLISH_TOKEN` and should remain server-only.

## Current Limitations

- No database-backed CMS.
- No multi-user editing.
- No production editor authentication.
- Editor JSON must be applied to source files manually.
- Translation overlays are still code-based.
- No vector search or streaming assistant responses yet.
- Automated visual regression tests are not included.

## Roadmap Ideas

- Add authenticated hosted editing only if needed.
- Add a dev-only source apply workflow for exported editor JSON.
- Add assistant evaluation fixtures for source grounding and refusal behavior.
- Add automated visual regression checks.
- Add optional streaming responses while preserving grounded fallback behavior.
- Expand bilingual authoring support in the editor.

## License

MIT. See [LICENSE](./LICENSE).

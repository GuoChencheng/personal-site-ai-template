# Repository Overview

This is a public-safe Next.js template for a personal website with a source-grounded AI assistant.

## Core Design

- Public presentation routes are read-only visitor surfaces.
- Content is stored in typed local files under `content/`.
- Rendering logic lives in small reusable components under `components/`.
- Assistant retrieval, prompt assembly, provider calls, and fallback behavior live under `lib/ai/`.
- Bilingual content is handled with shared dictionaries and optional persona translation overlays.
- The owner editor is local-first and unavailable in production by default.

## Public/Private Boundary

The live public site should expose normal presentation routes and `/ask`. The `/editor` route is for owner maintenance during local development and returns 404 in production. See `docs/EDITOR_ACCESS_CONTROL.md`.

## AI Boundary

The assistant is designed to answer only from public site material. It retrieves local content before answering, cites sources when available, uses fallback answers when provider configuration is missing, and routes formal requests to configured contact channels.

## Content Customization

Start with:

- `content/personas/developer.ts`
- `content/personas/academic.ts`
- `content/personas/translations.ts`
- `lib/content/personas.ts`
- `lib/ai/config.ts`

The active default persona is configured in `lib/content/personas.ts`.

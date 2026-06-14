# Editor Access Control

## Public routes

The public website remains read-only and visitor-facing:

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

These routes do not expose edit buttons, editor links, or content mutation controls.

## Private maintenance route

The owner maintenance editor remains at `/editor`.

Access model:

- available during local development with `npm run dev`
- hidden from shared navbar and footer navigation
- unavailable in production unless `EDITOR_ENABLED=true` and `ADMIN_PUBLISH_TOKEN` are configured
- protected by an owner token gate before the editor UI renders in production
- marked `noindex` through page metadata

Production visitors who request `/editor` see the normal Next.js 404 page unless the owner explicitly enables the editor and supplies the admin token.

## Owner workflow

1. Run the site locally with `npm run dev`.
2. Open `/editor` directly.
3. Import an existing editor JSON draft or use the source-backed initial draft.
4. Edit content locally with autosave, preview, AI profile drafting, and export.
5. Apply the exported JSON manually, or use protected publish routes when server credentials are configured.

This keeps deployed content file-based and avoids a public admin surface.

## Protected server routes

The owner-only routes require the server-side admin token in production:

- `/api/editor/generate-profile`
- `/api/admin/publish-content`
- `/api/admin/trigger-deploy`

GitHub tokens, Vercel deploy hook URLs, AI keys, and admin secrets are read only from server environment variables. They are never sent to the browser.

## Limitations

This is a lightweight owner guard, not a full multi-user authentication system. If a future project needs shared production editing, add real authentication and audit logging before enabling a hosted editor broadly.

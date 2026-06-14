# Visual Editor, Style, and Cleanup Notes

## Editor architecture

`/editor` is a local-first owner maintenance tool. It loads the same localized `PersonaContent` used by the public site, edits it in a client component, autosaves the draft to `localStorage`, imports compatible JSON drafts, validates the broad draft/persona structure, and exports a JSON draft. It does not write directly to source files, add authentication, or introduce a database.

Access boundary:

- `/editor` is intentionally not included in shared public navigation
- `/editor` is available in local development for the owner workflow
- in production, `/editor` returns the normal Next.js 404 response
- public presentation pages remain read-only visitor surfaces

The preview uses `HomepageRenderer`, so homepage section ordering, enabled state, profile edits, project summaries, and assistant-facing copy are shown through the real site components instead of a separate mock preview.

Current editor coverage:

- profile identity, bio, focus areas, links, and contact channels
- homepage sections, stats, and timeline
- projects, notes, publications, and FAQ entries with add/remove/reorder controls
- assistant behavior fields and suggested questions
- import/export workflow for browser drafts

## Styling system

The batch added shared Tailwind component classes in `styles/globals.css` for page kickers, titles, descriptions, cards, buttons, metadata rows, and form controls. Existing pages were updated to use those classes where it removed duplicated ad hoc styling.

Primary visual fixes:

- consistent page intro hierarchy across About, Projects, Notes, Publications, CV, Contact, Ask, and Editor
- card padding and border treatment normalized through `section-card`
- button styles consolidated into primary, secondary, and ghost variants
- metadata rows use tighter, less noisy letter spacing
- navbar and footer spacing are more consistent across desktop and mobile
- Ask page and editor forms have clearer panel structure and field alignment
- project, note, and contact detail pages now include clearer routes into the assistant or related pages
- assistant source references are rendered as more legible source cards

## Cleanup findings

The project directory size is dominated by generated and install output, not source files:

- `node_modules/` is about 409 MB
- `.next/` is about 196-201 MB, mostly cache
- application source, content, docs, and prompts are well under 1 MB each

Safe cleanup performed:

- ignored `*.tsbuildinfo`, `.turbo/`, and `coverage/`
- added a lightweight `npm run clean` script for generated build/cache output
- removed the tracked TypeScript build info file from the working tree
- avoided adding heavy editor/CMS dependencies

`.DS_Store` files remain local filesystem metadata. They are ignored and can be deleted manually if desired; they are not part of the template architecture.

## Later optimization targets

- consider pruning old prompt files only after deciding what prompt history should be retained
- add automated visual regression checks for key routes once browser access is available
- add a dev-only source-file apply helper if the project owner wants it and accepts the local write path

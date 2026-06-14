# Big Batch AI, I18N, Content Review

## Implemented

- Preserved and verified the real AI assistant MVP.
- Added English/Chinese language switching through a global navbar switcher and locale cookie.
- Centralized shared UI strings in `lib/i18n/dictionary.ts`.
- Added localized persona projection through `content/personas/translations.ts` and `lib/content/localize.ts`.
- Updated core pages, homepage sections, navbar, footer, and assistant UI to render in the active language.
- Updated assistant fallback messages, suggested questions, prompt language instruction, and retrieval labels for English/Chinese.
- Strengthened CV with a downloadable-CV hook, richer profile structure, selected projects, and public-material counts.
- Kept project, note, publication, and contact improvements from the previous content batch.

## Self-Review Notes

- The assistant is real and source-grounded; it is not a fake chat placeholder.
- Bilingual switching is coherent across the current route structure and works without duplicating pages.
- The current route strategy is cookie-based rather than route-prefix-based. This keeps the existing URL contract stable but is less SEO-explicit than `/en` and `/zh` paths.
- The implementation avoids a heavy CMS, auth, analytics, or chat persistence.
- The code remains organized around typed content, localized projection, dictionaries, and a separate AI orchestration layer.

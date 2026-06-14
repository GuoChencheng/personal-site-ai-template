# Batch 3 AI and Content Summary

This batch preserves the existing Next.js, TypeScript, Tailwind, and typed persona architecture while moving the template closer to a usable MVP.

## Completed

- Preserved the real assistant MVP: `/api/ask`, deterministic classification, local retrieval, prompt assembly, OpenAI-compatible provider adapter, DeepSeek configuration path, and graceful fallbacks.
- Added explicit contact-channel retrieval so collaboration and formal-outreach questions cite public contact configuration.
- Extended project content with optional role, period, problem, approach, outcomes, and highlights.
- Extended note content with optional structured sections and audience metadata.
- Improved project index and detail pages with richer metadata, structured sections, links, and empty states.
- Improved note index and detail pages with metadata, tags, audience, and structured article sections.
- Improved publications listing with tags, links, and a clearer empty state.
- Improved CV page into a fuller profile surface with sidebar facts, focus areas, experience, selected projects, and public-material counts.
- Improved contact page fallbacks and preferred-channel presentation.

## Verification Scope

The required checks for this batch are:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- local `/ask` smoke test with missing API key fallback
- provider-failure smoke test with a dummy key and invalid base URL

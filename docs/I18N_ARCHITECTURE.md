# Bilingual Architecture

The site supports English and Chinese through a lightweight locale-cookie architecture.

## Locale Flow

- Supported locales are defined in `lib/i18n/types.ts`.
- The active locale is stored in the `site-locale` cookie.
- Server components read the locale with `getRequestLocale()`.
- The navbar `LanguageSwitcher` updates the cookie and refreshes the current route.
- Pages render the same URL in the active language, so existing links and route structure stay stable.

This avoids duplicating every App Router page under locale folders while keeping language state available to server-rendered pages, the layout, and `/api/ask`.

## UI Text

Shared UI labels live in `lib/i18n/dictionary.ts`, including:

- navigation
- homepage section copy
- page headings and empty states
- AI assistant UI text
- fallback and provider error messages
- status and reading-level labels

## Content

The canonical persona records remain in `content/personas/*.ts`. Chinese content is layered on top through `content/personas/translations.ts` and projected with `getLocalizedPersona()`.

The localization projection:

- preserves the typed `PersonaContent` shape
- merges translated profile, project, note, publication, FAQ, timeline, and AI instruction fields
- falls back to English for missing optional translations
- keeps rendering and retrieval code from duplicating language-specific logic

## Assistant Language Awareness

The `/ask` page sends the active locale to `/api/ask`. The assistant uses the localized persona content, localized fallback messages, and prompt instructions that tell the model to answer in the current site language unless the visitor asks otherwise.

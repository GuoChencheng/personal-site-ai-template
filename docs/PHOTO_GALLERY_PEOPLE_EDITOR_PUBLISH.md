# Photo, Gallery, People, Editor, and Publish Notes

## Public visual content

The homepage hero reads `profile.portrait` from the active persona. The current academic persona uses `/public/images/profile/portrait-placeholder.svg`, clearly marked as a placeholder.

To add a real portrait:

1. Place a public-safe image at `/public/images/profile/portrait.jpg` or another stable path under `/public/images/`.
2. Update `profile.portrait.src` to the browser path, for example `/images/profile/portrait.jpg`.
3. Update `profile.portrait.alt` and `profile.portrait.caption`.
4. Set `profile.portrait.placeholder` to `false`.

Do not use group photos, private scenes, low-permission images, or social-media-style crops unless they are clearly intended for public publication.

## Gallery

The public route `/gallery` renders `persona.gallery`. Each item supports:

- `id`, `title`, `description`, `alt`
- optional `image`, `date`, `year`, `location`, `caption`
- `category`: `academic`, `campus`, `travel`, `daily-life`, `events`, or `workspace`
- `tags`, `featured`, `visibility`, and `placeholder`

If `image` is missing, the page renders a neutral placeholder card. Placeholder items must not imply that a real photo exists.

Recommended asset location: `/public/images/gallery/`.

## Related People

The public route `/people` renders `persona.people`. The About page also links to that route and shows a conservative empty state when no verified people are configured.

Only add people when the public content verifies the name, role, relationship, affiliation, and optional link. Do not add private contact details, unverified collaborators, or personal photos of others unless the image is already public and clearly intended for reuse.

## About Personal Note

`profile.personalNote` controls the warmer About page section. Keep this section factual, calm, and public-safe. Good material includes study habits, writing practice, intellectual temperament, and how the owner approaches difficult concepts.

Avoid private biographical details, addresses, phone numbers, relationship information, forced fun facts, or self-marketing claims.

## Editor

The editor now supports:

- portrait, cover, and caption fields
- About personal note title/body/enabled state
- gallery add/remove/reorder and visibility
- related people add/remove/reorder and visibility
- AI Profile Builder
- Export JSON
- protected publish/deploy calls when server env vars are configured

The editor remains local-first. Browser drafts stay in `localStorage` until the owner exports JSON or calls a protected server route.

## AI Profile Builder

The AI builder calls `/api/editor/generate-profile` with owner-provided public facts. The route:

- requires the editor/admin guard in production
- uses the existing OpenAI-compatible provider when `AI_API_KEY` is configured
- returns a structured persona patch and summary
- falls back to a deterministic local draft when the provider key is missing
- instructs the model not to invent facts, photos, collaborators, mentors, publications, or links

The editor previews the patch and applies it only after the owner clicks Apply.

## Publish and Deploy

Export JSON is the baseline safe workflow.

Optional server-side publish requires:

```bash
EDITOR_ENABLED=true
ADMIN_PUBLISH_TOKEN=...
PUBLISH_ENABLED=true
GITHUB_TOKEN=...
GITHUB_OWNER=...
GITHUB_REPO=...
GITHUB_BRANCH=main
CONTENT_FILE_PATH=content/generated/site-content.json
VERCEL_DEPLOY_HOOK_URL=...
```

The browser never receives `GITHUB_TOKEN`, `VERCEL_DEPLOY_HOOK_URL`, AI keys, or admin secrets. It only sends the owner token to protected routes:

- `/api/editor/generate-profile`
- `/api/admin/publish-content`
- `/api/admin/trigger-deploy`

If GitHub variables are missing, publish returns a configured-required message. If the deploy hook is missing, content can still be saved and deployment is skipped.

Never prefix these values with `NEXT_PUBLIC_`.

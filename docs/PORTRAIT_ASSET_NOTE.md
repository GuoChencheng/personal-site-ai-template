# Portrait Asset Note

The homepage hero currently uses a neutral placeholder at `/public/images/profile/portrait-placeholder.svg`.

To replace it with a real portrait later:

1. Add a public-safe portrait or study photograph at `/public/images/profile/portrait.jpg`.
2. Update `profile.portrait.src`, `alt`, `caption`, and `placeholder` in `content/personas/academic.ts` and `content/personas/translations.ts`.
3. Keep the crop vertical or near-vertical. The hero is designed for an aspect ratio close to `4:5`.

Guidance:

- Use a calm, well-lit portrait or study image.
- Avoid casual social-media styling, group photos, or visually noisy backgrounds.
- The image should support both light and dark mode without requiring heavy overlays.
- If you add a separate cover image, keep it under `/public/images/profile/` and set `profile.portrait.coverSrc`.
- Gallery photos belong under `/public/images/gallery/` and should be referenced through `persona.gallery`.

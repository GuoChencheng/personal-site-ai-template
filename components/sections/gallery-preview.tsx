import Link from "next/link";
import { GalleryCard } from "@/components/content/gallery-card";
import type { HomeSection, PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function GalleryPreviewSection({
  persona,
  section,
  dictionary
}: {
  persona: PersonaContent;
  section: HomeSection;
  dictionary: Dictionary;
}) {
  const items = (persona.gallery ?? []).filter((item) => item.visibility !== "hidden");
  const featured = items.filter((item) => item.featured).slice(0, 2);
  const preview = featured.length > 0 ? featured : items.slice(0, 2);
  if (preview.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="page-kicker">{dictionary.pages.gallery.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">{section.title ?? dictionary.home.galleryTitle}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600 dark:text-ink-300">{dictionary.home.galleryDescription}</p>
        </div>
        <Link href="/gallery" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          {dictionary.home.viewGallery}
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {preview.map((item, index) => (
          <GalleryCard key={item.id} item={item} dictionary={dictionary} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}

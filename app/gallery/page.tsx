import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { GalleryCard } from "@/components/content/gallery-card";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Gallery"
};

export default async function GalleryPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const items = (persona.gallery ?? []).filter((item) => item.visibility !== "hidden");
  const featured = items.filter((item) => item.featured);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="page-kicker">{dictionary.pages.gallery.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.gallery.title}</h1>
        <p className="page-description">{dictionary.pages.gallery.description}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={dictionary.pages.gallery.emptyTitle} description={dictionary.pages.gallery.emptyDescription} />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {featured.length > 0 ? (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">{dictionary.pages.gallery.featured}</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">{featured.length}</p>
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {featured.map((item, index) => (
                  <GalleryCard key={item.id} item={item} dictionary={dictionary} priority={index === 0} />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">{dictionary.pages.gallery.all}</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">{items.length}</p>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <GalleryCard key={item.id} item={item} dictionary={dictionary} />
              ))}
            </div>
          </section>
        </div>
      )}
    </Container>
  );
}

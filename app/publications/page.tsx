import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Publications"
};

export default async function PublicationsPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="page-kicker">{dictionary.pages.publications.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.publications.title}</h1>
        <p className="page-description">{dictionary.pages.publications.description}</p>
      </div>
      <div className="mt-10 space-y-4">
        {persona.publications.length > 0 ? (
          persona.publications.map((publication) => (
            <article key={`${publication.title}-${publication.year}`} className="section-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    {publication.venue} · {publication.year}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-ink-950 dark:text-white">{publication.title}</h2>
                  <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{publication.authors.join(", ")}</p>
                </div>
                {publication.links.length > 0 ? (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {publication.links.map((link) => (
                      <Link
                        key={`${publication.title}-${link.href}`}
                        href={link.href}
                        className="rounded-full border border-ink-300 px-3 py-1 text-xs font-medium text-ink-700 hover:border-accent-500 hover:text-accent-600 dark:border-white/15 dark:text-ink-100"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-ink-600 dark:text-ink-300">{publication.abstract}</p>
              <div className="mt-5">
                <TagList tags={publication.tags} />
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            title={dictionary.pages.publications.emptyTitle}
            description={dictionary.pages.publications.emptyDescription}
            action={{ label: dictionary.pages.publications.emptyAction, href: "/notes" }}
          />
        )}
      </div>
    </Container>
  );
}

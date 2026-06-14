import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Notes"
};

export default async function NotesPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="page-kicker">{dictionary.pages.notes.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.notes.title}</h1>
        <p className="page-description">{dictionary.pages.notes.description}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {persona.notes.length > 0 ? (
          persona.notes.map((note) => (
            <Link key={note.slug} href={`/notes/${note.slug}`} className="section-card block transition hover:-translate-y-0.5">
              <div className="meta-row">
                <span>{note.date}</span>
                <span>{dictionary.labels.readingLevel[note.readingLevel]}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ink-950 dark:text-white">{note.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{note.summary}</p>
              <div className="mt-5">
                <TagList tags={note.tags} />
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title={dictionary.pages.notes.emptyTitle}
            description={dictionary.pages.notes.emptyDescription}
            action={{ label: dictionary.pages.notes.emptyAction, href: "/projects" }}
          />
        )}
      </div>
    </Container>
  );
}

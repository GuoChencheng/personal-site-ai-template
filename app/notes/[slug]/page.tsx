import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getNoteBySlug } from "@/lib/content/personas";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  return { title: note?.title ?? "Note" };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const note = persona.notes.find((item) => item.slug === slug);
  if (!note) notFound();

  return (
    <Container size="narrow" className="py-14 sm:py-20">
      <div className="meta-row">
        <span>{note.date}</span>
        <span>{dictionary.labels.readingLevel[note.readingLevel]}</span>
        {note.audience ? <span>{note.audience}</span> : null}
      </div>
      <h1 className="page-title">{note.title}</h1>
      <p className="page-description">{note.summary}</p>
      <div className="mt-6">
        <TagList tags={note.tags} />
      </div>
      <div className="mt-10 border-t border-ink-200 pt-8 text-base leading-8 text-ink-700 dark:border-white/10 dark:text-ink-200">
        <p>{note.body}</p>
        {note.sections?.map((section) => (
          <section key={section.heading} className="mt-9">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{section.heading}</h2>
            {Array.isArray(section.body) ? (
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-4">{section.body}</p>
            )}
          </section>
        ))}
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 dark:border-white/10 sm:flex-row">
        <Link href="/notes" className="button-secondary">
          {dictionary.home.allNotes}
        </Link>
        <Link href="/ask" className="button-primary">
          {dictionary.common.askAssistant}
        </Link>
      </div>
    </Container>
  );
}

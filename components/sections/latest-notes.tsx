import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function LatestNotesSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  if (persona.notes.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={dictionary.home.latestNotes} />
        <Link href="/notes" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          {dictionary.home.allNotes}
        </Link>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {persona.notes.slice(0, 2).map((note) => (
          <Link key={note.slug} href={`/notes/${note.slug}`} className="section-card block transition hover:-translate-y-0.5">
            <p className="text-sm text-ink-500 dark:text-ink-400">{note.date}</p>
            <h3 className="mt-2 font-semibold text-ink-950 dark:text-white">{note.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{note.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

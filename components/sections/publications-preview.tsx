import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function PublicationsPreviewSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  if (persona.publications.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={dictionary.home.selectedPublications} />
        <Link href="/publications" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          {dictionary.home.viewPublications}
        </Link>
      </div>
      <div className="mt-7 space-y-4">
        {persona.publications.slice(0, 3).map((publication) => (
          <article key={`${publication.title}-${publication.year}`} className="section-card">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {publication.venue} · {publication.year}
            </p>
            <h3 className="mt-2 font-semibold text-ink-950 dark:text-white">{publication.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{publication.abstract}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

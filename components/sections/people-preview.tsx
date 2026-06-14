import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { PersonCard } from "@/components/content/person-card";
import type { HomeSection, PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function PeoplePreviewSection({
  persona,
  section,
  dictionary
}: {
  persona: PersonaContent;
  section: HomeSection;
  dictionary: Dictionary;
}) {
  const people = (persona.people ?? []).filter((person) => person.visibility !== "hidden").slice(0, 3);

  return (
    <section className="py-8 sm:py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="page-kicker">{dictionary.pages.people.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">{section.title ?? dictionary.home.peopleTitle}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600 dark:text-ink-300">{dictionary.home.peopleDescription}</p>
        </div>
        <Link href="/people" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          {dictionary.home.viewPeople}
        </Link>
      </div>
      {people.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} dictionary={dictionary} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState title={dictionary.pages.people.emptyTitle} description={dictionary.pages.people.emptyDescription} action={{ label: dictionary.home.viewPeople, href: "/people" }} />
        </div>
      )}
    </section>
  );
}

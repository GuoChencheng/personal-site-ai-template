import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PersonCard } from "@/components/content/person-card";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "People"
};

export default async function PeoplePage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const people = (persona.people ?? []).filter((person) => person.visibility !== "hidden");

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="page-kicker">{dictionary.pages.people.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.people.title}</h1>
        <p className="page-description">{dictionary.pages.people.description}</p>
      </div>

      {people.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={dictionary.pages.people.emptyTitle} description={dictionary.pages.people.emptyDescription} />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} dictionary={dictionary} />
          ))}
        </div>
      )}
    </Container>
  );
}

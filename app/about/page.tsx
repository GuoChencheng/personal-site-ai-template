import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PersonCard } from "@/components/content/person-card";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About"
};

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const portrait = persona.profile.portrait;
  const portraitNote = portrait?.caption ?? portrait?.note ?? persona.profile.tagline;
  const personalNote = persona.profile.personalNote?.enabled ? persona.profile.personalNote : undefined;
  const people = (persona.people ?? []).filter((person) => person.visibility !== "hidden").slice(0, 2);

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-6">
          <p className="page-kicker">{dictionary.pages.about.eyebrow}</p>
          <h1 className="page-title">{persona.profile.name}</h1>
          <p className="page-description text-xl">{persona.profile.tagline}</p>
          {portrait ? (
            <div className="section-card overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-ink-200/70 bg-[#f3efe9] dark:border-white/10 dark:bg-ink-900">
                <Image src={portrait.src} alt={portrait.alt} fill className="object-cover" sizes="(min-width: 1024px) 24rem, 100vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 via-ink-950/12 to-transparent px-5 pb-5 pt-16 text-white">
                  <p className="text-sm leading-6 text-white/88">{portraitNote}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">{dictionary.pages.about.title}</h2>
          <p className="mt-5 text-lg leading-8 text-ink-700 dark:text-ink-200">{persona.profile.bio}</p>
          {personalNote ? (
            <section className="mt-8 rounded-lg border-l-4 border-accent-500 bg-white/70 p-5 shadow-soft dark:bg-white/[0.04]">
              <h3 className="text-base font-semibold text-ink-950 dark:text-white">{personalNote.title || dictionary.pages.about.personalNote}</h3>
              <div className="mt-3 space-y-3 text-base leading-8 text-ink-700 dark:text-ink-200">
                {Array.isArray(personalNote.body) ? personalNote.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>{personalNote.body}</p>}
              </div>
            </section>
          ) : null}
          {persona.profile.aboutSections?.length ? (
            <div className="mt-10 space-y-5">
              {persona.profile.aboutSections.map((section) => (
                <section key={section.heading} className="section-card rounded-[1.5rem]">
                  <h3 className="text-base font-semibold text-ink-950 dark:text-white">{section.heading}</h3>
                  <div className="mt-3 space-y-3 text-base leading-8 text-ink-700 dark:text-ink-200">
                    {Array.isArray(section.body) ? section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>{section.body}</p>}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.pages.about.interests}</h3>
            <div className="mt-4">
              <TagList tags={persona.profile.interests} />
            </div>
          </div>
        </div>
      </div>

      <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {persona.profile.affiliation ? (
          <div className="section-card">
            <dt className="text-sm text-ink-500 dark:text-ink-400">{dictionary.home.affiliation}</dt>
            <dd className="mt-1 font-medium text-ink-950 dark:text-white">{persona.profile.affiliation}</dd>
          </div>
        ) : null}
        {persona.profile.location ? (
          <div className="section-card">
            <dt className="text-sm text-ink-500 dark:text-ink-400">{dictionary.home.location}</dt>
            <dd className="mt-1 font-medium text-ink-950 dark:text-white">{persona.profile.location}</dd>
          </div>
        ) : null}
        {persona.profile.links.length > 0 ? (
          <div className="section-card">
            <dt className="text-sm text-ink-500 dark:text-ink-400">{dictionary.pages.about.publicLinks}</dt>
            <dd className="mt-2 flex flex-wrap gap-3">
              {persona.profile.links.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-medium text-accent-600 hover:text-accent-500">
                  {link.label}
                </a>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker">{dictionary.pages.people.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink-950 dark:text-white">{dictionary.pages.about.relatedPeople}</h2>
          </div>
          <Link href="/people" className="text-sm font-medium text-accent-600 hover:text-accent-500">
            {dictionary.home.viewPeople}
          </Link>
        </div>
        {people.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} dictionary={dictionary} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState title={dictionary.pages.people.emptyTitle} description={dictionary.pages.about.relatedPeopleEmpty} action={{ label: dictionary.home.viewPeople, href: "/people" }} />
          </div>
        )}
      </section>
    </Container>
  );
}

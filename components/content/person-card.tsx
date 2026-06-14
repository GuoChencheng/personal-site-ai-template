import Image from "next/image";
import Link from "next/link";
import type { PersonConnection } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function PersonCard({ person, dictionary }: { person: PersonConnection; dictionary: Dictionary }) {
  return (
    <article className="section-card flex h-full flex-col">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-ink-200 bg-ink-100 dark:border-white/10 dark:bg-white/10">
          {person.image ? (
            <Image src={person.image} alt="" fill className="object-cover" sizes="4rem" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e7ded0,#d9e5e1)] text-sm font-semibold text-ink-700 dark:bg-[linear-gradient(135deg,#1f2937,#273549)] dark:text-ink-100">
              {person.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="meta-row">
            <span>{dictionary.labels.peopleCategory[person.category]}</span>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-ink-950 dark:text-white">{person.name}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">{person.role}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-sm leading-6 text-ink-700 dark:text-ink-200">
        <p>{person.description}</p>
        <dl className="grid gap-3 border-t border-ink-200 pt-4 dark:border-white/10">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-ink-400">{dictionary.pages.people.relationship}</dt>
            <dd className="mt-1">{person.relationship}</dd>
          </div>
          {person.affiliation ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-ink-400">{dictionary.pages.people.affiliation}</dt>
              <dd className="mt-1">{person.affiliation}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="mt-auto pt-5">
        {person.link ? (
          <Link href={person.link} className="text-sm font-medium text-accent-600 hover:text-accent-500">
            {dictionary.pages.people.publicLink}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

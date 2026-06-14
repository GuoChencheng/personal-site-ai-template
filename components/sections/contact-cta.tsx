import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ContactCtaSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  const primaryContact = persona.profile.contact.find((channel) => channel.preferred) ?? persona.profile.contact[0];

  return (
    <section className="py-14">
      <div className="section-card sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">{dictionary.home.ctaTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
              {dictionary.home.ctaDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="button-primary bg-ink-900 hover:bg-accent-600 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100">
              {dictionary.nav.ask}
            </Link>
            {primaryContact ? (
              <Link href={primaryContact.href} className="button-secondary">
                {dictionary.common.contact}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

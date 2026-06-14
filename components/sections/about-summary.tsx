import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function AboutSummarySection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  const firstSection = persona.profile.aboutSections?.[0];

  return (
    <section className="py-12">
      <div className="grid gap-8 md:grid-cols-[0.62fr_1fr] md:items-start">
        <SectionHeading eyebrow={dictionary.home.aboutEyebrow} title={dictionary.home.aboutTitle} />
        <div className="space-y-5">
          <div className="text-base leading-8 text-ink-700 dark:text-ink-200">
            <p>{persona.profile.bio}</p>
          </div>
          {firstSection ? (
            <div className="rounded-2xl border border-ink-200/80 bg-white/70 p-5 text-sm leading-7 text-ink-700 shadow-soft dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-200">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-600">{firstSection.heading}</p>
              <p className="mt-3">{Array.isArray(firstSection.body) ? firstSection.body[0] : firstSection.body}</p>
            </div>
          ) : null}
          <Link href="/about" className="mt-5 inline-flex text-sm font-medium text-accent-600 hover:text-accent-500">
            {dictionary.home.aboutLink}
          </Link>
        </div>
      </div>
    </section>
  );
}

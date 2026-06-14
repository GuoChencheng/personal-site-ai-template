import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function ExperienceTimelineSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  if (persona.homepage.timeline.length === 0) return null;

  return (
    <section className="py-12">
      <SectionHeading title={dictionary.home.experience} description={dictionary.home.experienceDescription} />
      <div className="mt-7 divide-y divide-ink-200 border-y border-ink-200 dark:divide-white/10 dark:border-white/10">
        {persona.homepage.timeline.map((item) => (
          <article key={`${item.title}-${item.period}`} className="grid gap-3 py-5 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="font-semibold text-ink-950 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{item.organization}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-accent-600">{item.period}</p>
              <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

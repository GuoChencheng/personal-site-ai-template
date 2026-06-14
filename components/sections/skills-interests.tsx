import type { HomeSection, PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function SkillsInterestsSection({ persona, section, dictionary }: { persona: PersonaContent; section: HomeSection; dictionary: Dictionary }) {
  if (persona.profile.interests.length === 0) return null;

  return (
    <section className="py-12">
      <SectionHeading title={section.title ?? dictionary.pages.about.interests} description={dictionary.home.interestsDescription} />
      <div className="mt-6 flex flex-wrap gap-3">
        {persona.profile.interests.map((interest) => (
          <span key={interest} className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-100">
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
}

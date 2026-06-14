import { personaTranslations } from "@/content/personas/translations";
import { getPersona } from "@/lib/content/personas";
import type { PersonaContent, PersonaId } from "@/lib/content/schema";
import type { Locale } from "@/lib/i18n/types";

export function getLocalizedPersona(locale: Locale, id?: PersonaId): PersonaContent {
  const base = getPersona(id);
  if (locale === "en") return base;

  const translation = personaTranslations[base.id]?.[locale];
  if (!translation) return base;
  const translatedProfile = translation.profile as Partial<PersonaContent["profile"]> | undefined;

  const localized: PersonaContent = {
    ...base,
    ...translation,
    profile: {
      ...base.profile,
      ...translatedProfile,
      portrait: translatedProfile?.portrait ? { ...(base.profile.portrait ?? { src: "", alt: "" }), ...translatedProfile.portrait } : base.profile.portrait,
      personalNote: translatedProfile?.personalNote ? { ...(base.profile.personalNote ?? { enabled: false, title: "", body: "" }), ...translatedProfile.personalNote } : base.profile.personalNote
    } as PersonaContent["profile"],
    homepage: {
      ...base.homepage,
      ...translation.homepage,
      sections: base.homepage.sections.map((section) => {
        const translated = translation.homepage?.sections?.find((item) => item?.id === section.id);
        return { ...section, ...translated };
      }),
      stats: mergeByIndex(base.homepage.stats, translation.homepage?.stats) as PersonaContent["homepage"]["stats"],
      timeline: mergeByIndex(base.homepage.timeline, translation.homepage?.timeline) as PersonaContent["homepage"]["timeline"]
    },
    projects: base.projects.map((project) => ({ ...project, ...translation.projects?.find((item) => item?.slug === project.slug) })) as PersonaContent["projects"],
    publications: base.publications.map((publication, index) => ({ ...publication, ...translation.publications?.[index] })) as PersonaContent["publications"],
    notes: base.notes.map((note) => ({ ...note, ...translation.notes?.find((item) => item?.slug === note.slug) })) as PersonaContent["notes"],
    gallery: base.gallery?.map((item) => ({ ...item, ...translation.gallery?.find((translated) => translated?.id === item.id) })) as PersonaContent["gallery"],
    people: base.people?.map((person) => ({ ...person, ...translation.people?.find((translated) => translated?.id === person.id) })) as PersonaContent["people"],
    faq: mergeByIndex<PersonaContent["faq"][number]>(base.faq, translation.faq) as PersonaContent["faq"],
    ai: { ...base.ai, ...translation.ai }
  };

  return localized;
}

function mergeByIndex<T>(base: T[], translated?: Array<Partial<T> | undefined>) {
  return base.map((item, index) => ({ ...item, ...translated?.[index] }));
}

import type { PersonaContent } from "@/lib/content/schema";
import type { QueryClass } from "@/lib/ai/types";
import type { RetrievalChunk } from "@/lib/ai/retrieval";
import { getDictionary, interpolate } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";

export function buildGroundedFallbackAnswer({
  persona,
  queryClass,
  sources,
  locale = "en"
}: {
  persona: PersonaContent;
  queryClass: QueryClass;
  sources: RetrievalChunk[];
  locale?: Locale;
}) {
  const dictionary = getDictionary(locale);

  if (queryClass === "out-of-scope") {
    return interpolate(dictionary.ai.outOfScope, { name: persona.profile.name });
  }

  if (sources.length === 0) {
    return interpolate(dictionary.ai.insufficient, { name: persona.profile.name });
  }

  const profile = persona.profile;
  if (queryClass === "profile-background") {
    return [
      interpolate(dictionary.ai.profilePrefix, { name: profile.name, title: profile.title }),
      profile.tagline,
      profile.affiliation ? interpolate(dictionary.ai.affiliation, { value: profile.affiliation }) : "",
      profile.interests.length > 0 ? interpolate(dictionary.ai.interests, { value: profile.interests.join(locale === "zh" ? "、" : ", ") }) : "",
      interpolate(dictionary.ai.sourcesUsed, { value: sources.slice(0, 3).map((source) => source.label).join(locale === "zh" ? "；" : "; ") })
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (queryClass === "projects") {
    const projects = sources.filter((source) => source.type === "project").slice(0, 3);
    if (projects.length === 0) return dictionary.ai.noProjectMatch;
    return `${dictionary.ai.projectPrefix} ${projects.map((project) => `${project.label.replace(/^(Project|项目): /, "")}: ${project.excerpt}`).join(" ")}`;
  }

  if (queryClass === "publications-writings") {
    const writing = sources.filter((source) => source.type === "publication" || source.type === "note").slice(0, 3);
    if (writing.length === 0) return dictionary.ai.noWritingMatch;
    return `${dictionary.ai.writingPrefix} ${writing.map((item) => `${item.label}: ${item.excerpt}`).join(" ")}`;
  }

  if (queryClass === "collaboration-contact") {
    const preferred = profile.contact.find((channel) => channel.preferred) ?? profile.contact[0];
    return preferred
      ? interpolate(dictionary.ai.contact, { label: preferred.label, value: preferred.value, name: profile.name })
      : interpolate(dictionary.ai.contactNoChannel, { name: profile.name });
  }

  if (queryClass === "site-navigation") {
    return dictionary.ai.navigation;
  }

  return dictionary.ai.insufficient;
}

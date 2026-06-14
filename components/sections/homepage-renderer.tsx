import type { HomeSection, PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { AboutSummarySection } from "@/components/sections/about-summary";
import { ContactCtaSection } from "@/components/sections/contact-cta";
import { ExperienceTimelineSection } from "@/components/sections/experience-timeline";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview";
import { HeroSection } from "@/components/sections/hero";
import { LatestNotesSection } from "@/components/sections/latest-notes";
import { PeoplePreviewSection } from "@/components/sections/people-preview";
import { PublicationsPreviewSection } from "@/components/sections/publications-preview";
import { SkillsInterestsSection } from "@/components/sections/skills-interests";
import { StatsSection } from "@/components/sections/stats";

function renderSection(section: HomeSection, persona: PersonaContent, dictionary: Dictionary) {
  switch (section.type) {
    case "hero":
      return <HeroSection persona={persona} dictionary={dictionary} />;
    case "about-summary":
      return <AboutSummarySection persona={persona} dictionary={dictionary} />;
    case "stats":
      return <StatsSection persona={persona} />;
    case "skills-interests":
      return <SkillsInterestsSection persona={persona} section={section} dictionary={dictionary} />;
    case "gallery-preview":
      return <GalleryPreviewSection persona={persona} section={section} dictionary={dictionary} />;
    case "people-preview":
      return <PeoplePreviewSection persona={persona} section={section} dictionary={dictionary} />;
    case "featured-projects":
      return <FeaturedProjectsSection persona={persona} dictionary={dictionary} />;
    case "experience-timeline":
      return <ExperienceTimelineSection persona={persona} dictionary={dictionary} />;
    case "publications-preview":
      return <PublicationsPreviewSection persona={persona} dictionary={dictionary} />;
    case "latest-notes":
      return <LatestNotesSection persona={persona} dictionary={dictionary} />;
    case "contact-cta":
      return <ContactCtaSection persona={persona} dictionary={dictionary} />;
    default:
      return null;
  }
}

export function HomepageRenderer({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  return (
    <>
      {persona.homepage.sections
        .filter((section) => section.enabled)
        .map((section) => (
          <div key={section.id}>{renderSection(section, persona, dictionary)}</div>
        ))}
    </>
  );
}

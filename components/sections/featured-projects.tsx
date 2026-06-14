import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SectionHeading } from "@/components/sections/section-heading";

export function FeaturedProjectsSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  const projects = persona.projects.filter((project) => project.featured).slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={dictionary.home.featuredProjects} description={dictionary.home.featuredProjectsDescription} />
        <Link href="/projects" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          {dictionary.home.allProjects}
        </Link>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="section-card group block transition hover:-translate-y-0.5">
            <div className="meta-row justify-between">
              <p className="text-accent-600">{dictionary.labels.status[project.status]}</p>
              <p>{project.date}</p>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink-950 group-hover:text-accent-600 dark:text-white">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{project.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-white/10 dark:text-ink-100">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Projects"
};

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="page-kicker">{dictionary.pages.projects.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.projects.title}</h1>
        <p className="page-description">{dictionary.pages.projects.description}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {persona.projects.length > 0 ? (
          persona.projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="section-card group block transition hover:-translate-y-0.5">
              <div className="meta-row justify-between">
                <span className="text-accent-600">{dictionary.labels.status[project.status]}</span>
                <span>{project.period ?? project.date}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ink-950 group-hover:text-accent-600 dark:text-white">{project.title}</h2>
              {project.subtitle ? <p className="mt-2 text-sm font-medium text-ink-700 dark:text-ink-200">{project.subtitle}</p> : null}
              <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{project.summary}</p>
              <div className="mt-5">
                <TagList tags={project.tags} />
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title={dictionary.pages.projects.emptyTitle}
            description={dictionary.pages.projects.emptyDescription}
            action={{ label: dictionary.pages.projects.emptyAction, href: "/ask" }}
          />
        )}
      </div>
    </Container>
  );
}

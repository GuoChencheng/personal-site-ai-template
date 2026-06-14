import type { Metadata } from "next";
import Link from "next/link";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "CV"
};

export default async function CvPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const featuredProjects = persona.projects.filter((project) => project.featured).slice(0, 3);
  const preferredContact = persona.profile.contact.find((channel) => channel.preferred) ?? persona.profile.contact[0];

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-5">
          <div>
            <p className="page-kicker">{dictionary.pages.cv.eyebrow}</p>
            <h1 className="page-title">{persona.profile.name}</h1>
            <p className="page-description">{persona.profile.title}</p>
          </div>

          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.pages.cv.profile}</h2>
            <p className="mt-4 text-sm leading-6 text-ink-600 dark:text-ink-300">{persona.profile.bio}</p>
            <dl className="mt-5 space-y-3 text-sm">
              {persona.profile.affiliation ? (
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.home.affiliation}</dt>
                  <dd className="font-medium text-ink-950 dark:text-white">{persona.profile.affiliation}</dd>
                </div>
              ) : null}
              {persona.profile.location ? (
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.home.location}</dt>
                  <dd className="font-medium text-ink-950 dark:text-white">{persona.profile.location}</dd>
                </div>
              ) : null}
              {preferredContact ? (
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.common.contact}</dt>
                  <dd>
                    <Link href={preferredContact.href} className="font-medium text-accent-600 hover:text-accent-500">
                      {preferredContact.value}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.pages.cv.focusAreas}</h2>
            <div className="mt-4">
              <TagList tags={persona.profile.interests} />
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.pages.cv.download}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{dictionary.pages.cv.downloadHint}</p>
          </div>
        </aside>

        <div className="space-y-10">
          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{dictionary.pages.cv.experience}</h2>
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {persona.homepage.timeline.length} {dictionary.pages.cv.entries}
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {persona.homepage.timeline.map((item) => (
                <article key={`${item.title}-${item.period}`} className="section-card">
                  <p className="text-sm text-accent-600">{item.period}</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink-950 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{item.organization}</p>
                  <p className="mt-4 text-sm leading-6 text-ink-600 dark:text-ink-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          {featuredProjects.length > 0 ? (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{dictionary.pages.cv.selectedProjects}</h2>
                <Link href="/projects" className="text-sm font-medium text-accent-600 hover:text-accent-500">
                  {dictionary.pages.cv.viewAll}
                </Link>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <Link key={project.slug} href={`/projects/${project.slug}`} className="section-card block transition hover:-translate-y-0.5">
                    <p className="text-xs uppercase tracking-[0.16em] text-accent-600">{dictionary.labels.status[project.status]}</p>
                    <h3 className="mt-2 font-semibold text-ink-950 dark:text-white">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{project.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="section-card">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{dictionary.pages.cv.publicMaterials}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">
              {locale === "zh"
                ? `该人物配置了 ${persona.publications.length} 条发表和 ${persona.notes.length} 条笔记，可作为助手的公开来源。`
                : `${persona.publications.length} publication entries and ${persona.notes.length} notes are configured for this persona and available to the assistant as public sources.`}
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}

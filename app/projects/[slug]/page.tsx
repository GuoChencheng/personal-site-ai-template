import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/content/tag-list";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getProjectBySlug } from "@/lib/content/personas";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const project = persona.projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <article>
          <p className="page-kicker">{dictionary.labels.status[project.status]}</p>
          <h1 className="page-title max-w-4xl">{project.title}</h1>
          {project.subtitle ? <p className="page-description text-xl">{project.subtitle}</p> : null}
          <p className="mt-8 max-w-3xl text-base leading-8 text-ink-700 dark:text-ink-200">{project.description}</p>

          <div className="mt-8">
            <TagList tags={project.tags} />
          </div>

          <div className="mt-12 grid gap-6">
            {project.problem ? (
              <section className="border-t border-ink-200 pt-6 dark:border-white/10">
                <h2 className="text-xl font-semibold text-ink-950 dark:text-white">{dictionary.pages.projects.problem}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-600 dark:text-ink-300">{project.problem}</p>
              </section>
            ) : null}

            <ProjectListSection title={dictionary.pages.projects.approach} items={project.approach} />
            <ProjectListSection title={dictionary.pages.projects.outcomes} items={project.outcomes} />
            <ProjectListSection title={dictionary.pages.projects.highlights} items={project.highlights} columns />
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.pages.projects.facts}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-ink-500 dark:text-ink-400">{dictionary.common.status}</dt>
                <dd className="mt-1 font-medium capitalize text-ink-950 dark:text-white">{dictionary.labels.status[project.status]}</dd>
              </div>
              <div>
                <dt className="text-ink-500 dark:text-ink-400">{dictionary.common.date}</dt>
                <dd className="mt-1 font-medium text-ink-950 dark:text-white">{project.date}</dd>
              </div>
              {project.period ? (
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.common.period}</dt>
                  <dd className="mt-1 font-medium text-ink-950 dark:text-white">{project.period}</dd>
                </div>
              ) : null}
              {project.role ? (
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.common.role}</dt>
                  <dd className="mt-1 font-medium text-ink-950 dark:text-white">{project.role}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.common.links}</h2>
            {project.links.length > 0 ? (
              <div className="mt-4 space-y-2">
                {project.links.map((link) => (
                  <Link key={`${link.label}-${link.href}`} href={link.href} className="block text-sm font-medium text-accent-600 hover:text-accent-500">
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-ink-600 dark:text-ink-300">{dictionary.common.noLinks}</p>
            )}
          </div>

          <div className="section-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">{dictionary.common.askAssistant}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">
              {locale === "zh" ? "询问助手时会优先引用该项目和相关公开材料。" : "Ask a grounded question that can cite this project and related public materials."}
            </p>
            <Link href="/ask" className="button-primary mt-4 w-full px-4 py-2">
              {dictionary.common.askAssistant}
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function ProjectListSection({ title, items, columns = false }: { title: string; items?: string[]; columns?: boolean }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="border-t border-ink-200 pt-6 dark:border-white/10">
      <h2 className="text-xl font-semibold text-ink-950 dark:text-white">{title}</h2>
      <ul className={`mt-4 grid gap-3 ${columns ? "sm:grid-cols-2" : ""}`}>
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-ink-200 bg-white/70 p-4 text-sm leading-6 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-200">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

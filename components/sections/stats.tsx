import type { PersonaContent } from "@/lib/content/schema";

export function StatsSection({ persona }: { persona: PersonaContent }) {
  if (persona.homepage.stats.length === 0) return null;

  return (
    <section className="py-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {persona.homepage.stats.map((stat) => (
          <div key={stat.label} className="surface rounded-lg p-5">
            <p className="text-3xl font-semibold text-ink-950 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

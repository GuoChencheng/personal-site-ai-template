import Image from "next/image";
import Link from "next/link";
import type { PersonaContent } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function HeroSection({ persona, dictionary }: { persona: PersonaContent; dictionary: Dictionary }) {
  const primaryContact = persona.profile.contact.find((channel) => channel.preferred) ?? persona.profile.contact[0];
  const portrait = persona.profile.portrait;
  const portraitNote = portrait?.caption ?? portrait?.note ?? persona.profile.tagline;
  const initials = getInitials(persona.profile.name);

  return (
    <section className="py-12 sm:py-18 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="page-kicker">{persona.profile.title}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-6xl">
            {persona.profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-ink-700 dark:text-ink-200">{persona.profile.tagline}</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-600 dark:text-ink-300">{persona.profile.bio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="button-primary"
            >
              {dictionary.home.aboutLink}
            </Link>
            <Link
              href="/ask"
              className="button-secondary"
            >
              {dictionary.common.askAssistant}
            </Link>
            {primaryContact ? (
              <Link
                href={primaryContact.href}
                className="button-ghost"
              >
                {primaryContact.label}
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="relative">
          <div className="section-card rounded-[2rem] p-3 sm:p-4">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-ink-200/80 bg-[#f3efe9] dark:border-white/10 dark:bg-ink-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(14,18,24,0.04))] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(14,18,24,0.24))]" />
              <div className="relative aspect-[4/5]">
                {portrait?.coverSrc ? (
                  <Image src={portrait.coverSrc} alt={portrait.coverAlt ?? ""} fill className="object-cover opacity-45 blur-sm scale-105" sizes="(min-width: 1024px) 34rem, 100vw" priority />
                ) : null}
                {portrait?.src ? (
                  <Image src={portrait.src} alt={portrait.alt} fill className="object-cover" sizes="(min-width: 1024px) 34rem, 100vw" priority />
                ) : (
                  <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.88),transparent_28%),linear-gradient(135deg,#eee7dc,#d8e2de_55%,#d7dbe8)] p-7 dark:bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(135deg,#111827,#1f2937_55%,#273549)]">
                    <div className="h-20 w-20 rounded-full border border-white/75 bg-white/35 backdrop-blur dark:border-white/15 dark:bg-white/10" />
                    <div>
                      <p className="text-7xl font-semibold tracking-tight text-ink-800/80 dark:text-white/80">{initials}</p>
                      <p className="mt-4 max-w-xs text-sm leading-6 text-ink-700 dark:text-ink-200">{portraitNote}</p>
                    </div>
                  </div>
                )}
                {portrait?.src ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/72 via-ink-950/10 to-transparent px-5 pb-5 pt-16 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{persona.profile.title}</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/88">{portraitNote}</p>
                  </div>
                ) : null}
                {portrait?.placeholder ? (
                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/65 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-800 backdrop-blur dark:border-white/15 dark:bg-ink-950/55 dark:text-white/90">
                      Portrait placeholder
                    </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4 rounded-[1.25rem] border border-ink-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-medium text-ink-950 dark:text-white">{dictionary.home.publicProfile}</p>
              <dl className="mt-4 space-y-4 text-sm">
                {persona.profile.affiliation ? (
                  <div>
                    <dt className="text-ink-500 dark:text-ink-400">{dictionary.home.affiliation}</dt>
                    <dd className="mt-1 text-ink-800 dark:text-ink-100">{persona.profile.affiliation}</dd>
                  </div>
                ) : null}
                {persona.profile.location ? (
                  <div>
                    <dt className="text-ink-500 dark:text-ink-400">{dictionary.home.location}</dt>
                    <dd className="mt-1 text-ink-800 dark:text-ink-100">{persona.profile.location}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-ink-500 dark:text-ink-400">{dictionary.home.focus}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {persona.profile.interests.slice(0, 4).map((interest) => (
                      <span key={interest} className="rounded-full bg-ink-100 px-3 py-1 text-ink-700 dark:bg-white/10 dark:text-ink-100">
                        {interest}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

import Link from "next/link";
import { getLocalizedPersona } from "@/lib/content/localize";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Container } from "@/components/layout/container";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";
import { navItems, getNavLabel } from "@/lib/site/navigation";

export async function Navbar() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const persona = getLocalizedPersona(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-ink-50/90 backdrop-blur dark:border-white/10 dark:bg-ink-950/90">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="min-w-0">
          <span className="block truncate text-sm font-semibold text-ink-950 dark:text-white">
            {persona.profile.name}
          </span>
          <span className="hidden text-xs text-ink-600 dark:text-ink-300 sm:block">{persona.profile.title}</span>
        </Link>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-1 text-sm text-ink-600 transition hover:bg-white/70 hover:text-accent-600 dark:text-ink-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {getNavLabel(dictionary.nav, item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/ask"
            className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100"
          >
            {dictionary.nav.ask}
          </Link>
          <LanguageSwitcher locale={locale} label={dictionary.language.label} />
          <ThemeSwitcher />
        </div>
      </Container>
      <Container className="flex gap-2 overflow-x-auto pb-3 xl:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-ink-200/70 px-3 py-1.5 text-sm text-ink-600 transition hover:border-accent-500 hover:text-accent-600 dark:border-white/10 dark:text-ink-300 dark:hover:text-white"
          >
            {getNavLabel(dictionary.nav, item.key)}
          </Link>
        ))}
      </Container>
    </header>
  );
}

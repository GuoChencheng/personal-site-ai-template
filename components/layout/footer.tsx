import Link from "next/link";
import { getLocalizedPersona } from "@/lib/content/localize";
import { Container } from "@/components/layout/container";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";
import { getNavLabel, navItems } from "@/lib/site/navigation";

export async function Footer() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const persona = getLocalizedPersona(locale);

  return (
    <footer className="border-t border-ink-200/80 bg-white/35 py-10 dark:border-white/10 dark:bg-white/[0.02]">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="font-semibold text-ink-950 dark:text-white">{persona.profile.name}</p>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{persona.profile.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink-600 transition hover:text-accent-600 dark:text-ink-300">
              {getNavLabel(dictionary.nav, item.key)}
            </Link>
          ))}
        </div>
      </Container>
      <Container className="mt-8 text-xs text-ink-500 dark:text-ink-400">
        <p>{dictionary.footer.note}</p>
      </Container>
    </footer>
  );
}

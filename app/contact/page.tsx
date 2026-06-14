import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Contact"
};

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container size="narrow" className="py-14 sm:py-20">
      <p className="page-kicker">{dictionary.pages.contact.eyebrow}</p>
      <h1 className="page-title">{dictionary.pages.contact.title}</h1>
      <p className="page-description">{dictionary.pages.contact.description}</p>
      <div className="mt-10 space-y-4">
        {persona.profile.contact.length > 0 ? (
          persona.profile.contact.map((channel) => (
            <Link key={channel.href} href={channel.href} className="section-card block transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{channel.label}</p>
                  <p className="mt-1 font-medium text-ink-950 dark:text-white">{channel.value}</p>
                </div>
                {channel.preferred ? <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-medium text-white">{dictionary.pages.contact.preferred}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-ink-300 bg-white/55 p-6 text-sm text-ink-600 dark:border-white/15 dark:bg-white/5 dark:text-ink-300">
            {dictionary.pages.contact.empty}
          </div>
        )}
      </div>
      <div className="mt-8 rounded-lg border border-ink-200 bg-white/65 p-5 text-sm leading-6 text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-300">
        <p className="font-medium text-ink-950 dark:text-white">{dictionary.common.askAssistant}</p>
        <p className="mt-2">
          {locale === "zh"
            ? "如果你不确定该联系哪个渠道，可以先询问助手；涉及正式合作或档期时仍应使用上方公开联系方式。"
            : "If you are unsure where to start, ask the assistant first. Formal collaboration or availability requests should still use the public channels above."}
        </p>
        <Link href="/ask" className="button-secondary mt-4 px-4 py-2">
          {dictionary.common.askAssistant}
        </Link>
      </div>
    </Container>
  );
}

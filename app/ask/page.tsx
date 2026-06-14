import type { Metadata } from "next";
import Link from "next/link";
import { AskChat } from "@/components/ask/ask-chat";
import { Container } from "@/components/layout/container";
import { assistantConfig } from "@/lib/ai/config";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Ask"
};

export default async function AskPage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);
  const suggestedQuestions = [...persona.faq.map((item) => item.question), ...assistantConfig.suggestedQuestions[locale]];

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="page-kicker">{dictionary.ask.eyebrow}</p>
          <h1 className="page-title">{dictionary.ask.title}</h1>
          <p className="page-description">{dictionary.ask.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="button-secondary px-4 py-2">
              {dictionary.ask.browseProjects}
            </Link>
            <Link href="/contact" className="button-secondary px-4 py-2">
              {dictionary.common.contact}
            </Link>
          </div>
          <div className="mt-8 rounded-lg border border-ink-200 bg-white/70 p-4 text-sm leading-6 text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-300">
            <p className="font-medium text-ink-950 dark:text-white">{dictionary.ask.trustBoundary}</p>
            <p className="mt-2">{persona.ai.uncertaintyPolicy}</p>
          </div>
        </div>
        <AskChat suggestedQuestions={suggestedQuestions} personaName={persona.profile.name} locale={locale} dictionary={dictionary.ask} />
      </div>
    </Container>
  );
}

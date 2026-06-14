import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/editor/content-editor";
import { Container } from "@/components/layout/container";
import { assistantConfig } from "@/lib/ai/config";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Editor",
  robots: {
    index: false,
    follow: false
  }
};

export default async function EditorPage() {
  const productionEditorEnabled = process.env.EDITOR_ENABLED === "true" && Boolean(process.env.ADMIN_PUBLISH_TOKEN);
  if (process.env.NODE_ENV === "production" && !productionEditorEnabled) {
    notFound();
  }

  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container size="wide" className="py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="page-kicker">{dictionary.pages.editor.eyebrow}</p>
        <h1 className="page-title">{dictionary.pages.editor.title}</h1>
        <p className="page-description">{dictionary.pages.editor.description}</p>
      </div>
      <ContentEditor
        persona={persona}
        dictionary={dictionary}
        locale={locale}
        suggestedQuestions={assistantConfig.suggestedQuestions[locale]}
        requiresAdminGuard={process.env.NODE_ENV === "production"}
      />
    </Container>
  );
}

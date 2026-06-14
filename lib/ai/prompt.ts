import type { ChatMessage } from "@/lib/ai/provider";
import type { PersonaContent } from "@/lib/content/schema";
import type { QueryClass } from "@/lib/ai/types";
import type { RetrievalChunk } from "@/lib/ai/retrieval";
import { assistantConfig } from "@/lib/ai/config";
import type { Locale } from "@/lib/i18n/types";

export function buildAssistantMessages({
  persona,
  query,
  queryClass,
  sources,
  locale = "en"
}: {
  persona: PersonaContent;
  query: string;
  queryClass: QueryClass;
  sources: RetrievalChunk[];
  locale?: Locale;
}): ChatMessage[] {
  const sourceText =
    sources.length > 0
      ? sources.map((source, index) => `[${index + 1}] ${source.label}${source.href ? ` (${source.href})` : ""}\n${source.text}`).join("\n\n")
      : "No matching local source snippets were found.";

  const system = [
    `You are the public site assistant for ${persona.profile.name}.`,
    "You guide visitors through public website content. You do not impersonate the person, make private commitments, or invent facts.",
    `Tone: ${persona.ai.tone}`,
    `Style: ${persona.ai.style}`,
    `Uncertainty policy: ${persona.ai.uncertaintyPolicy}`,
    `Allowed behavior: ${persona.ai.allowedBehavior.join("; ")}`,
    `Forbidden behavior: ${persona.ai.forbiddenBehavior.join("; ")}`,
    `Routing guidance: ${persona.ai.routingGuidance.join("; ")}`,
    `Forbidden topics for this template: ${assistantConfig.forbiddenTopics.join("; ")}`,
    `Default response language: ${locale === "zh" ? "Simplified Chinese" : "English"}. Use this language unless the visitor explicitly asks otherwise.`,
    "Answer only from the provided source snippets and site routes. If the snippets do not contain the answer, say the public site does not specify it.",
    "For collaboration, hiring, availability, private, or formal requests, route the visitor to the contact page or configured email rather than making commitments.",
    "Keep the answer concise. Mention useful source labels naturally when relevant."
  ].join("\n");

  const user = [
    `Visitor question: ${query}`,
    `Query class: ${queryClass}`,
    "Retrieved public sources:",
    sourceText,
    "Return a direct answer grounded in these sources. Do not include JSON."
  ].join("\n\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

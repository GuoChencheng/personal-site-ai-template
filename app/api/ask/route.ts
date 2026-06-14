import { NextResponse } from "next/server";
import { answerAssistantQuestion } from "@/lib/ai/assistant";
import type { AssistantRequest } from "@/lib/ai/types";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/types";

export const runtime = "nodejs";

type AskBody = {
  query?: unknown;
  question?: unknown;
  personaId?: unknown;
  locale?: unknown;
};

export async function POST(request: Request) {
  const requestLocale = await getRequestLocale();
  const requestDictionary = getDictionary(requestLocale);
  let body: AskBody;

  try {
    body = (await request.json()) as AskBody;
  } catch {
    return NextResponse.json(
      {
        answer: requestDictionary.ai.invalidJson,
        sources: [],
        suggestedLinks: [],
        error: { code: "invalid-json", message: requestDictionary.ai.invalidJson },
        meta: { usedFallback: true }
      },
      { status: 400 }
    );
  }

  const query = typeof body.query === "string" ? body.query : typeof body.question === "string" ? body.question : "";
  const personaId = typeof body.personaId === "string" ? body.personaId : undefined;
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : requestLocale;
  const dictionary = getDictionary(locale);

  if (query.trim().length > 1200) {
    return NextResponse.json(
      {
        answer: dictionary.ai.tooLong,
        sources: [],
        suggestedLinks: [],
        error: { code: "question-too-long", message: dictionary.ai.tooLong },
        meta: { usedFallback: true }
      },
      { status: 400 }
    );
  }

  const assistantRequest: AssistantRequest = { query, personaId, locale };
  const response = await answerAssistantQuestion(assistantRequest);
  return NextResponse.json(response, { status: response.error?.code === "empty-question" ? 400 : 200 });
}

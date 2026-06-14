import { assistantConfig, getProviderConfig } from "@/lib/ai/config";
import { classifyQuery } from "@/lib/ai/classify";
import { buildGroundedFallbackAnswer } from "@/lib/ai/fallback";
import { createOpenAiCompatibleProvider, ProviderConfigurationError } from "@/lib/ai/openai-compatible";
import { buildAssistantMessages } from "@/lib/ai/prompt";
import { retrieveSources } from "@/lib/ai/retrieval";
import type { AssistantRequest, AssistantResponse } from "@/lib/ai/types";
import { getLocalizedPersona } from "@/lib/content/localize";
import { defaultPersonaId, personas } from "@/lib/content/personas";
import type { PersonaId } from "@/lib/content/schema";
import { getDictionary, interpolate } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/types";

function normalizePersonaId(value: string | undefined): PersonaId {
  return value && value in personas ? (value as PersonaId) : defaultPersonaId;
}

function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export async function answerAssistantQuestion(request: AssistantRequest): Promise<AssistantResponse> {
  const query = request.query.trim();
  const locale = normalizeLocale(request.locale);
  const dictionary = getDictionary(locale);
  const persona = getLocalizedPersona(locale, normalizePersonaId(request.personaId));
  const queryClass = request.queryClass ?? classifyQuery(query);
  const retrieval = retrieveSources(persona, query, queryClass, assistantConfig.maxRetrievedSources, locale);
  const sourceReferences = retrieval.sources.map(({ id, label, href, excerpt }) => ({ id, label, href, excerpt }));

  if (!query) {
    return {
      answer: dictionary.ai.emptyQuestion,
      sources: [],
      suggestedLinks: retrieval.suggestedLinks,
      queryClass: "out-of-scope",
      error: { code: "empty-question", message: dictionary.ai.emptyQuestionError },
      meta: { usedFallback: true }
    };
  }

  const providerConfig = getProviderConfig();
  const provider = createOpenAiCompatibleProvider(providerConfig);
  const fallbackAnswer = buildGroundedFallbackAnswer({ persona, queryClass, sources: retrieval.sources, locale });

  try {
    const completion = await provider.complete({
      messages: buildAssistantMessages({ persona, query, queryClass, sources: retrieval.sources, locale }),
      model: providerConfig.model,
      temperature: 0.2,
      maxTokens: assistantConfig.responseLength === "brief" ? 420 : 700
    });

    return {
      answer: completion.content,
      sources: sourceReferences,
      suggestedLinks: retrieval.suggestedLinks,
      queryClass,
      meta: {
        provider: providerConfig.name,
        model: providerConfig.model,
        usedFallback: false
      }
    };
  } catch (error) {
    const missingConfig = error instanceof ProviderConfigurationError;
    return {
      answer: fallbackAnswer,
      sources: sourceReferences,
      suggestedLinks: retrieval.suggestedLinks,
      queryClass,
      error: {
        code: missingConfig ? "missing-api-key" : "provider-failure",
        message: missingConfig
          ? interpolate(dictionary.ai.missingKey, { env: providerConfig.apiKeyEnv })
          : dictionary.ai.providerFailure
      },
      meta: {
        provider: providerConfig.name,
        model: providerConfig.model,
        usedFallback: true
      }
    };
  }
}

import type { ProviderConfig } from "@/lib/ai/provider";
import type { Locale } from "@/lib/i18n/types";

export type AssistantConfig = {
  responseLength: "brief" | "standard";
  maxRetrievedSources: number;
  suggestedQuestions: Record<Locale, string[]>;
  forbiddenTopics: string[];
};

export const assistantConfig: AssistantConfig = {
  responseLength: "standard",
  maxRetrievedSources: 6,
  suggestedQuestions: {
    en: [
      "What does this person work on?",
      "Which project should I look at first?",
      "What public materials are available?",
      "How can I contact them?"
    ],
    zh: ["这个人主要做什么？", "我应该先看哪个项目？", "有哪些公开材料可以阅读？", "我该如何联系？"]
  },
  forbiddenTopics: [
    "private personal details",
    "confidential commitments",
    "legal, medical, or financial advice"
  ]
};

export function getProviderConfig(): ProviderConfig {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase() || "openai";
  const baseUrl =
    process.env.AI_BASE_URL?.trim() ||
    (provider === "deepseek" ? "https://api.deepseek.com/v1" : "https://api.openai.com/v1");

  return {
    name: provider,
    baseUrl,
    apiKeyEnv: process.env.AI_API_KEY_ENV?.trim() || "AI_API_KEY",
    model: process.env.AI_MODEL?.trim() || (provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini"),
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 20000)
  };
}

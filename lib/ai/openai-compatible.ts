import type { AiProvider, ChatCompletionRequest, ChatCompletionResponse, ProviderConfig } from "@/lib/ai/provider";

type OpenAiCompatibleMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAiCompatibleResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

export class ProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderConfigurationError";
  }
}

export class ProviderResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderResponseError";
  }
}

export function createOpenAiCompatibleProvider(config: ProviderConfig): AiProvider {
  const apiKey = process.env[config.apiKeyEnv];

  return {
    name: config.name,
    async complete(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
      if (!apiKey) {
        throw new ProviderConfigurationError(`Missing API key in ${config.apiKeyEnv}.`);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? 20000);

      try {
        const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: request.model ?? config.model,
            messages: request.messages satisfies OpenAiCompatibleMessage[],
            temperature: request.temperature ?? 0.2,
            max_tokens: request.maxTokens ?? 650
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new ProviderResponseError(`Provider returned ${response.status}${detail ? `: ${detail.slice(0, 180)}` : ""}`);
        }

        const data = (await response.json()) as OpenAiCompatibleResponse;
        const content = data.choices?.[0]?.message?.content;
        if (typeof content !== "string" || content.trim().length === 0) {
          throw new ProviderResponseError("Provider response did not include message content.");
        }

        return { content: content.trim(), raw: data };
      } catch (error) {
        if (error instanceof ProviderConfigurationError || error instanceof ProviderResponseError) throw error;
        if (error instanceof Error && error.name === "AbortError") {
          throw new ProviderResponseError("Provider request timed out.");
        }
        throw new ProviderResponseError(error instanceof Error ? error.message : "Unknown provider failure.");
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

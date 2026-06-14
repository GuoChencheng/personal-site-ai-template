export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionRequest = {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatCompletionResponse = {
  content: string;
  raw?: unknown;
};

export type AiProvider = {
  name: string;
  complete(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
};

export type ProviderConfig = {
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  model: string;
  timeoutMs?: number;
};

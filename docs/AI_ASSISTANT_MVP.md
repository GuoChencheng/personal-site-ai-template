# AI Assistant MVP

The assistant is a small RAG-style vertical slice over the template's local content.

## Request Flow

1. `/ask` collects a visitor question.
2. `/api/ask` validates the request.
3. `lib/ai/classify.ts` assigns a deterministic query class.
4. `lib/ai/retrieval.ts` builds local source chunks from the active persona and ranks them with keyword/class scoring.
5. `lib/ai/prompt.ts` assembles a constrained prompt from persona instructions and retrieved sources.
6. `lib/ai/openai-compatible.ts` calls an OpenAI-compatible `/chat/completions` provider when configured.
7. If the provider is missing or fails, `lib/ai/fallback.ts` returns a deterministic source-grounded fallback answer with a clear error code.

## Trust Boundary

The assistant represents public site materials only. It should not invent projects, publications, affiliations, availability, private details, or commitments. Questions outside the public site scope are answered with uncertainty or routed to contact.

## Provider Configuration

The provider layer is OpenAI-compatible by default and supports DeepSeek through configuration:

```bash
AI_PROVIDER=deepseek
AI_BASE_URL=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat
AI_API_KEY=...
```

Any other OpenAI-compatible provider can use the same adapter by setting `AI_BASE_URL`, `AI_MODEL`, and `AI_API_KEY`.

## MVP Limits

- Retrieval is lexical, not vector-based.
- There is no persisted chat history.
- The assistant indexes the current TypeScript-backed persona content.
- No streaming response UI yet.

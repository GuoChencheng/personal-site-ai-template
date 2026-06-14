# AI Layer

This folder implements the assistant MVP as a small source-grounded pipeline:

- `classify.ts`: deterministic query classification
- `retrieval.ts`: local content chunking and lexical ranking
- `prompt.ts`: prompt assembly from persona instructions and retrieved snippets
- `openai-compatible.ts`: reusable OpenAI-compatible provider adapter
- `fallback.ts`: deterministic grounded answer path for missing keys, provider failures, and thin retrieval
- `assistant.ts`: orchestration used by `/api/ask`

The assistant never treats provider output as private knowledge. The prompt instructs the model to answer only from retrieved public snippets, and API responses always return source references and suggested links when available.

"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { AssistantResponse, SourceReference, SuggestedLink } from "@/lib/ai/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceReference[];
  suggestedLinks?: SuggestedLink[];
  error?: AssistantResponse["error"];
};

type AskChatProps = {
  suggestedQuestions: string[];
  personaName: string;
  locale: Locale;
  dictionary: Dictionary["ask"];
};

export function AskChat({ suggestedQuestions, personaName, locale, dictionary }: AskChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = messages.length > 0;
  const canSubmit = input.trim().length > 0 && !isLoading;

  const visibleQuestions = useMemo(() => suggestedQuestions.slice(0, 5), [suggestedQuestions]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, locale })
      });
      const data = (await response.json()) as AssistantResponse;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        suggestedLinks: data.suggestedLinks,
        error: data.error
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: dictionary.networkError,
          error: { code: "network-error", message: "Failed to call /api/ask." }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <section className="section-card p-4 sm:p-6">
      <div className="flex flex-col gap-2 border-b border-ink-200 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-ink-950 dark:text-white">{dictionary.panelTitle}</h2>
        <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">
          {dictionary.panelDescription.replace("{name}", personaName)}
        </p>
      </div>

      {!hasMessages ? (
        <div className="py-8">
          <p className="text-sm font-medium text-ink-950 dark:text-white">{dictionary.suggestedQuestions}</p>
          <div className="mt-3 grid gap-2">
            {visibleQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void submitQuestion(question)}
                className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-left text-sm leading-6 text-ink-700 transition hover:border-accent-500 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-ink-100"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-h-[560px] space-y-4 overflow-y-auto py-5">
          {messages.map((message) => (
            <article key={message.id} className={message.role === "user" ? "ml-auto max-w-[88%]" : "mr-auto max-w-[92%]"}>
              <div
                className={
                  message.role === "user"
                    ? "rounded-lg bg-ink-900 px-4 py-3 text-sm leading-6 text-white dark:bg-white dark:text-ink-950"
                    : "rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm leading-6 text-ink-700 dark:border-white/10 dark:bg-ink-950 dark:text-ink-100"
                }
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.error ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{message.error.message}</p>
              ) : null}
              {message.role === "assistant" && message.sources && message.sources.length > 0 ? <SourceList sources={message.sources} label={dictionary.sources} /> : null}
              {message.role === "assistant" && message.suggestedLinks && message.suggestedLinks.length > 0 ? (
                <SuggestedLinks links={message.suggestedLinks} />
              ) : null}
            </article>
          ))}
          {isLoading ? (
            <div className="mr-auto max-w-[92%] rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm text-ink-600 dark:border-white/10 dark:bg-ink-950 dark:text-ink-300">
              {dictionary.loading}
            </div>
          ) : null}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 border-t border-ink-200 pt-4 dark:border-white/10 sm:flex-row">
        <label className="sr-only" htmlFor="assistant-question">
          {dictionary.inputLabel}
        </label>
        <textarea
          id="assistant-question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={dictionary.placeholder}
          className="min-h-12 flex-1 resize-none rounded-lg border-ink-300 bg-white text-sm text-ink-900 shadow-sm focus:border-accent-600 focus:ring-accent-600 dark:border-white/10 dark:bg-ink-950 dark:text-white"
          rows={2}
        />
        <button type="submit" disabled={!canSubmit} className="button-primary">
          {isLoading ? dictionary.sending : dictionary.send}
        </button>
      </form>
    </section>
  );
}

function SourceList({ sources, label }: { sources: SourceReference[]; label: string }) {
  return (
    <div className="mt-3 rounded-lg border border-ink-200 bg-ink-50 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400">{label}</p>
      <div className="mt-3 grid gap-2">
        {sources.slice(0, 5).map((source) => (
          <div key={source.id ?? source.label} className="rounded-md border border-ink-200 bg-white p-2 text-xs leading-5 text-ink-600 dark:border-white/10 dark:bg-ink-950 dark:text-ink-300">
            {source.href ? (
              <Link href={source.href} className="font-medium text-accent-600 hover:text-accent-500">
                {source.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-800 dark:text-ink-100">{source.label}</span>
            )}
            {source.excerpt ? <p className="mt-1 line-clamp-2">{source.excerpt}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestedLinks({ links }: { links: SuggestedLink[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-700 transition hover:border-accent-500 hover:text-accent-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-100"
          title={link.reason}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

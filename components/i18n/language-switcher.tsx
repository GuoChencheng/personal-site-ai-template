"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { localeCookieName, type Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(nextLocale: Locale) {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center rounded-full border border-ink-200 bg-white p-1 dark:border-white/10 dark:bg-ink-900" aria-label={label}>
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          disabled={isPending || item === locale}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            item === locale
              ? "bg-ink-900 text-white dark:bg-white dark:text-ink-950"
              : "text-ink-600 hover:text-accent-600 dark:text-ink-300 dark:hover:text-white"
          }`}
          aria-pressed={item === locale}
        >
          {item === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}

export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "site-locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "zh";
}

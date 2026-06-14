import type { Metadata } from "next";
import "@/styles/globals.css";
import { PageShell } from "@/components/layout/page-shell";
import { ThemeScript } from "@/components/theme/theme-script";
import { getPersona } from "@/lib/content/personas";
import { getRequestLocale } from "@/lib/i18n/server";

const persona = getPersona();

export const metadata: Metadata = {
  title: {
    default: `${persona.profile.name} | ${persona.profile.title}`,
    template: `%s | ${persona.profile.name}`
  },
  description: persona.profile.tagline
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}

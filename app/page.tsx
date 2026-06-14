import { Container } from "@/components/layout/container";
import { HomepageRenderer } from "@/components/sections/homepage-renderer";
import { getLocalizedPersona } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const persona = getLocalizedPersona(locale);
  const dictionary = getDictionary(locale);

  return (
    <Container>
      <HomepageRenderer persona={persona} dictionary={dictionary} />
    </Container>
  );
}

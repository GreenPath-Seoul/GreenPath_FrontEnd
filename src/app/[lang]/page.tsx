import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import HomeClient from "./HomeClient";

export default async function HomeView({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <HomeClient dictionary={dictionary} lang={lang} />;
}

import { redirect } from "@/lib/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Automatically redirect root / url to the main operational page data (/corp)
  redirect({ href: "/corp", locale });
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import EcosystemSnapshot from "@/components/home/EcosystemSnapshot";
import HealthcareHighlight from "@/components/home/HealthcareHighlight";
import GlobalPresence from "@/components/home/GlobalPresence";
import LeadershipTeaser from "@/components/home/LeadershipTeaser";
import Impact from "@/components/home/Impact";
import Sustainability from "@/components/home/Sustainability";
import ClosingCta from "@/components/home/ClosingCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Introduction />
      <EcosystemSnapshot />
      <HealthcareHighlight />
      <GlobalPresence />
      <LeadershipTeaser />
      <Impact />
      <Sustainability />
      <ClosingCta />
    </>
  );
}

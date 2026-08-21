import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "globalPresence.metadata" });
  return { title: t("title"), description: t("description") };
}

interface Region {
  name: string;
  paragraphs: string[];
}

export default async function GlobalPresencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const regions = t.raw("globalPresence.regions") as Region[];
  const connections = t.raw("globalPresence.beyondGeography.connections") as string[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("globalPresence.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("globalPresence.hero.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <div key={region.name} className="rounded-xl border border-forest-950/10 bg-white p-6">
              <h2 className="text-lg font-semibold text-forest-950">{region.name}</h2>
              {region.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-sm text-forest-950/70">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-950 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white">
            {t("globalPresence.beyondGeography.title")}
          </h2>
          <p className="mt-6 text-lg text-white/70">
            {t("globalPresence.beyondGeography.body1")}
          </p>
          <p className="mt-4 text-lg font-medium text-white">
            {t("globalPresence.beyondGeography.body2")}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {connections.map((item) => (
              <li key={item} className="text-lg font-semibold text-gold-400">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

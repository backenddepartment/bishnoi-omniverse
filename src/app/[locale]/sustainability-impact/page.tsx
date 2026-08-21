import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainabilityImpact.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function SustainabilityImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const principles = t.raw("sustainabilityImpact.ungc.principles") as string[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("sustainabilityImpact.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.hero.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("sustainabilityImpact.hero.body2")}
          </p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            {t("sustainabilityImpact.ungc.eyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-forest-950">
            {t("sustainabilityImpact.ungc.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.ungc.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("sustainabilityImpact.ungc.body2")}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {principles.map((item) => (
              <li key={item} className="text-lg font-semibold text-green-600">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.ungc.body3")}
          </p>
          <p className="mt-8 rounded-xl border border-gold-400/40 bg-white p-6 text-sm text-forest-950/70">
            {t("sustainabilityImpact.ungc.important")}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">
            {t("sustainabilityImpact.patientImpact.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.patientImpact.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("sustainabilityImpact.patientImpact.body2")}
          </p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">
            {t("sustainabilityImpact.communityPartnerships.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.communityPartnerships.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("sustainabilityImpact.communityPartnerships.body2")}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">
            {t("sustainabilityImpact.foundation.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("sustainabilityImpact.foundation.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("sustainabilityImpact.foundation.body2")}
          </p>
        </div>
      </section>
    </>
  );
}

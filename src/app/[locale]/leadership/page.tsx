import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leadership.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("leadership.hero.title")}
          </h1>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            {t("leadership.profile.eyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-forest-950">
            {t("leadership.profile.name")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("leadership.profile.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("leadership.profile.body2")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("leadership.profile.body3")}</p>
        </div>
      </section>

      <section className="bg-forest-950 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">{t("leadership.philosophy.title")}</h2>
          <p className="mt-6 text-lg text-white/70">{t("leadership.philosophy.body1")}</p>
          <p className="mt-4 text-lg text-white/70">{t("leadership.philosophy.body2")}</p>
          <p className="mt-4 text-lg text-white/70">{t("leadership.philosophy.body3")}</p>
          <p className="mt-4 text-lg text-white/70">{t("leadership.philosophy.body4")}</p>
        </div>
      </section>
    </>
  );
}

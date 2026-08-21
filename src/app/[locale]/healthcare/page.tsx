import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "healthcare.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function HealthcarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const capabilities = t.raw("healthcare.getmedsHealthcare.capabilities") as string[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("healthcare.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("healthcare.hero.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("healthcare.hero.body2")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            {t("healthcare.philippines.eyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-forest-950">
            {t("healthcare.philippines.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("healthcare.philippines.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("healthcare.philippines.body2")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("healthcare.philippines.body3")}</p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">
            {t("healthcare.patientAccess.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("healthcare.patientAccess.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("healthcare.patientAccess.body2")}</p>
          <p className="mt-8 text-xl font-semibold italic text-green-600">
            &ldquo;{t("healthcare.patientAccess.quote")}&rdquo;
          </p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            {t("healthcare.getmedsHealthcare.eyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-forest-950">
            {t("healthcare.getmedsHealthcare.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("healthcare.getmedsHealthcare.body1")}
          </p>
          <p className="mt-4 text-lg text-forest-950/70">
            {t("healthcare.getmedsHealthcare.body2")}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {capabilities.map((item) => (
              <li key={item} className="text-lg font-semibold text-green-600">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg text-forest-950/70">
            {t("healthcare.getmedsHealthcare.body3")}
          </p>
        </div>
      </section>

      <section className="bg-forest-950 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white">{t("healthcare.philosophy.title")}</h2>
          <p className="mt-6 text-lg text-white/70">{t("healthcare.philosophy.body1")}</p>
          <p className="mt-4 text-lg text-white/70">{t("healthcare.philosophy.body2")}</p>
        </div>
      </section>
    </>
  );
}

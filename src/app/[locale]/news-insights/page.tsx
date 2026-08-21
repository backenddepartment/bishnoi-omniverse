import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsInsights.metadata" });
  return { title: t("title"), description: t("description") };
}

interface Category {
  name: string;
  description: string;
}

export default async function NewsInsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const categories = t.raw("newsInsights.categories") as Category[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("newsInsights.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("newsInsights.hero.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-forest-950">
            {t("newsInsights.categoriesTitle")}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-xl border border-forest-950/10 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-forest-950">{category.name}</h3>
                <p className="mt-2 text-sm text-forest-950/70">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

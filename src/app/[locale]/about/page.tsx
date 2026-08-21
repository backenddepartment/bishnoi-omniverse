import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.metadata" });
  return { title: t("title"), description: t("description") };
}

interface Item {
  title: string;
  description: string;
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const philosophy = t.raw("about.philosophy.items") as Item[];
  const values = t.raw("about.values.items") as Item[];
  const storyList = t.raw("about.ourStory.list") as string[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("about.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("about.hero.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-forest-950">
            {t("about.ourStory.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("about.ourStory.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.ourStory.body2")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.ourStory.body3")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.ourStory.body4")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.ourStory.body5")}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center">
            {storyList.map((item) => (
              <li key={item} className="text-lg font-semibold text-green-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">
            {t("about.whatOmniverseMeans.title")}
          </h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("about.whatOmniverseMeans.body1")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.whatOmniverseMeans.body2")}</p>
          <p className="mt-4 text-lg text-forest-950/70">{t("about.whatOmniverseMeans.body3")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">{t("about.vision.title")}</h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("about.vision.body")}</p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">{t("about.mission.title")}</h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("about.mission.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-forest-950">
            {t("about.philosophy.title")}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {philosophy.map((item) => (
              <div key={item.title} className="rounded-xl border border-forest-950/10 bg-white p-6">
                <h3 className="text-lg font-semibold text-forest-950">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-950/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-forest-950">
            {t("about.values.title")}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div key={item.title} className="rounded-xl border border-forest-950/10 p-6">
                <h3 className="text-lg font-semibold text-forest-950">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-950/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

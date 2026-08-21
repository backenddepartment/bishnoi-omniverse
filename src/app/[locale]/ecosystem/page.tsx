import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem.metadata" });
  return { title: t("title"), description: t("description") };
}

interface Venture {
  category: string;
  name: string;
  paragraphs: string[];
  list?: string[];
  trailingParagraph?: string;
  region?: string;
  sector?: string;
  status?: string;
  cta?: string;
  additionalKind?: "legal" | "operational" | "programs";
}

const ADDITIONAL_LABEL_KEYS = {
  legal: "ecosystem.additionalLegalLabel",
  operational: "ecosystem.additionalOperationalLabel",
  programs: "ecosystem.additionalProgramsLabel",
} as const;

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const ventures = t.raw("ecosystem.ventures") as Venture[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("ecosystem.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("ecosystem.hero.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-8">
        <p className="mx-auto max-w-3xl text-center text-sm text-forest-950/60">
          {t("ecosystem.transparencyStatement")}
        </p>
      </section>

      {ventures.map((venture, index) => (
        <section
          key={venture.name}
          className={index % 2 === 0 ? "bg-white px-6 py-16" : "bg-cream-50 px-6 py-16"}
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
              {venture.category}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-forest-950">{venture.name}</h2>

            {venture.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-forest-950/70">
                {paragraph}
              </p>
            ))}

            {venture.list ? (
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {venture.list.map((item) => (
                  <li key={item} className="text-sm font-medium text-green-600">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {venture.trailingParagraph ? (
              <p className="mt-4 text-forest-950/70">{venture.trailingParagraph}</p>
            ) : null}

            <dl className="mt-6 space-y-1 border-t border-forest-950/10 pt-4">
              {venture.region ? (
                <div className="flex gap-2 text-sm">
                  <dt className="font-semibold text-forest-950">{t("ecosystem.regionLabel")}:</dt>
                  <dd className="text-forest-950/70">{venture.region}</dd>
                </div>
              ) : null}
              {venture.sector ? (
                <div className="flex gap-2 text-sm">
                  <dt className="font-semibold text-forest-950">{t("ecosystem.sectorLabel")}:</dt>
                  <dd className="text-forest-950/70">{venture.sector}</dd>
                </div>
              ) : null}
              {venture.status ? (
                <div className="flex gap-2 text-sm">
                  <dt className="font-semibold text-forest-950">{t("ecosystem.statusLabel")}:</dt>
                  <dd className="text-forest-950/70">{venture.status}</dd>
                </div>
              ) : null}
              {venture.additionalKind ? (
                <div className="flex gap-2 text-sm">
                  <dt className="font-semibold text-forest-950">
                    {t(ADDITIONAL_LABEL_KEYS[venture.additionalKind])}:
                  </dt>
                  <dd className="text-forest-950/70">{t("ecosystem.subjectToVerification")}</dd>
                </div>
              ) : null}
            </dl>

            {venture.cta ? (
              <a
                href="#"
                className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
              >
                {venture.cta}
              </a>
            ) : null}
          </div>
        </section>
      ))}
    </>
  );
}

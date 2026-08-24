import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import RequestProductForm from "@/components/RequestProductForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface CustomerPathCard {
  icon: string;
  title: string;
  description: string;
  ctaText: string;
}

interface BusinessCard {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
}

const CUSTOMER_PATH_HREFS = [
  "/corp/hospital-supply",
  "/contact?reason=distribution-partnership#request-product",
  "/contact?reason=manufacturer-partnership#request-product",
  "/corp",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const customerPaths = t.raw("home.customerPaths.cards") as CustomerPathCard[];
  const getmedsPhilippines = t.raw("home.businesses.getmedsPhilippines") as BusinessCard;
  const getmedsHealthcare = t.raw("home.businesses.getmedsHealthcare") as BusinessCard;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream-50 via-white to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-forest-950 sm:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">{t("home.hero.body1")}</p>
          <p className="mt-4 text-base text-forest-950/70 leading-relaxed">{t("home.hero.body2")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#businesses"
              className="rounded-xl bg-orange-500 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
            >
              {t("home.hero.primaryCta")}
            </a>
            <Link
              href="/contact?reason=manufacturer-partnership#request-product"
              className="rounded-xl border border-forest-950/20 bg-white px-6 py-3.5 text-base font-bold text-forest-950 hover:bg-cream-50 transition-colors"
            >
              {t("home.hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Customer-type paths */}
      <section className="bg-cream-50/60 py-16 px-6 border-y border-forest-950/10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 text-center">
            {t("home.customerPaths.tag")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-center text-forest-950 sm:text-3xl">
            {t("home.customerPaths.title")}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {customerPaths.map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-forest-950">{card.title}</h3>
                <p className="mt-2 text-xs text-forest-950/70 leading-relaxed">{card.description}</p>
                <Link
                  href={CUSTOMER_PATH_HREFS[i]}
                  className="mt-4 inline-block text-xs font-bold text-orange-600 hover:underline"
                >
                  {card.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Operating Businesses */}
      <section id="businesses" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 text-center">
            {t("home.businesses.tag")}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-center text-forest-950 sm:text-4xl">
            {t("home.businesses.title")}
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-cream-50 p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">
                  PH
                </span>
                <h3 className="text-xl font-bold text-forest-950">{getmedsPhilippines.title}</h3>
              </div>
              <p className="mt-4 text-sm text-forest-950/80 leading-relaxed">{getmedsPhilippines.description}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {getmedsPhilippines.features.map((feature) => (
                  <li key={feature} className="text-sm font-medium text-green-600">
                    • {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/corp"
                className="mt-6 inline-block text-sm font-bold text-orange-600 hover:underline"
              >
                {getmedsPhilippines.ctaText}
              </Link>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-forest-950 text-white p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">
                  IN
                </span>
                <h3 className="text-xl font-bold text-white">{getmedsHealthcare.title}</h3>
              </div>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">{getmedsHealthcare.description}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {getmedsHealthcare.features.map((feature) => (
                  <li key={feature} className="text-sm font-medium text-orange-300">
                    • {feature}
                  </li>
                ))}
              </ul>
              <Link href="/llp" className="mt-6 inline-block text-sm font-bold text-orange-400 hover:underline">
                {getmedsHealthcare.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Request a Product */}
      <section id="request-product" className="bg-cream-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 text-center">
            {t("home.requestProduct.tag")}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-center text-forest-950 sm:text-4xl">
            {t("home.requestProduct.title")}
          </h2>
          <p className="mt-4 text-center text-base text-forest-950/70">{t("home.requestProduct.body")}</p>

          <div className="mt-10">
            <RequestProductForm />
          </div>
        </div>
      </section>
    </>
  );
}

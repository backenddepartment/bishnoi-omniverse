import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import GlobalCallout from "@/components/corp/GlobalCallout";
import { CorpJsonLd } from "@/components/seo/JsonLd";
import { getCommonData } from "@/lib/data/getOmniverseData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "corp.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CorpHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "corp" });

  const metrics = [
    { number: "500+", label: "Hospitals Served Nationwide", scope: "Philippines" },
    { number: "10,000+", label: "Pharmacies Reached Across Archipelago", scope: "Philippines" },
    { number: "2 Million+", label: "Filipino Patient Lives Touched", scope: "Philippines" },
    { number: "2,000+", label: "Molecules in Active Portfolio", scope: "Global & Local" },
    { number: "50+", label: "Global Manufacturer Partnerships", scope: "US, EU, IN, CN" },
    { number: "54+", label: "Countries Served via Global Hub", scope: "International Export" },
  ];

  const therapeuticAreas = [
    {
      title: "Oncology",
      desc: "Chemotherapy & targeted therapies for breast cancer, lung cancer, prostate cancer, ovarian cancer, colorectal cancer, and brain tumors.",
      icon: "🎗️",
    },
    {
      title: "Hematology",
      desc: "Specialized regimens for Leukemia, Lymphoma (Hodgkin & Non-Hodgkin), and Multiple Myeloma (Bortezomib & Bendamustine).",
      icon: "🩸",
    },
    {
      title: "Anesthesiology & Critical Care",
      desc: "ICU sedatives, emergency pressors, neuromuscular blockers, and surgical emergency medications.",
      icon: "🏥",
    },
    {
      title: "Anti-Infectives",
      desc: "Reserve broad-spectrum IV antibiotics and antivirals for severe hospital-acquired infections.",
      icon: "🛡️",
    },
    {
      title: "Cardiology",
      desc: "Essential therapeutic management for hypertension, heart failure, and acute cardiac care.",
      icon: "🫀",
    },
    {
      title: "Endocrinology",
      desc: "Insulin formulations, diabetes management solutions, and specialized hormonal therapies.",
      icon: "⚖️",
    },
  ];

  return (
    <>
      <CorpJsonLd />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cream-50 via-white to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                {t("badge")}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-forest-950 sm:text-5xl lg:text-6xl">
                {t("h1")}
              </h1>
              <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
                {t("intro")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/corp/oncology-medicines"
                  className="rounded-xl bg-orange-500 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
                >
                  {t("ctaExplore")}
                </Link>
                <Link
                  href="/corp/hospital-supply"
                  className="rounded-xl border border-forest-950/20 bg-white px-6 py-3.5 text-base font-bold text-forest-950 hover:bg-cream-50 transition-colors"
                >
                  {t("ctaHospital")}
                </Link>
                <Link
                  href="/llp"
                  className="rounded-xl bg-forest-950 px-6 py-3.5 text-base font-bold text-white hover:bg-forest-900 transition-colors"
                >
                  {t("ctaGlobal")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-forest-950/10 bg-white p-8 shadow-xl">
                <h2 className="text-xl font-bold text-forest-950">Key Philippine & Global Scale</h2>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-xl bg-cream-50 p-4">
                      <p className="text-2xl font-extrabold text-orange-500">{m.number}</p>
                      <p className="mt-1 text-xs font-semibold uppercase text-forest-950/50">{m.scope}</p>
                      <p className="mt-1 text-xs text-forest-950/80">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qu      {/* Quick Persona Guidance Bar */}
      <section className="bg-cream-50/60 py-12 px-6 border-y border-forest-950/10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 text-center">
            {getCommonData().pathways.tag}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-center text-forest-950 sm:text-3xl">
            {getCommonData().pathways.title}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCommonData().pathways.cards.map((card: { title: string; icon: string; desc: string; linkText: string; href: string }) => (
              <div key={card.title} className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-forest-950">{card.title}</h3>
                <p className="mt-2 text-xs text-forest-950/70 leading-relaxed">
                  {card.desc}
                </p>
                <Link href={card.href} className="mt-4 inline-block text-xs font-bold text-orange-600 hover:underline">
                  {card.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source and Supply Chain Overview */}
      <section className="bg-white px-6 py-16 border-t border-forest-950/10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-950 sm:text-4xl">
              The Bishnoi Omniverse Source-and-Supply Chain
            </h2>
            <p className="mt-4 text-base text-forest-950/70">
              A unified, regulatory-compliant supply network bridging international pharmaceutical hubs with Philippine healthcare institutions and global markets.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-cream-50 p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">PH</span>
                <div>
                  <h3 className="text-xl font-bold text-forest-950">Philippines Operations</h3>
                  <p className="text-xs text-forest-950/60">Getmeds Philippines Inc. / 2MG Inc.</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-forest-950/80 leading-relaxed">
                SEC-registered Philippine corporation holding FDA License to Operate (LTO) and PDEA S-4/S-5 permits for dangerous drugs. Responsible for local importation, customs clearance, WHO GSDP cold-chain warehousing in Metro Manila, and nationwide hospital distribution.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/70">
                <li className="flex items-center gap-2">✓ 500+ Public & Private Hospitals Served</li>
                <li className="flex items-center gap-2">✓ Accredited Supplier for DSWD, PCSO, OVP, OP</li>
                <li className="flex items-center gap-2">✓ 24–48 Hour Urgent Logistics Nationwide</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-forest-950 text-white p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">IN</span>
                <div>
                  <h3 className="text-xl font-bold text-white">Global Sourcing & Export Hub</h3>
                  <p className="text-xs text-white/60">Getmeds Healthcare (LLP - India)</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">
                Our global procurement and wholesale export arm operating from India. Direct sourcing from WHO-GMP, US FDA, EU MHRA, UK MHRA, and PIC/S certified facilities to deliver 2,000+ molecules across 54+ countries worldwide.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">✓ 54+ Countries Served Internationally</li>
                <li className="flex items-center gap-2">✓ 50+ Audited Manufacturer Partnerships</li>
                <li className="flex items-center gap-2">✓ Direct Wholesale Export & Priority Air Freight</li>
              </ul>
              <div className="mt-6">
                <Link href="/llp" className="inline-block text-xs font-bold uppercase tracking-wider text-orange-400 hover:underline">
                  Visit India Global Export Hub →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Areas Overview */}
      <section className="bg-cream-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-950 sm:text-4xl">
              Specialized Therapeutic Categories
            </h2>
            <p className="mt-4 text-base text-forest-950/70">
              Supplying critical pharmaceuticals across essential medical specialties for hospital formularies, public tenders, and specialty clinics.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {therapeuticAreas.map((item) => (
              <div key={item.title} className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 text-xl font-bold text-forest-950">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-950/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-forest-950 sm:text-4xl">
            Why Choose Bishnoi Omniverse?
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white">
              <h3 className="text-2xl font-bold text-forest-950">For Philippine Hospitals & Government</h3>
              <ul className="mt-6 space-y-4 text-sm text-forest-950/80">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>FDA Philippines & PDEA Licensed:</strong> Full License to Operate (LTO) and PDEA S-4/S-5 permits for controlled substances.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>Accredited Supplier for Assistance Programs:</strong> Verified provider for DSWD, PCSO, OVP, and OP medical assistance grants.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>WHO GSDP Cold-Chain Excellence:</strong> Rigorous 2°C to 8°C temperature control for sensitive oncology biologics.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>24 to 48-Hour Urgent Delivery:</strong> Emergency dispatch serving hospitals in Luzon, Visayas, and Mindanao.
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white">
              <h3 className="text-2xl font-bold text-forest-950">For International Distributors & Buyers</h3>
              <ul className="mt-6 space-y-4 text-sm text-forest-950/80">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>2,000+ Active Molecule Portfolio:</strong> High-efficacy generic and branded oncology, hematology, and ICU products.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>WHO-GMP & US FDA Sourced:</strong> Manufactured in internationally audited facilities across US, Europe, India, and China.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>54+ Countries Reach:</strong> Direct international logistics managed via our India LLP export hub.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-base">✓</span>
                  <div>
                    <strong>Full Dossier & COA Support:</strong> Complete export documentation, COPP, and COA for quick local registration.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <GlobalCallout />
        </div>
      </section>

      {/* Global Note Footer Link */}
      <footer className="bg-forest-950 px-6 py-6 text-center text-xs text-cream-50">
        🌍 For our global sourcing and export operations, visit our{" "}
        <Link href="/llp" className="underline hover:text-orange-400 font-semibold">
          India Global Export Hub
        </Link>
        .
      </footer>
    </>
  );
}

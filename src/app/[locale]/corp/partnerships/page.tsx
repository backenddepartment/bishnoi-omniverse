import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import GlobalCallout from "@/components/corp/GlobalCallout";

export const metadata: Metadata = {
  title: "Pharma Partnerships Philippines & Global – Distributor Network",
  description:
    "Partner with a trusted FDA-licensed pharmaceutical distributor in the Philippines. Global manufacturing partnerships via our India LLP export hub.",
};

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const offerTable = [
    {
      partner: "Global Manufacturers (US, EU, India, China)",
      need: "Entry into the Philippine Healthcare Market",
      solution: "Complete FDA Philippines CPR registration, PDEA clearance, BOC importation, and distribution to 500+ hospitals.",
      arm: "Philippines Operations",
    },
    {
      partner: "Local Philippine Distributors",
      need: "Product Portfolio Expansion",
      solution: "Reliable local supply of high-demand oncology, critical care, and specialty pharmaceuticals with full FDA compliance.",
      arm: "Philippines Operations",
    },
    {
      partner: "International Distributors & Buyers",
      need: "Reliable Oncology & Specialty Supply",
      solution: "Global export of 2,000+ molecules sourced from WHO-GMP, US FDA, EU MHRA, and PIC/S certified facilities across 54+ countries.",
      arm: "Global Export Hub",
    },
  ];

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              Commercial Partnerships • Bishnoi Omniverse
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Strategic Pharmaceutical Partnerships: Philippine Market Entry & Global Distribution
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              The Bishnoi Omniverse offers a dual-gateway partnership model designed to connect global pharmaceutical manufacturers with the high-growth Philippine market, while enabling international distributors to access our vast export portfolio.
            </p>
          </div>

          {/* Offer Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">What We Offer Our Partners</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Partner Profile</th>
                    <th className="px-6 py-4 font-bold">Strategic Need</th>
                    <th className="px-6 py-4 font-bold">Bishnoi Omniverse Solution</th>
                    <th className="px-6 py-4 font-bold">Operating Arm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {offerTable.map((row) => (
                    <tr key={row.partner} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600">{row.partner}</td>
                      <td className="px-6 py-4 font-medium">{row.need}</td>
                      <td className="px-6 py-4 text-forest-950/80">{row.solution}</td>
                      <td className="px-6 py-4 font-bold text-forest-950">{row.arm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sourcing Network */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Our Global Sourcing Network</h2>
            <p className="mt-2 text-sm text-forest-950/70">
              We maintain active commercial partnerships with over <strong>50+ premier pharmaceutical manufacturers</strong> across key global production hubs:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <h3 className="font-bold text-forest-950 text-lg">India & China Sourcing</h3>
                <p className="mt-2 text-sm text-forest-950/70">
                  High-capacity manufacturing of Active Pharmaceutical Ingredients (APIs) and finished solid/injectable formulations under strict WHO-GMP protocols.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <h3 className="font-bold text-forest-950 text-lg">Europe & USA Partnerships</h3>
                <p className="mt-2 text-sm text-forest-950/70">
                  Advanced targeted therapies, specialty biologics, and certified oncology innovations adhering to EU MHRA, US FDA, and PIC/S standards.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-xl font-bold text-forest-950">Path A: Manufacturer Seeking PH Entry</h2>
              <ol className="mt-6 space-y-4 text-sm text-forest-950/80 list-decimal pl-4">
                <li><strong>Initial Assessment:</strong> Product portfolio review and regulatory feasibility analysis for the Philippine market.</li>
                <li><strong>FDA Registration:</strong> Processing FDA Certificate of Product Registration (CPR) and PDEA permits.</li>
                <li><strong>Import & Logistics:</strong> Bureau of Customs clearance and WHO GSDP warehouse intake in Metro Manila.</li>
                <li><strong>Commercial Launch:</strong> Distribution to 500+ hospitals, government tender representation, and pharmacy placement.</li>
              </ol>
              <div className="mt-8">
                <a
                  href="mailto:sales5@2mginc.com"
                  className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  Contact Philippine BD Team (sales5@2mginc.com) →
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-forest-950 text-white p-8">
              <h2 className="text-xl font-bold text-white">Path B: Buyer Seeking Global Export</h2>
              <ol className="mt-6 space-y-4 text-sm text-white/80 list-decimal pl-4">
                <li><strong>Product Selection:</strong> Select from 2,000+ molecules available in our India LLP catalog.</li>
                <li><strong>Export Documentation:</strong> Provision of COA, COPP, and WHO-GMP documentation.</li>
                <li><strong>Priority Freight:</strong> Monitored international cold-chain air/sea freight dispatch to 54+ destination countries.</li>
              </ol>
              <div className="mt-8">
                <a
                  href="mailto:care2@getmeds.in"
                  className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  Contact Global Export Team (care2@getmeds.in) →
                </a>
              </div>
            </div>
          </div>

          <GlobalCallout
            title="Looking to Export or Distribute Oncology Products Worldwide?"
            body="If you are an international pharmaceutical distributor or hospital supply agent looking for direct sourcing from India, our LLP entity (Getmeds Healthcare) handles all international commercial agreements and export logistics."
          />
        </div>
      </section>

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

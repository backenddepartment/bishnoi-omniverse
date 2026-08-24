import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import LlpBanner from "@/components/llp/LlpBanner";

export const metadata: Metadata = {
  title: "Global Pharmaceutical Partnerships – Oncology Export",
  description:
    "Partner with a global pharmaceutical exporter. Sourcing from WHO-GMP, US FDA, EU MHRA facilities. Exporting oncology and specialty medicines to 54+ countries.",
};

export default async function GlobalPartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const offerTable = [
    {
      partner: "International Distributors & Wholesalers",
      need: "Single-Source Portfolio Access",
      solution: "Access to 2,000+ molecules, competitive volume pricing, reliable supply, and complete export documentation (COA, COPP).",
    },
    {
      partner: "Pharmaceutical Manufacturers",
      need: "International Market Expansion",
      solution: "Rapid commercial distribution reach across 54+ countries in Asia-Pacific, Middle East, Africa, Latin America, Caribbean, and Pacific regions.",
    },
    {
      partner: "Hospitals & Ministry Tenders",
      need: "Consistent Specialty Supply",
      solution: "Guaranteed cold-chain integrity, priority air freight, and fulfillment of large-scale hospital and tender requirements.",
    },
  ];

  const steps = [
    { num: "01", title: "Initial Discussion", desc: "We evaluate your target market requirements, regulatory specifications, and requested product list." },
    { num: "02", title: "Sourcing & Quality Audit", desc: "We match your demand with audited partner manufacturers holding WHO-GMP, US FDA, EU MHRA, or PIC/S certifications." },
    { num: "03", title: "Commercial Agreement", desc: "Finalization of transparent pricing, export documentation (COA/COPP), and shipping terms." },
    { num: "04", title: "Cold-Chain Freight", desc: "Temperature-controlled packaging, priority customs clearance in India, and dispatch to destination countries." },
    { num: "05", title: "Ongoing Support", desc: "Continuous post-delivery pharmacovigilance, inventory forecasting, and market expansion support." },
  ];

  const regions = [
    { region: "India", detail: "Global Export Hub managing sourcing and export operations from Mumbai, Maharashtra." },
    { region: "Singapore", detail: "Getmeds HealthTech Pte. Ltd., extending regional management across Asia." },
    { region: "Pacific Region", detail: "Opened the Pacific's first specialty pharmacy dedicated to cancer medicines — serving Vanuatu, Fiji, and across the Pacific." },
    { region: "Vanuatu", detail: "Government collaboration delivering cancer awareness programs and life-saving healthcare solutions." },
    { region: "Saint Kitts and Nevis", detail: "Officially registered operation strengthening Caribbean presence." },
    { region: "Southeast Asia & Regional Markets", detail: "Strategic partnerships and operations across Vietnam, Cambodia, Laos, Myanmar, and Pakistan." },
  ];

  return (
    <>
      <LlpBanner />

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-forest-950/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest-950">
              International B2B Partnerships • India LLP
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Global Partnerships — One Partner. Complete Portfolio. Worldwide Reach.
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Getmeds Healthcare (India LLP) serves as a reliable global commercial partner for international distributors, wholesalers, healthcare systems, and pharmaceutical manufacturers across <strong>54+ countries</strong>.
            </p>
          </div>

          {/* Offer Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">What We Offer Global Partners</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Partner Category</th>
                    <th className="px-6 py-4 font-bold">Strategic Need</th>
                    <th className="px-6 py-4 font-bold">Getmeds Healthcare Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {offerTable.map((row) => (
                    <tr key={row.partner} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600">{row.partner}</td>
                      <td className="px-6 py-4 font-medium">{row.need}</td>
                      <td className="px-6 py-4 text-forest-950/80">{row.solution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5-Step Process */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-forest-950">Our 5-Step Global Partnership Process</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step) => (
                <div key={step.num} className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
                  <span className="text-2xl font-black text-orange-500">{step.num}</span>
                  <h3 className="mt-3 text-lg font-bold text-forest-950">{step.title}</h3>
                  <p className="mt-2 text-xs text-forest-950/70 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Presence Grid */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Regional Presence & Global Network</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((r) => (
                <div key={r.region} className="rounded-xl bg-white p-6 border border-forest-950/10">
                  <h3 className="font-bold text-forest-950 text-lg">{r.region}</h3>
                  <p className="mt-2 text-xs text-forest-950/70 leading-relaxed">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PH Partnership Callout */}
          <div className="mt-16 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
            <h3 className="text-xl font-bold text-forest-950">Looking for Commercial Partnerships in the Philippines?</h3>
            <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
              Global manufacturers seeking local registration, FDA LTO representation, and distribution to 500+ Philippine hospitals should partner directly with our SEC-registered Philippine entity (<strong>Getmeds Philippines Inc. / 2MG Inc.</strong>).
            </p>
            <div className="mt-4">
              <Link href="/corp/partnerships" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                Visit Philippines Partnership Portal →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/llp/contact"
              className="inline-block rounded-xl bg-forest-950 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-forest-900 transition-colors"
            >
              Inquire About Global Partnerships →
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-forest-950 px-6 py-6 text-center text-xs text-cream-50">
        🇵🇭 For pharmaceutical distribution within the Philippines, visit our Philippines CORP at{" "}
        <Link href="/corp" className="underline hover:text-orange-400">
          /corp
        </Link>
        .
      </footer>
    </>
  );
}

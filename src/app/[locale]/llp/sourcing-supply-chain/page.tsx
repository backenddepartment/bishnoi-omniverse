import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import LlpBanner from "@/components/llp/LlpBanner";

export const metadata: Metadata = {
  title: "Pharmaceutical Sourcing & Supply Chain – Global Exporter",
  description:
    "Global pharmaceutical sourcing from WHO-GMP, US FDA, EU MHRA certified manufacturers. Cold-chain logistics and export to 54+ countries.",
};

export default async function SourcingSupplyChainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LlpBanner />

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-forest-950/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest-950">
              Supply Chain & Quality Assurance • India LLP
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Global Sourcing & Supply Chain — Quality You Can Trust
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              At Getmeds Healthcare (India LLP), behind every pharmaceutical order is a patient waiting for treatment. Our supply chain framework is built upon strict quality standards, multi-stage compliance verification, and validated cold-chain logistics serving <strong>54+ countries worldwide</strong>.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
              <span className="text-3xl">🏭</span>
              <h2 className="mt-4 text-2xl font-bold text-forest-950">1. Rigorous Manufacturer Vetting</h2>
              <p className="mt-2 text-sm text-forest-950/70 leading-relaxed">
                We source exclusively from a curated network of 50+ manufacturing partners across India, China, Europe, and the United States. Every partner facility must demonstrate active recognition under five recognized regulatory standards:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/80">
                <li>• <strong>WHO-GMP:</strong> World Health Organization Good Manufacturing Practices</li>
                <li>• <strong>PIC/S:</strong> Pharmaceutical Inspection Co-operation Scheme</li>
                <li>• <strong>US FDA:</strong> United States Food and Drug Administration</li>
                <li>• <strong>EU MHRA:</strong> European Medicines Agency / MHRA</li>
                <li>• <strong>UK MHRA:</strong> Medicines and Healthcare products Regulatory Agency</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
              <span className="text-3xl">🔬</span>
              <h2 className="mt-4 text-2xl font-bold text-forest-950">2. Multi-Stage Quality Assurance</h2>
              <p className="mt-2 text-sm text-forest-950/70 leading-relaxed">
                Our quality control team performs multi-stage audits at every procurement milestone to ensure compliance before shipping:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/80">
                <li>• <strong>Batch Verification:</strong> Review of Certificates of Analysis (COA) for active ingredients and finished dosages.</li>
                <li>• <strong>Regulatory Dossiers:</strong> Certificate of Pharmaceutical Product (COPP), stability data, and registration packages.</li>
                <li>• <strong>Pharmacovigilance:</strong> Continuous post-market safety surveillance across all destination markets.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
              <span className="text-3xl">❄️</span>
              <h2 className="mt-4 text-2xl font-bold text-forest-950">3. WHO GSDP Cold-Chain Handling</h2>
              <p className="mt-2 text-sm text-forest-950/70 leading-relaxed">
                Specialized handling for temperature-sensitive biologics, oncology injectables, and vaccines under WHO GSDP guidelines:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/80">
                <li>• <strong>Validated Thermal Containers:</strong> Calibrated temperature loggers maintaining 2°C to 8°C or deep-freeze conditions.</li>
                <li>• <strong>Priority Air Freight:</strong> Expedited dispatch from major international air cargo hubs in India.</li>
                <li>• <strong>Batch Traceability:</strong> End-to-end digital monitoring from warehouse loading to airport arrival.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
              <span className="text-3xl">📄</span>
              <h2 className="mt-4 text-2xl font-bold text-forest-950">4. Export Documentation & Customs</h2>
              <p className="mt-2 text-sm text-forest-950/70 leading-relaxed">
                Our export compliance experts handle all international shipping documentation to eliminate customs delays:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/80">
                <li>• Commercial Invoices & Packing Lists</li>
                <li>• Airway Bills & Marine Insurance Declarations</li>
                <li>• Certificate of Origin & COA/COPP Certificates</li>
                <li>• Full Customs Export Clearances from India</li>
              </ul>
            </div>
          </div>

          {/* Local PH Callout Box */}
          <div className="mt-16 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
            <h3 className="text-xl font-bold text-forest-950">Need Cold-Chain Supply Delivered Within the Philippines?</h3>
            <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
              For local hospital deliveries and cold-chain supply across Luzon, Visayas, and Mindanao, our Philippine corporation (<strong>Getmeds Philippines Inc. / 2MG Inc.</strong>) operates WHO GSDP compliant warehouses in Metro Manila with 24–48 hour nationwide delivery.
            </p>
            <div className="mt-4">
              <Link href="/corp/hospital-supply" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                Learn About Philippines Hospital Supply →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/llp/contact"
              className="inline-block rounded-xl bg-forest-950 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-forest-900 transition-colors"
            >
              Discuss Your Sourcing Needs →
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

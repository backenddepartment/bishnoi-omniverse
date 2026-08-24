import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import GlobalCallout from "@/components/corp/GlobalCallout";

export const metadata: Metadata = {
  title: "Cancer Medicines Philippines & Global – Oncology Distributor",
  description:
    "Browse FDA-registered oncology medicines available in the Philippines and for global export via our India LLP. Chemotherapy, targeted therapies for all major cancers.",
};

export default async function OncologyMedicinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = [
    {
      name: "Carboget",
      generic: "Carboplatin",
      indications: "Ovarian Cancer, Small/Non-Small Cell Lung Cancer, Bladder Cancer",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "BorteGet",
      generic: "Bortezomib",
      indications: "Multiple Myeloma, Mantle Cell Lymphoma",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "BendaGet",
      generic: "Bendamustine Hydrochloride",
      indications: "Chronic Lymphocytic Leukemia (CLL), Hodgkin & Non-Hodgkin Lymphoma",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "AbiraGet",
      generic: "Abiraterone Acetate",
      indications: "Metastatic Castration-Resistant Prostate Cancer",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "CapeGet",
      generic: "Capecitabine",
      indications: "Advanced Breast Cancer, Colorectal Cancer, Gastric Cancers",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "TemoGet",
      generic: "Temozolomide",
      indications: "Glioblastoma Multiforme, Anaplastic Astrocytoma (Brain Tumors)",
      availability: "Philippines & Global Wholesale",
    },
    {
      name: "AnaGaling",
      generic: "Anastrozole",
      indications: "Hormone Receptor-Positive Early & Advanced Breast Cancer",
      availability: "Philippines & Global Wholesale",
    },
  ];

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              Bishnoi Omniverse • Oncology Division
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              FDA-Registered Oncology & Hematology Portfolio
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Getmeds Philippines Inc. / 2MG Inc. provides a broad portfolio of essential, high-efficacy oncology and hematology medicines in the Philippines. Sourced through strategic global partnerships with 50+ WHO-GMP and US FDA-certified manufacturing partners, our products serve top medical centers, provincial hospitals, and international buyers worldwide.
            </p>
          </div>

          {/* Product Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Featured Branded Oncology Pharmaceuticals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Product Name</th>
                    <th className="px-6 py-4 font-bold">Active Generic Ingredient</th>
                    <th className="px-6 py-4 font-bold">Primary Therapeutic Indications</th>
                    <th className="px-6 py-4 font-bold">Available Markets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {products.map((p) => (
                    <tr key={p.name} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600 text-base">{p.name}</td>
                      <td className="px-6 py-4 font-medium text-forest-950">{p.generic}</td>
                      <td className="px-6 py-4 text-forest-950/80">{p.indications}</td>
                      <td className="px-6 py-4 font-semibold text-green-700">{p.availability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancer Coverage Section */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Solid Tumors Covered</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-forest-950/80">
                <li className="flex items-center gap-2">🎗️ Breast Cancer</li>
                <li className="flex items-center gap-2">🎗️ Lung Cancer</li>
                <li className="flex items-center gap-2">🎗️ Prostate Cancer</li>
                <li className="flex items-center gap-2">🎗️ Ovarian Cancer</li>
                <li className="flex items-center gap-2">🎗️ Colorectal Cancer</li>
                <li className="flex items-center gap-2">🎗️ Pancreatic Cancer</li>
                <li className="flex items-center gap-2">🎗️ Bladder Cancer</li>
                <li className="flex items-center gap-2">🎗️ Cervical Cancer</li>
                <li className="flex items-center gap-2 col-span-2">🧠 Glioblastoma / Brain Tumors</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Hematologic Malignancies</h2>
              <ul className="mt-4 space-y-3 text-sm text-forest-950/80">
                <li className="flex items-center gap-2">🩸 Acute & Chronic Leukemia (CLL)</li>
                <li className="flex items-center gap-2">🩸 Hodgkin & Non-Hodgkin Lymphoma</li>
                <li className="flex items-center gap-2">🩸 Multiple Myeloma</li>
                <li className="flex items-center gap-2">🩸 Mantle Cell Lymphoma</li>
              </ul>
            </div>
          </div>

          {/* Quality & Compliance */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Quality, Standards & Regulatory Compliance</h2>
            <p className="mt-2 text-sm text-forest-950/70">
              Every batch of oncology medication distributed in the Philippines and exported globally adheres to rigorous international quality protocols:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">FDA Philippines LTO</h3>
                <p className="mt-1 text-xs text-forest-950/70">Certified License to Operate for pharmaceutical importation and distribution.</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">PDEA Licensed (S-4 / S-5)</h3>
                <p className="mt-1 text-xs text-forest-950/70">Authorized handler for controlled precursors and dangerous drugs.</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">BOC & SEC Compliant</h3>
                <p className="mt-1 text-xs text-forest-950/70">Registered Philippine Corporation with cleared Customs import channels.</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">WHO GSDP Cold-Chain</h3>
                <p className="mt-1 text-xs text-forest-950/70">Validated 2°C to 8°C thermal packaging for sensitive biologics.</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-forest-950/10 sm:col-span-2 lg:col-span-2">
                <h3 className="font-bold text-forest-950">Global Audit Standards</h3>
                <p className="mt-1 text-xs text-forest-950/70">Sourced from manufacturing facilities audited under WHO-GMP, US FDA, EU MHRA, UK MHRA, and PIC/S guidelines.</p>
              </div>
            </div>
          </div>

          {/* Patient Assistance */}
          <div className="mt-16 rounded-2xl bg-white p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Patient Assistance & Special Access Programs (Philippines)</h2>
            <p className="mt-2 text-sm text-forest-950/70">
              We assist Filipino patients and healthcare institutions through specialized access frameworks:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-bold text-forest-950">Patient Assistance Programs (PAP)</h3>
                <p className="mt-1 text-xs text-forest-950/70">Partnering with medical foundations to reduce financial burdens for cancer care.</p>
              </div>
              <div>
                <h3 className="font-bold text-forest-950">Government Assistance Fulfillment</h3>
                <p className="mt-1 text-xs text-forest-950/70">Accredited supplier for DSWD, PCSO, OVP, and OP guarantee letter assistance programs.</p>
              </div>
              <div>
                <h3 className="font-bold text-forest-950">Named-Patient Access Programs (NPAP)</h3>
                <p className="mt-1 text-xs text-forest-950/70">Facilitating direct, legitimate product procurement for individualized patient needs.</p>
              </div>
              <div>
                <h3 className="font-bold text-forest-950">Compassionate Special Permits (CSP)</h3>
                <p className="mt-1 text-xs text-forest-950/70">Assisting oncologists and medical centers in securing FDA Philippines CSP approvals.</p>
              </div>
            </div>
          </div>

          <GlobalCallout
            title="Global Oncology Supply & Wholesale Export"
            body="Are you a hospital administrator, ministry of health official, or pharmaceutical distributor outside the Philippines? All branded and generic oncology products in our portfolio are available for worldwide export through Getmeds Healthcare (India LLP), reaching 54+ countries."
          />

          <div className="mt-12 text-center">
            <Link
              href="/corp/contact"
              className="inline-block rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
            >
              Request a Product Quote →
            </Link>
          </div>
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

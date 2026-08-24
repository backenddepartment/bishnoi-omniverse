import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "Oncology Export Portfolio – Cancer Medicines | Getmeds",
  description:
    "Export-quality oncology medicines available for global distribution. Chemotherapy, targeted therapies, and supportive care for all major cancers. WHO-GMP certified.",
};

export default async function OncologyExportPortfolioPage({
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
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "BorteGet",
      generic: "Bortezomib",
      indications: "Multiple Myeloma, Mantle Cell Lymphoma",
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "BendaGet",
      generic: "Bendamustine Hydrochloride",
      indications: "Chronic Lymphocytic Leukemia (CLL), Hodgkin & Non-Hodgkin Lymphoma",
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "AbiraGet",
      generic: "Abiraterone Acetate",
      indications: "Metastatic Castration-Resistant Prostate Cancer",
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "CapeGet",
      generic: "Capecitabine",
      indications: "Advanced Breast Cancer, Colorectal Cancer, Gastric Cancers",
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "TemoGet",
      generic: "Temozolomide",
      indications: "Glioblastoma Multiforme, Anaplastic Astrocytoma (Brain Tumors)",
      availability: "Global Export & Philippines Operations",
    },
    {
      name: "AnaGaling",
      generic: "Anastrozole",
      indications: "Hormone Receptor-Positive Early & Advanced Breast Cancer",
      availability: "Global Export & Philippines Operations",
    },
  ];

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-forest-950/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest-950">
              Getmeds Healthcare India • Oncology Export Division
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Our Oncology Export Portfolio — Available for Global Distribution
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Getmeds Healthcare (India LLP) exports a comprehensive portfolio of high-efficacy oncology and hematology pharmaceuticals to international distributors, hospitals, and ministry buyers across <strong>54+ countries</strong> worldwide.
            </p>
          </div>

          {/* Product Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Featured Branded Oncology Pharmaceuticals for Export</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Product Name</th>
                    <th className="px-6 py-4 font-bold">Active Generic Ingredient</th>
                    <th className="px-6 py-4 font-bold">Primary Indications</th>
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

          {/* Cancer Indications Covered */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Solid Tumors Covered</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-forest-950/80">
                <li>🎗️ Breast Cancer</li>
                <li>🎗️ Lung Cancer</li>
                <li>🎗️ Prostate Cancer</li>
                <li>🎗️ Ovarian Cancer</li>
                <li>🎗️ Colorectal Cancer</li>
                <li>🎗️ Pancreatic Cancer</li>
                <li>🎗️ Bladder Cancer</li>
                <li>🎗️ Cervical Cancer</li>
                <li className="col-span-2">🧠 Glioblastoma Multiforme & Brain Tumors</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Hematologic Malignancies</h2>
              <ul className="mt-4 space-y-3 text-sm text-forest-950/80">
                <li>🩸 Acute & Chronic Leukemia (CLL)</li>
                <li>🩸 Hodgkin & Non-Hodgkin Lymphoma</li>
                <li>🩸 Multiple Myeloma</li>
                <li>🩸 Sickle Cell Anemia</li>
              </ul>
            </div>
          </div>

          {/* Quality Standards */}
          <div className="mt-16 rounded-2xl bg-forest-950 text-white p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-white">Five Recognized Quality Certifications</h2>
            <p className="mt-2 text-sm text-white/80">
              All products in our export portfolio are sourced strictly from partner manufacturing facilities holding active certification under:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 text-center">
              <div className="rounded-xl bg-white/10 p-4 border border-white/10">
                <p className="font-extrabold text-orange-400 text-lg">WHO-GMP</p>
                <p className="mt-1 text-xs text-white/70">World Health Organization</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 border border-white/10">
                <p className="font-extrabold text-orange-400 text-lg">PIC/S</p>
                <p className="mt-1 text-xs text-white/70">Co-operation Scheme</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 border border-white/10">
                <p className="font-extrabold text-orange-400 text-lg">US FDA</p>
                <p className="mt-1 text-xs text-white/70">United States FDA</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 border border-white/10">
                <p className="font-extrabold text-orange-400 text-lg">EU MHRA</p>
                <p className="mt-1 text-xs text-white/70">European Union</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 border border-white/10">
                <p className="font-extrabold text-orange-400 text-lg">UK MHRA</p>
                <p className="mt-1 text-xs text-white/70">United Kingdom</p>
              </div>
            </div>
          </div>

          {/* Global Patient Access */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Global Patient Access & Assistance Programs</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <h3 className="font-bold text-forest-950 text-lg">Patient Assistance Programs (PAP)</h3>
                <p className="mt-2 text-xs text-forest-950/70">Partnering with international healthcare foundations to reduce patient cost barriers.</p>
              </div>
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <h3 className="font-bold text-forest-950 text-lg">Named-Patient Access (NPAP)</h3>
                <p className="mt-2 text-xs text-forest-950/70">Direct, compliant fulfillment for single-patient prescription access worldwide.</p>
              </div>
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <h3 className="font-bold text-forest-950 text-lg">Compassionate Special Permit (CSP)</h3>
                <p className="mt-2 text-xs text-forest-950/70">Assisting hospital systems with emergency import permits for un-registered oncology medications.</p>
              </div>
            </div>
          </div>

          {/* Local PH Callout Box */}
          <div className="mt-16 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
            <h3 className="text-xl font-bold text-forest-950">Are You Located in the Philippines?</h3>
            <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
              If you are a cancer patient, oncologist, or hospital procurement officer in the Philippines, these oncology medicines are imported and distributed through our local FDA-licensed operating entity (<strong>Getmeds Philippines Inc. / 2MG Inc.</strong>).
            </p>
            <div className="mt-4">
              <Link href="/corp/oncology-medicines" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                View Philippines Local Portfolio →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/llp/contact"
              className="inline-block rounded-xl bg-forest-950 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-forest-900 transition-colors"
            >
              Request Global Export Quote →
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

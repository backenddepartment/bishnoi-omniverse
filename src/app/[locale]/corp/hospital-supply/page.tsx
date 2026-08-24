import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import GlobalCallout from "@/components/corp/GlobalCallout";

export const metadata: Metadata = {
  title: "Hospital Pharmaceutical Supplier Philippines – Oncology & ICU",
  description:
    "Trusted hospital pharmaceutical supplier for 500+ Philippine hospitals. FDA-licensed, cold-chain logistics, urgent ICU delivery nationwide.",
};

export default async function HospitalSupplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const therapeuticSupply = [
    {
      category: "Oncology",
      dept: "Cancer Centers, Outpatient Chemotherapy Units",
      focus: "Chemotherapy infusions, targeted oral therapies, supportive care injections",
    },
    {
      category: "Hematology",
      dept: "Bone Marrow Transplant & Hematology Units",
      focus: "Multiple myeloma therapies, leukemia regimens, lymphoma protocols",
    },
    {
      category: "Anesthesiology & Critical Care",
      dept: "Intensive Care Units (ICU), Operating Rooms (OR)",
      focus: "General anesthetics, neuromuscular blockers, ICU sedatives, emergency pressors",
    },
    {
      category: "Anti-Infectives",
      dept: "Infectious Disease Units, General Wards, ICU",
      focus: "Reserve broad-spectrum IV antibiotics, systemic antivirals, antifungals",
    },
    {
      category: "Cardiology",
      dept: "Cardiac Care Units (CCU), Emergency Department",
      focus: "IV anti-hypertensives, heart failure injections, anti-arrhythmics",
    },
    {
      category: "Endocrinology",
      dept: "Internal Medicine, Inpatient Wards",
      focus: "Specialized hormonal preparations, acute glycemic management",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Inquiry & Needs Assessment",
      desc: "Hospital procurement officers submit molecule requirements or tender specs via info@getmeds.ph.",
    },
    {
      num: "02",
      title: "Formulary & Dossier Review",
      desc: "Provision of FDA Certificate of Product Registration (CPR), Certificate of Analysis (COA), and sample lots for P&T committee evaluation.",
    },
    {
      num: "03",
      title: "Regulatory & Compliance Verification",
      desc: "Validation of FDA License to Operate (LTO), PDEA permits, and government assistance program accreditations.",
    },
    {
      num: "04",
      title: "Commercial Agreement",
      desc: "Finalization of transparent pricing, credit terms, and delivery schedules tailored to hospital requirements.",
    },
    {
      num: "05",
      title: "Cold-Chain Dispatch & Delivery",
      desc: "Verified temperature-monitored dispatch delivering directly to hospital pharmacy bays within 24–48 hours.",
    },
  ];

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              Hospital Supply Division • Philippines
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Premier Hospital Pharmaceutical Supplier in the Philippines
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Getmeds Philippines Inc. / 2MG Inc. is a trusted hospital pharmaceutical partner serving over <strong>500+ public, private, and LGU-operated hospitals</strong>. We specialize in fulfilling critical hospital formulary requirements for oncology, hematology, anesthesiology, ICU care, and anti-infectives across Luzon, Visayas, and Mindanao.
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
              <span className="text-3xl">❄️</span>
              <h2 className="mt-4 text-xl font-bold text-forest-950">WHO GSDP Cold-Chain</h2>
              <p className="mt-2 text-sm text-forest-950/70">
                Continuous 2°C to 8°C temperature-monitored storage and validated thermal packaging for sensitive biologics and chemotherapy.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
              <span className="text-3xl">⚡</span>
              <h2 className="mt-4 text-xl font-bold text-forest-950">Urgent 24–48hr Delivery</h2>
              <p className="mt-2 text-sm text-forest-950/70">
                Rapid-response emergency dispatch ensuring ICU and chemotherapy schedules operate without interruption nationwide.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
              <span className="text-3xl">🏛️</span>
              <h2 className="mt-4 text-xl font-bold text-forest-950">Government Tender Partner</h2>
              <p className="mt-2 text-sm text-forest-950/70">
                Proven track record in public hospital bidding, DOH medical centers, and LGU procurement programs.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
              <span className="text-3xl">🤝</span>
              <h2 className="mt-4 text-xl font-bold text-forest-950">Assistance Program Provider</h2>
              <p className="mt-2 text-sm text-forest-950/70">
                Accredited supplier for DSWD, PCSO, Office of the Vice President (OVP), and Office of the President (OP) patient grants.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-2">
              <span className="text-3xl">📋</span>
              <h2 className="mt-4 text-xl font-bold text-forest-950">Formulary & Account Management</h2>
              <p className="mt-2 text-sm text-forest-950/70">
                Dedicated hospital account managers assisting P&T committees, chief pharmacists, and medical directors with supply forecasting and dossier documentation.
              </p>
            </div>
          </div>

          {/* Hospital Supply Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Hospital Supply Portfolio by Therapeutic Category</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Therapeutic Category</th>
                    <th className="px-6 py-4 font-bold">Hospital Department Served</th>
                    <th className="px-6 py-4 font-bold">Key Medication Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {therapeuticSupply.map((row) => (
                    <tr key={row.category} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600">{row.category}</td>
                      <td className="px-6 py-4 font-medium">{row.dept}</td>
                      <td className="px-6 py-4 text-forest-950/80">{row.focus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step by Step Process */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-forest-950">Step-by-Step Hospital Partnership Process</h2>
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

          <GlobalCallout
            title="International Hospital Procurement Note"
            body="For hospital groups outside the Philippines seeking multi-country tenders or international hospital supply, our India LLP entity manages direct pharmaceutical exports across 54+ countries."
          />

          <div className="mt-12 text-center">
            <Link
              href="/corp/contact"
              className="inline-block rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
            >
              Contact Our Hospital Account Team →
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

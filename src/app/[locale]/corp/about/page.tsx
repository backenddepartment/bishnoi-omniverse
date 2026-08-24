import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import GlobalBanner from "@/components/corp/GlobalBanner";
import GlobalCallout from "@/components/corp/GlobalCallout";

export const metadata: Metadata = {
  title: "About Getmeds Philippines – Oncology & Global Pharma Network",
  description:
    "Getmeds Philippines is an FDA-licensed pharmaceutical corporation serving 2M+ Filipino patients. Part of the Bishnoi Omniverse with global reach via India LLP.",
};

export default async function AboutCorpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const metricsTable = [
    { label: "Hospitals Served", corp: "500+ Hospitals", llp: "Multi-country Hospital Networks" },
    { label: "Pharmacies Reached", corp: "10,000+ Retail & Clinical Outlets", llp: "Global Wholesale Channels" },
    { label: "Patient Impact", corp: "2 Million+ Filipino Lives Touched", llp: "Millions Worldwide" },
    { label: "Portfolio Scale", corp: "Specialized Local Oncology Portfolio", llp: "2,000+ Molecules Available" },
    { label: "Manufacturer Partners", corp: "50+ Global Manufacturing Partners", llp: "Sourced from US, Europe, India, China" },
    { label: "Geographic Reach", corp: "Luzon, Visayas, Mindanao", llp: "54+ Countries Served" },
  ];

  return (
    <>
      <GlobalBanner />

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              Corporate Overview • Bishnoi Omniverse
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Driven by Heritage, Committed to Saving Lives Across the Philippines and Worldwide
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Rooted in the 500-year Bishnoi legacy of discipline, environmental conservation, and service, Getmeds Philippines Inc. / 2MG Inc. connects global pharmaceutical innovations directly to Filipino patients, hospitals, and pharmacies.
            </p>
          </div>

          {/* Founder Section */}
          <div className="mt-16 rounded-2xl border border-forest-950/10 bg-white p-8 shadow-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4 text-center">
                <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-orange-500 text-4xl text-white font-black shadow-md">
                  NB
                </div>
                <h2 className="mt-4 text-2xl font-bold text-forest-950">Naresh Kumar Bishnoi</h2>
                <p className="text-sm font-semibold text-orange-600">Founder & Executive Leader</p>
                <p className="text-xs text-forest-950/60 mt-1">Oncology Medicine Supply Specialist</p>
                <p className="mt-2 inline-block rounded-full bg-cream-50 px-3 py-1 text-xs font-bold text-forest-950">
                  Member, ESMO (European Society for Medical Oncology)
                </p>
              </div>

              <div className="md:col-span-8 border-t border-forest-950/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <blockquote className="text-lg italic text-forest-950/90 leading-relaxed">
                  &ldquo;Our mission is simple yet non-negotiable: No cancer patient should ever be denied life-saving treatment due to supply shortages, prohibitive costs, or logistical barriers. Whether in Metro Manila or across 54 countries worldwide, we deliver medicine with uncompromised integrity.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-bold text-forest-950">— Naresh Kumar Bishnoi</p>
              </div>
            </div>
          </div>

          {/* Corporate Structure */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-center text-forest-950">Corporate Structure & Operating Units</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 border border-forest-950/10">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">CORP</span>
                <h3 className="mt-3 text-xl font-bold text-forest-950">Getmeds Philippines Inc. / 2MG Inc.</h3>
                <p className="text-xs text-forest-950/60 font-semibold mt-1">SEC-Registered Philippine Corporation</p>
                <ul className="mt-4 space-y-2 text-sm text-forest-950/80">
                  <li>• FDA License to Operate (LTO)</li>
                  <li>• PDEA Licensed (S-4 / S-5)</li>
                  <li>• Serves 500+ Philippine Hospitals</li>
                  <li>• Reaches 10,000+ Local Pharmacies</li>
                  <li>• URL: <code className="text-orange-600 font-bold">/corp</code></li>
                </ul>
              </div>

              <div className="rounded-xl bg-forest-950 p-6 text-white">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">LLP</span>
                <h3 className="mt-3 text-xl font-bold text-white">Getmeds Healthcare</h3>
                <p className="text-xs text-white/60 font-semibold mt-1">India-Based Global Sourcing & Export Hub</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  <li>• Serving 54+ Countries Worldwide</li>
                  <li>• 2,000+ Molecule Portfolio</li>
                  <li>• Audited WHO-GMP / US FDA Sources</li>
                  <li>• Direct Global Wholesale Export</li>
                  <li>• Global Export Hub (Mumbai, Maharashtra, India)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Licenses & Accreditations */}
          <div className="mt-16 rounded-2xl bg-white p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-forest-950">Philippine Licenses & Accreditations</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-cream-50 p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">FDA Philippines LTO</h3>
                <p className="mt-1 text-xs text-forest-950/70">Certified License to Operate for pharmaceutical importation and nationwide distribution.</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">PDEA Licensed (S-4 / S-5)</h3>
                <p className="mt-1 text-xs text-forest-950/70">Authorized handler for dangerous drugs and precursor chemicals.</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-4 border border-forest-950/10">
                <h3 className="font-bold text-forest-950">BOC & SEC Registration</h3>
                <p className="mt-1 text-xs text-forest-950/70">Bureau of Customs compliant with full SEC corporate registration.</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-4 border border-forest-950/10 sm:col-span-2 lg:col-span-3">
                <h3 className="font-bold text-forest-950">Accredited Supplier for Public Assistance Programs</h3>
                <p className="mt-1 text-xs text-forest-950/70">Official supplier for DSWD, PCSO, Office of the Vice President (OVP), and Office of the President (OP) medical assistance programs.</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Key Operational Scale</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Metric Highlight</th>
                    <th className="px-6 py-4 font-bold">Philippines Scope</th>
                    <th className="px-6 py-4 font-bold">Global Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {metricsTable.map((m) => (
                    <tr key={m.label} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600">{m.label}</td>
                      <td className="px-6 py-4 font-medium">{m.corp}</td>
                      <td className="px-6 py-4 text-forest-950/80">{m.llp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Our Mission</h2>
              <p className="mt-4 text-base text-forest-950/80 leading-relaxed">
                To safeguard human life by delivering affordable, FDA-approved, and cold-chain compliant oncology and critical care pharmaceuticals across every province of the Philippines and to international partners worldwide.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Our Vision</h2>
              <p className="mt-4 text-base text-forest-950/80 leading-relaxed">
                To be the most trusted, ethically driven pharmaceutical supply bridge connecting world-class manufacturer innovations with healthcare providers, government programs, and patients across the globe.
              </p>
            </div>
          </div>

          <GlobalCallout />
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

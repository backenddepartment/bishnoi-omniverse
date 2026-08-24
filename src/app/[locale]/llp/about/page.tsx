import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "About Getmeds Healthcare India – Global Oncology Exporter",
  description:
    "Getmeds Healthcare India is the global export hub of the Bishnoi Omniverse. Serving 54+ countries with oncology and specialty medicines.",
};

export default async function AboutLlpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const metricsTable = [
    { label: "Countries Served", llp: "54+ Countries", corp: "Philippines (Archipelago-wide)" },
    { label: "Active Portfolio", llp: "2,000+ Molecules Available", corp: "Specialized Local Oncology Portfolio" },
    { label: "Patients Impacted", llp: "22,666+ Patients Helped Globally", corp: "2 Million+ Filipino Lives Touched" },
    { label: "Network Scale", llp: "226+ Partner Clinics Worldwide", corp: "500+ Hospitals Served Nationwide" },
    { label: "Manufacturer Partners", llp: "50+ Global Manufacturing Partners", corp: "Sourced from US, Europe, India, China" },
  ];

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-forest-950/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest-950">
              Corporate Profile • Getmeds Healthcare India
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              About Getmeds Healthcare India — The Global Export Hub of the Bishnoi Omniverse
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Rooted in the 500-year Bishnoi legacy of discipline, environmental stewardship, and selfless service, Getmeds Healthcare (India LLP) serves as the global sourcing, export, and wholesale arm of the Bishnoi Omniverse.
            </p>
          </div>

          {/* Founder Section */}
          <div className="mt-16 rounded-2xl border border-forest-950/10 bg-white p-8 shadow-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4 text-center">
                <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-forest-950 text-4xl text-white font-black shadow-md">
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
                  &ldquo;Access to quality oncology medicine is a fundamental human right. Through our India LLP export hub and global partnerships, we bridge the gap between world-class manufacturing and patients across 54+ countries.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-bold text-forest-950">— Naresh Kumar Bishnoi</p>
              </div>
            </div>
          </div>

          {/* Corporate Structure */}
          <div className="mt-16 rounded-2xl bg-forest-950 text-white p-8 border border-forest-950/10">
            <h2 className="text-2xl font-bold text-center text-white">Structure of the Bishnoi Omniverse</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-6 border border-white/10">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">INDIA LLP</span>
                <h3 className="mt-3 text-xl font-bold text-white">Getmeds Healthcare (India LLP)</h3>
                <p className="text-xs text-white/60 font-semibold mt-1">Global Sourcing & Export Operations (Mumbai, Maharashtra, India)</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  <li>• Serving 54+ Countries Worldwide</li>
                  <li>• 2,000+ Active Molecule Portfolio</li>
                  <li>• 22,666+ Patients Helped Globally</li>
                  <li>• 226+ Partner Clinics Worldwide</li>
                  <li>• URL: <code className="text-orange-400 font-bold">/llp</code></li>
                </ul>
              </div>

              <div className="rounded-xl bg-white p-6 text-forest-950">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">PHILIPPINES CORP</span>
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
            </div>
          </div>

          {/* Operational Metrics Table */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-lg">
            <div className="bg-forest-950 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Global vs Philippine Operational Scale</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-forest-950">
                <thead className="bg-cream-50 text-xs uppercase text-forest-950/70 border-b border-forest-950/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Metric Highlight</th>
                    <th className="px-6 py-4 font-bold">Global Scope</th>
                    <th className="px-6 py-4 font-bold">Philippines Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-950/10">
                  {metricsTable.map((m) => (
                    <tr key={m.label} className="hover:bg-cream-50/50">
                      <td className="px-6 py-4 font-bold text-orange-600">{m.label}</td>
                      <td className="px-6 py-4 font-medium">{m.llp}</td>
                      <td className="px-6 py-4 text-forest-950/80">{m.corp}</td>
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
                To provide seamless global access to affordable, WHO-GMP certified oncology and specialty pharmaceuticals — leveraging our India export hub to serve healthcare networks across 54+ countries.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-white p-8">
              <h2 className="text-2xl font-bold text-forest-950">Our Vision</h2>
              <p className="mt-4 text-base text-forest-950/80 leading-relaxed">
                A world where geographical borders no longer restrict access to life-saving medicines, and every healthcare provider has a reliable supply bridge to essential therapies.
              </p>
            </div>
          </div>

          {/* PH Callout */}
          <div className="mt-16 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
            <h3 className="text-xl font-bold text-forest-950">Looking for Philippine Local Operations?</h3>
            <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
              Learn more about our SEC-registered Philippine operating entity (<strong>Getmeds Philippines Inc. / 2MG Inc.</strong>), serving 500+ local hospitals across the archipelago.
            </p>
            <div className="mt-4">
              <Link href="/corp/about" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                Visit Philippines About Us Page →
              </Link>
            </div>
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

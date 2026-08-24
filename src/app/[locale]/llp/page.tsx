import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getLlpPageData, getCommonData } from "@/lib/data/getOmniverseData";
import { LlpJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageData = getLlpPageData("home", locale);
  return {
    title: pageData?.metaTitle || "Getmeds Healthcare India – Global Oncology Exporter",
    description:
      pageData?.metaDescription ||
      "Global pharmaceutical export hub serving 54+ countries. Oncology, hematology, and specialty medicines sourced from WHO-GMP certified facilities.",
  };
}

export default async function LlpHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageData = getLlpPageData("home", locale);
  const isHindi = locale === "hi-IN" || locale === "hi";

  const metrics = [
    { number: "54+", label: isHindi ? "दुनिया भर में सेवा प्रदान किए गए देश" : "Countries Served Worldwide", scope: isHindi ? "वैश्विक पहुंच" : "Global Reach" },
    { number: "2,000+", label: isHindi ? "निर्यात सूची में सक्रिय अणु" : "Active Molecules in Export Portfolio", scope: isHindi ? "विशेष पोर्टफोलियो" : "Specialty Portfolio" },
    { number: "50+", label: isHindi ? "निर्माता साझेदारियां" : "Manufacturer Partnerships", scope: "US, EU, IN, CN" },
    { number: "22,666+", label: isHindi ? "दुनिया भर में मदद प्राप्त रोगी" : "Patients Helped Globally", scope: isHindi ? "अंतर्राष्ट्रीय प्रभाव" : "International Impact" },
    { number: "226+", label: isHindi ? "दुनिया भर में सहयोगी क्लीनिक" : "Partner Clinics Worldwide", scope: isHindi ? "वैश्विक नेटवर्क" : "Global Network" },
    { number: "5", label: isHindi ? "मान्यता प्राप्त गुणवत्ता मानक" : "Quality Certifications Recognized", scope: "WHO, PIC/S, FDA, MHRA" },
  ];

  const therapeuticAreas = [
    { title: isHindi ? "ऑन्कोलॉजी" : "Oncology", desc: isHindi ? "स्तन, फेफड़े, प्रोस्टेट, अंडाशय, कोलोरेक्टल, अग्न्याशय, मूत्राशय और गर्भाशय ग्रीवा के कैंसर के लिए कीमोथेरेपी और लक्षित चिकित्सा।" : "Chemotherapy & targeted therapies for breast, lung, prostate, ovarian, colorectal, pancreatic, bladder, and cervical cancers.", icon: "🎗️" },
    { title: isHindi ? "हेमेटोलॉजी" : "Hematology", desc: isHindi ? "ल्यूकेमिया, लिंफोमा, मल्टीपल मायलोमा और सिकल सेल एनीमिया के लिए विशेष आहार।" : "Specialized regimens for Leukemia, Lymphoma, Multiple Myeloma, and Sickle Cell Anemia.", icon: "🩸" },
    { title: isHindi ? "एंनेस्थिसियोलॉजी और क्रिटिकल केयर" : "Anesthesiology & Critical Care", desc: isHindi ? "आपातकालीन आईसीयू दवाएं, सामान्य संवेदनाहारी और न्यूरोमस्कुलर शामक।" : "Emergency ICU medications, general anesthetics, and neuromuscular sedatives.", icon: "🏥" },
    { title: isHindi ? "एंटी-इन्फेक्टिव्स" : "Anti-Infectives", desc: isHindi ? "आरक्षित व्यापक स्पेक्ट्रम आईवी एंटीबायोटिक्स, एंटीवायरल और प्रणालीगत एंटीफंगल।" : "Reserve broad-spectrum IV antibiotics, antivirals, and systemic antifungals.", icon: "🛡️" },
    { title: isHindi ? "कार्डियोलॉजी" : "Cardiology", desc: isHindi ? "उच्च रक्तचाप, दिल की विफलता और अतालता के लिए आवश्यक चिकित्सीय प्रबंधन।" : "Essential therapeutic management for hypertension, heart failure, and arrhythmias.", icon: "🫀" },
    { title: isHindi ? "एंडोक्रिनोलॉजी" : "Endocrinology", desc: isHindi ? "मधुमेह प्रबंधन समाधान और विशेष हार्मोनल उपचार।" : "Diabetes management solutions and specialized hormonal therapies.", icon: "⚖️" },
    { title: isHindi ? "दुर्लभ रोग" : "Rare Diseases", desc: isHindi ? "अति-दुर्लभ परिस्थितियों वाले रोगियों के लिए करुणामय पहुँच कार्यक्रम।" : "Compassionate access programs for patients with ultra-rare conditions.", icon: "🧬" },
  ];

  return (
    <>
      <LlpJsonLd />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 px-6 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
                {isHindi
                  ? "बिश्नोई ओम्निवर्स • भारत वैश्विक निर्यात (India LLP)"
                  : "Bishnoi Omniverse • Global Export Hub (India LLP)"}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {pageData?.h1}
              </h1>
              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                {pageData?.content}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {pageData?.ctas.map((cta, index) => (
                  <Link
                    key={cta.text}
                    href={cta.url}
                    className={`rounded-xl px-6 py-3.5 text-base font-bold transition-colors ${
                      index === 0
                        ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                        : index === 1
                        ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                        : "bg-white text-forest-950 hover:bg-cream-50"
                    }`}
                  >
                    {cta.text}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-2xl">
                <h2 className="text-xl font-bold text-white">Global Footprint & Metrics</h2>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-xl bg-white/10 p-4 border border-white/10">
                      <p className="text-2xl font-extrabold text-orange-400">{m.number}</p>
                      <p className="mt-1 text-xs font-semibold uppercase text-white/60">{m.scope}</p>
                      <p className="mt-1 text-xs text-white/80">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Persona Guidance Bar */}
      <section className="bg-cream-50/60 py-12 px-6 border-y border-forest-950/10 text-forest-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 text-center">
            {isHindi ? getCommonData().pathways.hiTag : getCommonData().pathways.tag}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-center text-forest-950 sm:text-3xl">
            {isHindi ? getCommonData().pathways.hiTitle : getCommonData().pathways.title}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCommonData().pathways.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-forest-950">
                  {isHindi ? card.hiTitle : card.title}
                </h3>
                <p className="mt-2 text-xs text-forest-950/70 leading-relaxed">
                  {isHindi ? card.hiDesc : card.desc}
                </p>
                <Link href={card.href} className="mt-4 inline-block text-xs font-bold text-orange-600 hover:underline">
                  {isHindi ? card.hiLinkText : card.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing & Supply Chain Overview */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-950 sm:text-4xl">
              The Global Export Gateway of Bishnoi Omniverse
            </h2>
            <p className="mt-4 text-base text-forest-950/70">
              Operating from Mumbai, Maharashtra, India, Getmeds Healthcare LLP connects certified pharmaceutical manufacturing hubs with healthcare systems worldwide.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 bg-forest-950 text-white p-8">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">INDIA LLP</span>
              <h3 className="mt-3 text-2xl font-bold text-white">Getmeds Healthcare (India)</h3>
              <p className="text-xs text-white/60 mt-1">Global Sourcing & Export Operations (Mumbai, Maharashtra, India)</p>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">
                Manages direct international sourcing from 50+ manufacturers across India, China, Europe, and the US. Dispatches priority cold-chain freight and export documentation to 54+ countries worldwide.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>✓ 54+ Countries Served</li>
                <li>✓ 2,000+ Active Molecule Portfolio</li>
                <li>✓ 22,666+ Patients Helped Globally</li>
                <li>✓ 226+ Partner Clinics Worldwide</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-950/10 bg-cream-50 p-8">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">PHILIPPINES CORP</span>
              <h3 className="mt-3 text-2xl font-bold text-forest-950">Getmeds Philippines Inc. / 2MG Inc.</h3>
              <p className="text-xs text-forest-950/60 mt-1">Philippine Importer, Distributor & Hospital Supplier</p>
              <p className="mt-4 text-sm text-forest-950/80 leading-relaxed">
                Our local operating arm serving the Philippine healthcare market with FDA Philippines LTO clearance, PDEA permits, and distribution to 500+ hospitals and 10,000+ local pharmacies.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-forest-950/70">
                <li>✓ 500+ Philippine Hospitals Served</li>
                <li>✓ FDA LTO & PDEA S-4/S-5 Licensed</li>
                <li>✓ Accredited Supplier for DSWD, PCSO, OVP, OP</li>
              </ul>
              <div className="mt-6">
                <Link href="/corp" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                  Visit Philippines Operations Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Portfolio Categories */}
      <section className="bg-cream-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-950 sm:text-4xl">
              Global Export Therapeutic Disciplines
            </h2>
            <p className="mt-4 text-base text-forest-950/70">
              Exporting 2,000+ molecules sourced from audited WHO, PIC/S, US FDA, EU MHRA, and UK MHRA recognized manufacturing facilities.
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
            Why Global Partners Choose Getmeds Healthcare
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-forest-950">1. Quality Assurance</h3>
              <p className="mt-2 text-sm text-forest-950/70">
                Sourced strictly from facilities certified under WHO-GMP, US FDA, EU MHRA, UK MHRA, and PIC/S standards. Multi-stage batch verification before export.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-forest-950">2. Cold-Chain Freight</h3>
              <p className="mt-2 text-sm text-forest-950/70">
                WHO GSDP-compliant temperature control (2°C to 8°C) with priority air freight and batch-level thermal logging.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-forest-950">3. 2,000+ Active Molecules</h3>
              <p className="mt-2 text-sm text-forest-950/70">
                Comprehensive specialty portfolio spanning oncology, hematology, ICU care, anti-infectives, and rare diseases.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-950/10 p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-forest-950">4. 50+ Direct Manufacturer Links</h3>
              <p className="mt-2 text-sm text-forest-950/70">
                Long-standing partnerships with certified manufacturers in India, China, Europe, and US for volume security and competitive pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-forest-950 px-6 py-6 text-center text-xs text-cream-50">
        🇵🇭 For pharmaceutical distribution within the Philippines, visit our{" "}
        <Link href="/corp" className="underline hover:text-orange-400 font-semibold">
          Philippines Operations
        </Link>
        .
      </footer>
    </>
  );
}

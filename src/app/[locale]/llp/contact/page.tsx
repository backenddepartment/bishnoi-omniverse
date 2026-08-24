import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import LlpBanner from "@/components/llp/LlpBanner";
import LlpContactForm from "@/components/llp/LlpContactForm";

export const metadata: Metadata = {
  title: "Contact Getmeds Healthcare India – Global Export Inquiries",
  description:
    "Contact us for global oncology export, international distribution partnerships, or sourcing inquiries. We reply within one business day.",
};

export default async function ContactLlpPage({
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
              Getmeds Healthcare (India LLP)
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Contact Us — Global Export Inquiries Welcome
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Whether you are an international pharmaceutical distributor seeking a sourcing partner, a hospital administrator procuring specialty oncology regimens, or a manufacturer exploring global export channels, our team responds within <strong>one business day</strong>.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <LlpContactForm />
            </div>

            {/* Direct Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Global Export Hub Location</h2>
                <p className="mt-4 text-sm font-semibold text-orange-600">Getmeds Healthcare (India LLP)</p>
                <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
                  Mumbai, Maharashtra, India.
                </p>
              </div>

              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Global Direct Channels</h2>
                <div className="mt-4 space-y-4 text-sm text-forest-950/80">
                  <div>
                    <span className="block text-xs font-bold uppercase text-forest-950/50">Global Export Email</span>
                    <a href="mailto:care2@getmeds.in" className="font-bold text-forest-950 hover:text-orange-600">
                      care2@getmeds.in
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase text-forest-950/50">Global Contact Center Phone</span>
                    <a href="tel:+919190769100" className="font-bold text-forest-950 hover:text-orange-600">
                      +91 91907 69100
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Business Hours</h2>
                <p className="mt-3 text-sm text-forest-950/80">
                  <strong>Office Hours:</strong> Monday to Friday: 9:00 AM – 6:00 PM (IST)
                </p>
                <p className="mt-2 text-sm text-forest-950/80">
                  <strong>Priority Dispatch:</strong> Expedited Export Processing & Cold-Chain Shipping Coordination
                </p>
              </div>

              {/* Philippine Contact Section */}
              <div className="rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
                <h2 className="text-xl font-bold text-forest-950">Contacting Philippines Operations?</h2>
                <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
                  If you are a Philippine hospital, LGU, local distributor, or patient, please contact our Philippine team:
                </p>
                <p className="mt-3 text-sm font-bold text-orange-600">
                  General / Sales: <a href="mailto:info@getmeds.ph" className="underline">info@getmeds.ph</a>
                </p>
                <p className="mt-1 text-sm font-bold text-orange-600">
                  B2B / Distributors: <a href="mailto:sales5@2mginc.com" className="underline">sales5@2mginc.com</a>
                </p>
                <div className="mt-4">
                  <Link href="/corp/contact" className="inline-block text-xs font-bold uppercase text-orange-600 hover:underline">
                    Visit Philippines Contact Page →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Directory */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-xl font-bold text-forest-950">Quick Page Directory</h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-orange-600">
              <Link href="/llp" className="hover:underline">Global Export Home</Link>
              <span>•</span>
              <Link href="/llp/oncology-export-portfolio" className="hover:underline">Oncology Export Portfolio</Link>
              <span>•</span>
              <Link href="/llp/global-partnerships" className="hover:underline">Global Partnerships</Link>
              <span>•</span>
              <Link href="/llp/sourcing-supply-chain" className="hover:underline">Sourcing & Supply Chain</Link>
              <span>•</span>
              <Link href="/llp/about" className="hover:underline">About Getmeds Healthcare India</Link>
              <span>•</span>
              <Link href="/corp" className="hover:underline text-forest-950">Philippines CORP Operations</Link>
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

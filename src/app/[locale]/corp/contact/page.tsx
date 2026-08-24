import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import CorpContactForm from "@/components/corp/CorpContactForm";

export const metadata: Metadata = {
  title: "Contact Getmeds Philippines – Oncology & Hospital Supply",
  description:
    "Contact us for oncology medicines, hospital supply, or government partnerships in the Philippines. For global export inquiries, visit our India LLP hub.",
};

export default async function ContactCorpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>

      <section className="bg-gradient-to-b from-cream-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              Getmeds Philippines Inc. / 2MG Inc.
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-forest-950 sm:text-5xl">
              Contact Getmeds Philippines & Global Operations
            </h1>
            <p className="mt-6 text-lg text-forest-950/80 leading-relaxed">
              Whether you are a hospital procurement officer seeking urgent oncology supplies, a government agency preparing tender specs, or an international distributor requesting export details, our team responds within <strong>one business day</strong>.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <CorpContactForm />
            </div>

            {/* Direct Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Registered Office Address</h2>
                <p className="mt-4 text-sm font-semibold text-orange-600">Getmeds Philippines Inc. / 2MG Inc.</p>
                <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
                  Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon II, Las Piñas City, Metro Manila, Philippines.
                </p>
              </div>

              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Direct Contact Channels</h2>
                <div className="mt-4 space-y-4 text-sm text-forest-950/80">
                  <div>
                    <span className="block text-xs font-bold uppercase text-forest-950/50">Phone / Mobile</span>
                    <a href="tel:+639171569029" className="font-bold text-forest-950 hover:text-orange-600">
                      +63 917 156 9029
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase text-forest-950/50">General / Sales Email</span>
                    <a href="mailto:info@getmeds.ph" className="font-bold text-forest-950 hover:text-orange-600">
                      info@getmeds.ph
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase text-forest-950/50">B2B / Distributors / Manufacturers</span>
                    <a href="mailto:sales5@2mginc.com" className="font-bold text-forest-950 hover:text-orange-600">
                      sales5@2mginc.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-forest-950/10 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-950">Business Hours & Logistics</h2>
                <p className="mt-3 text-sm text-forest-950/80">
                  <strong>Office Hours:</strong> Monday to Saturday: 8:00 AM – 6:00 PM (PHT)
                </p>
                <p className="mt-2 text-sm text-forest-950/80">
                  <strong>Hospital Emergency Dispatch:</strong> 24/7 Rapid Cold-Chain Response for Critical Hospital Orders
                </p>
              </div>

              {/* Global Export Section */}
              <div className="rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-8">
                <h2 className="text-xl font-bold text-forest-950">Global Export Inquiries</h2>
                <p className="mt-2 text-sm text-forest-950/80 leading-relaxed">
                  For international distributors, hospitals, and buyers outside the Philippines, please direct your oncology product inquiries to our global export team (India LLP):
                </p>
                <p className="mt-3 text-sm font-bold text-orange-600">
                  Email: <a href="mailto:care2@getmeds.in" className="underline">care2@getmeds.in</a>
                </p>
                <div className="mt-4">
                  <Link href="/llp" className="inline-block text-xs font-bold uppercase text-forest-950 underline hover:text-orange-600">
                    Visit Global Export Hub →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Directory */}
          <div className="mt-16 rounded-2xl bg-cream-50 p-8 border border-forest-950/10">
            <h2 className="text-xl font-bold text-forest-950">Quick Page Directory</h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-orange-600">
              <Link href="/corp" className="hover:underline">Home Page</Link>
              <span>•</span>
              <Link href="/corp/oncology-medicines" className="hover:underline">Oncology Portfolio</Link>
              <span>•</span>
              <Link href="/corp/hospital-supply" className="hover:underline">Hospital Supply</Link>
              <span>•</span>
              <Link href="/corp/partnerships" className="hover:underline">Partnerships</Link>
              <span>•</span>
              <Link href="/corp/about" className="hover:underline">About Us</Link>
              <span>•</span>
              <Link href="/llp" className="hover:underline text-forest-950">Global Export Hub</Link>
            </div>
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

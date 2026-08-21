import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.metadata" });
  return { title: t("title"), description: t("description") };
}

interface ContactEntry {
  title: string;
  description: string;
  email: string;
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const contacts = t.raw("contact.contacts") as ContactEntry[];

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">
            {t("contact.hero.title")}
          </h1>
          <p className="mt-6 text-lg text-forest-950/70">{t("contact.hero.body")}</p>
        </div>
      </section>

      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.title}
                className="rounded-xl border border-forest-950/10 bg-white p-6"
              >
                <h2 className="text-lg font-semibold text-forest-950">{contact.title}</h2>
                <p className="mt-2 text-sm text-forest-950/70">{contact.description}</p>
                <p className="mt-3 text-sm font-medium italic text-forest-950/50">
                  {contact.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function ClosingCta() {
  const t = useTranslations("home.closingCta");

  return (
    <section className="bg-forest-950 px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white">{t("title")}</h2>
        <p className="mt-6 text-lg text-white/70">{t("body")}</p>
        <p className="mt-10 text-xl font-bold text-white">{t("brand")}</p>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-gold-400">
          {t("tagline")}
        </p>
        <Link
          href="/contact"
          className="mt-10 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

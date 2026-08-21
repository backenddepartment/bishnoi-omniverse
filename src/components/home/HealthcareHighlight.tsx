import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function HealthcareHighlight() {
  const t = useTranslations("home.healthcareHighlight");

  return (
    <section className="bg-cream-50 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-forest-950">{t("title")}</h2>
        <p className="mt-6 text-lg text-forest-950/70">{t("body1")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body2")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body3")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body4")}</p>
        <Link
          href="/healthcare"
          className="mt-10 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

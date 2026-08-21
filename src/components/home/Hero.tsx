import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-forest-950 sm:text-5xl">{t("title")}</h1>
        <p className="mt-6 text-lg text-forest-950/70">{t("body1")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body2")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ecosystem"
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
          >
            {t("primaryCta")}
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-forest-950/20 px-6 py-3 text-sm font-semibold text-forest-950 hover:bg-forest-950/5"
          >
            {t("secondaryCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

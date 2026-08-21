import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function LeadershipTeaser() {
  const t = useTranslations("home.leadershipTeaser");

  return (
    <section className="bg-forest-950 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white">{t("title")}</h2>
        <p className="mt-6 text-lg text-white/70">{t("body1")}</p>
        <p className="mt-4 text-lg text-white/70">{t("body2")}</p>
        <p className="mt-8 text-2xl font-semibold italic text-gold-400">
          &ldquo;{t("quote")}&rdquo;
        </p>
        <Link
          href="/leadership"
          className="mt-10 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

import { useTranslations } from "next-intl";

export default function Introduction() {
  const t = useTranslations("home.introduction");

  return (
    <section className="bg-cream-50 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-forest-950">{t("title")}</h2>
        <p className="mt-6 text-lg text-forest-950/70">{t("body1")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body2")}</p>
      </div>
    </section>
  );
}

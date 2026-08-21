import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function GlobalPresence() {
  const t = useTranslations("home.globalPresence");
  const connections = t.raw("connections") as string[];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-forest-950">{t("title")}</h2>
        <p className="mt-6 text-lg text-forest-950/70">{t("body1")}</p>
        <p className="mt-4 text-lg text-forest-950/70">{t("body2")}</p>
        <p className="mt-4 text-lg font-medium text-forest-950">{t("body3")}</p>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {connections.map((item) => (
            <li key={item} className="text-lg font-semibold text-green-600">
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/global-presence"
          className="mt-10 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500/90"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

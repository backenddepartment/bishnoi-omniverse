import { useTranslations } from "next-intl";

interface Venture {
  name: string;
  category: string;
  description: string;
}

export default function EcosystemSnapshot() {
  const t = useTranslations("home.ecosystemSnapshot");
  const ventures = t.raw("ventures") as Venture[];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-forest-950">{t("title")}</h2>
          <p className="mt-6 text-lg text-forest-950/70">{t("body")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ventures.map((venture) => (
            <div key={venture.name} className="rounded-xl border border-forest-950/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                {venture.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-forest-950">{venture.name}</h3>
              <p className="mt-2 text-sm text-forest-950/70">{venture.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

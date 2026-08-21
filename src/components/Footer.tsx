import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function Footer() {
  const t = useTranslations();

  const navigationLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.ourEcosystem"), href: "/ecosystem" },
    { label: t("nav.healthcare"), href: "/healthcare" },
    { label: t("nav.globalPresence"), href: "/global-presence" },
    { label: t("nav.leadership"), href: "/leadership" },
    { label: t("nav.sustainabilityImpact"), href: "/sustainability-impact" },
    { label: t("nav.newsInsights"), href: "/news-insights" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const ecosystemLinks = [
    t("footer.ecosystemLinks.getmedsPhilippines"),
    t("footer.ecosystemLinks.getmedsHealthcare"),
    t("footer.ecosystemLinks.bishnoiOmniverseIndia"),
    t("footer.ecosystemLinks.bishnoiOmniversePhilippines"),
    t("footer.ecosystemLinks.getmedsVanuatu"),
    t("footer.ecosystemLinks.getmedsSoutheastAsia"),
    t("footer.ecosystemLinks.getmedsLatin"),
    t("footer.ecosystemLinks.nareshBishnoiFoundation"),
  ];

  return (
    <footer className="w-full border-t border-forest-950/10 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-orange-500">
                <svg viewBox="0 0 24 24" className="size-4" fill="white">
                  <rect x="4" y="4" width="6" height="6" />
                  <rect x="14" y="4" width="6" height="6" />
                  <rect x="4" y="14" width="6" height="6" />
                  <rect x="14" y="14" width="6" height="6" />
                </svg>
              </span>
              <span className="text-lg font-bold text-forest-950">Bishnoi Omniverse</span>
            </Link>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-gold-400">
              {t("footer.tagline")}
            </p>
            <p className="mt-3 text-sm text-forest-950/70">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-forest-950">{t("footer.navigation")}</h3>
            <ul className="mt-4 space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-forest-950/70 hover:text-forest-950">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-forest-950">{t("footer.ecosystem")}</h3>
            <ul className="mt-4 space-y-2">
              {ecosystemLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-forest-950/70 hover:text-forest-950">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-forest-950/10 pt-8">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-forest-950">
            {t("footer.disclosureTitle")}
          </h4>
          <p className="mt-2 max-w-3xl text-sm text-forest-950/60">{t("footer.disclosureText")}</p>
        </div>

        <p className="mt-8 text-sm text-forest-950/60">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}

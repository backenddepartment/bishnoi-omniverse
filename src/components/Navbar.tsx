"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import NavDropdown from "@/components/NavDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ACTIVE_LINK_CLASSES =
  "inline-flex items-center border-b-2 border-orange-500 pb-1 text-sm font-medium text-orange-500";
const LINK_CLASSES =
  "inline-flex items-center border-b-2 border-transparent pb-1 text-sm font-medium text-forest-950/70 hover:text-forest-950";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const aboutItems = [
    { label: t("about"), href: "/about" },
    { label: t("leadership"), href: "/leadership" },
    { label: t("sustainabilityImpact"), href: "/sustainability-impact" },
  ];
  const ecosystemItems = [
    { label: t("ourEcosystem"), href: "/ecosystem" },
    { label: t("healthcare"), href: "/healthcare" },
    { label: t("globalPresence"), href: "/global-presence" },
  ];

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
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

        <nav>
          <ul className="flex flex-wrap items-center gap-6">
            <li>
              <Link href="/" className={pathname === "/" ? ACTIVE_LINK_CLASSES : LINK_CLASSES}>
                {t("home")}
              </Link>
            </li>
            <li>
              <NavDropdown label={t("aboutGroup")} items={aboutItems} />
            </li>
            <li>
              <NavDropdown label={t("ecosystemGroup")} items={ecosystemItems} />
            </li>
            <li>
              <Link
                href="/news-insights"
                className={pathname === "/news-insights" ? ACTIVE_LINK_CLASSES : LINK_CLASSES}
              >
                {t("newsInsights")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? ACTIVE_LINK_CLASSES : LINK_CLASSES}
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}

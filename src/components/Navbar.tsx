"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getHeaderData } from "@/lib/data/getOmniverseData";

const ACTIVE_LINK_CLASSES =
  "inline-flex items-center border-b-2 border-orange-500 pb-1 text-sm font-semibold text-orange-500";
const LINK_CLASSES =
  "inline-flex items-center border-b-2 border-transparent pb-1 text-sm font-medium text-forest-950/70 hover:text-forest-950 transition-colors";

export default function Navbar() {
  const pathname = usePathname();
  const headerData = getHeaderData();

  const isCorp = pathname.startsWith("/corp");
  const isLlp = pathname.startsWith("/llp");

  const corpNavLinks = headerData.corpNavLinks;
  const llpNavLinks = headerData.llpNavLinks;

  return (
    <header className="w-full bg-white border-b border-forest-950/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        {/* Logo & Entity Context Badge */}
        <Link href={isCorp ? "/corp" : isLlp ? "/llp" : "/corp"} className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
            <svg viewBox="0 0 24 24" className="size-4" fill="white">
              <rect x="4" y="4" width="6" height="6" />
              <rect x="14" y="4" width="6" height="6" />
              <rect x="4" y="14" width="6" height="6" />
              <rect x="14" y="14" width="6" height="6" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-forest-950 leading-none">{headerData.brandName}</span>
            {isCorp && (
              <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                {headerData.corpBadge}
              </span>
            )}
            {isLlp && (
              <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider text-forest-950">
                {headerData.llpBadge}
              </span>
            )}
          </div>
        </Link>

        {/* Dynamic Context-Aware Navigation Menu */}
        <nav>
          <ul className="flex flex-wrap items-center gap-6">
            {isLlp
              ? llpNavLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link href={link.href} className={active ? ACTIVE_LINK_CLASSES : LINK_CLASSES}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })
              : corpNavLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link href={link.href} className={active ? ACTIVE_LINK_CLASSES : LINK_CLASSES}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </nav>

        {/* Language Switcher */}
        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

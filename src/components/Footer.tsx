"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { getFooterData } from "@/lib/data/getOmniverseData";

export default function Footer() {
  const footerData = getFooterData();
  const pathname = usePathname();
  const showCorp = !pathname.startsWith("/llp");
  const showLlp = !pathname.startsWith("/corp");

  return (
    <footer className="w-full border-t border-forest-950/10 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div
          className={`grid grid-cols-1 gap-10 ${
            showCorp && showLlp ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
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
              <span className="text-lg font-bold text-forest-950">{footerData.brandName}</span>
            </Link>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-gold-400">
              {footerData.tagline}
            </p>
            <p className="mt-3 text-sm text-forest-950/70">{footerData.legacy}</p>
          </div>

          {showCorp && (
            <div>
              <h3 className="text-sm font-semibold text-forest-950">{footerData.corpSection.title}</h3>
              <p className="mt-2 text-xs font-bold text-orange-600">{footerData.corpSection.companyName}</p>
              <p className="mt-1 text-xs text-forest-950/70 leading-relaxed">{footerData.corpSection.address}</p>
              <ul className="mt-4 space-y-2">
                {footerData.corpSection.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-forest-950/70 hover:text-forest-950">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showLlp && (
            <div>
              <h3 className="text-sm font-semibold text-forest-950">{footerData.llpSection.title}</h3>
              <p className="mt-2 text-xs font-bold text-forest-950">{footerData.llpSection.companyName}</p>
              <p className="mt-1 text-xs text-forest-950/70 leading-relaxed">{footerData.llpSection.address}</p>
              <ul className="mt-4 space-y-2">
                {footerData.llpSection.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-forest-950/70 hover:text-forest-950">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-forest-950/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-950/60">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

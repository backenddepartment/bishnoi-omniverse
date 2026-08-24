"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/config";
import { localeMeta } from "@/lib/i18n/config";

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="radiogroup"
      aria-label={t("language")}
      className="inline-flex items-center rounded-full border border-forest-950/15 p-0.5 text-sm bg-white shadow-sm"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => router.replace(pathname, { locale: code })}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              active
                ? "bg-forest-950 text-white"
                : "text-forest-950/70 hover:text-forest-950"
            }`}
          >
            {localeMeta[code].nativeLabel}
          </button>
        );
      })}
    </div>
  );
}

import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { getCommonData } from "@/lib/data/getOmniverseData";

export default function GlobalBanner() {
  const common = getCommonData();
  const banner = common.globalBanner;

  return (
    <div className="w-full bg-forest-950 py-2.5 px-4 text-center text-xs sm:text-sm text-cream-50 font-medium">
      <span className="mr-2 font-bold uppercase tracking-wider text-orange-400">[{banner.badge}]</span>
      <span>{banner.text}</span>{" "}
      <Link href="/llp" className="underline hover:text-orange-400 font-semibold ml-1">
        Learn More →
      </Link>
    </div>
  );
}

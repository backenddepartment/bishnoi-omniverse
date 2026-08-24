"use client";

import React from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export default function EntitySwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isCorp = pathname.startsWith("/corp");
  const isLlp = pathname.startsWith("/llp");

  return (
    <div
      role="radiogroup"
      aria-label="Select Entity / Region"
      className="inline-flex items-center rounded-full border border-forest-950/15 p-0.5 text-sm"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isCorp}
        onClick={() => router.push("/corp")}
        className={`rounded-full px-3.5 py-1 font-medium transition-colors ${
          isCorp ? "bg-forest-950 text-white" : "text-forest-950/70 hover:text-forest-950"
        }`}
      >
        CORP
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isLlp}
        onClick={() => router.push("/llp")}
        className={`rounded-full px-3.5 py-1 font-medium transition-colors ${
          isLlp ? "bg-forest-950 text-white" : "text-forest-950/70 hover:text-forest-950"
        }`}
      >
        LLP
      </button>
    </div>
  );
}

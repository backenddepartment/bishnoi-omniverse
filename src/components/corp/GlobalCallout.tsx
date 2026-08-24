import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { getCommonData } from "@/lib/data/getOmniverseData";

interface GlobalCalloutProps {
  title?: string;
  body?: string;
}

export default function GlobalCallout({ title, body }: GlobalCalloutProps) {
  const common = getCommonData();
  const defaultCallout = common.globalCallout;

  const displayTitle = title || defaultCallout.title;
  const displayBody = body || defaultCallout.body;

  return (
    <div className="my-8 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
          🌍
        </span>
        <div>
          <h3 className="text-xl font-bold text-forest-950">{displayTitle}</h3>
          <p className="mt-2 text-base text-forest-950/80 leading-relaxed">{displayBody}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/llp"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
            >
              Visit Global Export Hub →
            </Link>
            <a
              href="mailto:care2@getmeds.in"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Email Global Team: care2@getmeds.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

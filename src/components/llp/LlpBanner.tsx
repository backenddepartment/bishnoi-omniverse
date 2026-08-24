import React from "react";
import { Link } from "@/lib/i18n/navigation";

export default function LlpBanner() {
  return (
    <div className="w-full bg-forest-950 py-2.5 px-4 text-center text-xs sm:text-sm text-cream-50 font-medium">
      <span className="mr-2">🇵🇭</span>
      <span>Looking for pharmaceutical distribution within the Philippines? Visit our Philippines CORP operating arm.</span>{" "}
      <Link href="/corp" className="underline hover:text-orange-400 font-semibold ml-1">
        Visit /corp →
      </Link>
    </div>
  );
}

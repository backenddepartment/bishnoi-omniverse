import { redirect } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

// In normal (non-exported) usage, src/proxy.ts already redirects "/" to the
// default locale before this ever renders. This page only matters for the
// static export (GitHub Pages), where there's no middleware to do that.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}

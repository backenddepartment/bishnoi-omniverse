import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bishnoi-omniverse.com";
  const locales = ["en-IN", "hi-IN"];

  const corpRoutes = [
    "",
    "/corp",
    "/corp/about",
    "/corp/oncology-medicines",
    "/corp/hospital-supply",
    "/corp/partnerships",
    "/corp/contact",
  ];

  const llpRoutes = [
    "/llp",
    "/llp/about",
    "/llp/oncology-export-portfolio",
    "/llp/sourcing-supply-chain",
    "/llp/global-partnerships",
    "/llp/contact",
  ];

  const allPaths = [...corpRoutes, ...llpRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    allPaths.forEach((path) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/corp" || path === "/llp" ? "daily" : "weekly",
        priority: path === "" || path === "/corp" || path === "/llp" ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}

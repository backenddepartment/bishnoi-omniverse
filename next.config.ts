import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

// Set by .github/workflows/deploy.yml to produce a static build for GitHub
// Pages. GitHub Pages only serves static files, so it can't run our
// middleware (src/proxy.ts) — Next.js silently disables it during export,
// which is why src/app/page.tsx exists to redirect "/" to the default
// locale instead of relying on the middleware for that.
const isStaticExport = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  allowedDevOrigins: ["192.168.1.28"],
  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);

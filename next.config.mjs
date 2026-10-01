import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// The site is served from the custom domain root (bishnoiomniverse.com), so there is no base path
// by default. Set NEXT_PUBLIC_BASE_PATH (e.g. "/bishnoi-omniverse") only when serving from
// backenddepartment.github.io/bishnoi-omniverse instead.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '') || undefined;
const assetPrefix = basePath ? `${basePath}/` : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: assetPrefix,
  experimental: {
    workerThreads: false,
  },
  webpack(config, { dev, isServer }) {
    // Next 14 always bundles polyfills for Array.prototype.at/flat/flatMap, Object.fromEntries,
    // Object.hasOwn and String.prototype.trimStart/trimEnd. Every browser in the browserslist in
    // package.json has these natively, so the production client bundle drops the module.
    if (!dev && !isServer) {
      config.resolve.alias[require.resolve('next/dist/build/polyfills/polyfill-module')] = false;
    }
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

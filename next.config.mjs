import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = '';

if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
} else if (process.env.NEXT_PUBLIC_BASE_PATH) {
  repo = process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\//, '');
} else {
  // Default repo name for GitHub Pages URL: backenddepartment.github.io/bishnoi-omniverse
  repo = 'bishnoi-omniverse';
}

const basePath = isGithubActions || process.env.NEXT_PUBLIC_BASE_PATH ? `/${repo}` : undefined;
const assetPrefix = isGithubActions || process.env.NEXT_PUBLIC_BASE_PATH ? `/${repo}/` : undefined;

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

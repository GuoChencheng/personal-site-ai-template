import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    // Avoid stale persistent-cache failures and keep CSS loader deprecation helper resolution stable in local builds.
    config.cache = false;
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "util-deprecate": require.resolve("util-deprecate/node.js")
    };
    return config;
  }
};

export default nextConfig;

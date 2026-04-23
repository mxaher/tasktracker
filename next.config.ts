import type { NextConfig } from "next";

import("@opennextjs/cloudflare").then((mod) => mod.initOpenNextCloudflareForDev());

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: process.cwd(),
  },

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },

  webpack(config, { isServer }) {
    // Required for Prisma's query_compiler_bg.wasm to be bundled into the Cloudflare Worker
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
};

export default nextConfig;

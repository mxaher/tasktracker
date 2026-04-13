import type { NextConfig } from "next";

import("@opennextjs/cloudflare").then((mod) => mod.initOpenNextCloudflareForDev());

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  turbopack: {
    root: process.cwd(),
  },

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },

  allowedDevOrigins: [
    "preview-chat-0daed9cf-daeb-40a4-98ed-ead68f62aeb8.space.z.ai",
  ],

  webpack(config) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;

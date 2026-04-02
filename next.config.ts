import type { NextConfig } from "next";

import("@opennextjs/cloudflare").then((mod) => mod.initOpenNextCloudflareForDev());

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: process.cwd(),
  },

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },

  allowedDevOrigins: [
    "preview-chat-0daed9cf-daeb-40a4-98ed-ead68f62aeb8.space.z.ai",
  ],
};

export default nextConfig;

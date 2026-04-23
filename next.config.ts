import type { NextConfig } from "next";

import("@opennextjs/cloudflare").then((mod) => mod.initOpenNextCloudflareForDev());

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", ".prisma/client"],

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: process.cwd(),
  },

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;

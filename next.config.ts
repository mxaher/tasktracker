import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-d1"],

  images: {
    unoptimized: true,
  },

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;

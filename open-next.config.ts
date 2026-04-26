import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Exclude Prisma runtime from bundling - use the built-in WASM
  external: ["@prisma/client/runtime/*"],
  // Bundle Prisma WASM files properly
  esbuildOptions: {
    loader: {
      ".wasm": "copy",
    },
  },
});

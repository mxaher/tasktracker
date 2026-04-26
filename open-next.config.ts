import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Bundle Prisma WASM files properly
  esbuildOptions: {
    loader: {
      ".wasm": "copy",
    },
  },
});

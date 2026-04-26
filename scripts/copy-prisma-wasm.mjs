// Copy Prisma WASM files to the output directory for Cloudflare Workers
import { cpSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const srcDir = join(__dirname, "node_modules/.prisma/client");
const destDir = join(__dirname, ".open-next/server-functions/default/node_modules/.prisma/client");

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

const wasmFiles = [
  "query_compiler_bg.wasm",
  "query_engine_bg.wasm",
];

for (const file of wasmFiles) {
  const src = join(srcDir, file);
  const dest = join(destDir, file);
  if (existsSync(src)) {
    cpSync(src, dest);
    console.log(`Copied ${file}`);
  }
}

console.log("Done copying Prisma WASM files");
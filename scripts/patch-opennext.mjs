// Patches @opennextjs/cloudflare bundle-server to add WASM copy loader for Prisma
// Required until OpenNext exposes custom esbuild loader configuration
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(
  "node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js"
);

let content = readFileSync(filePath, "utf-8");

const needle = `bundle: true,\n        outfile: openNextServerBundle,\n        format: "esm",\n        target: "esnext",`;
const replacement = `bundle: true,\n        outfile: openNextServerBundle,\n        format: "esm",\n        target: "esnext",\n        loader: { ".wasm": "copy" },`;

if (content.includes('loader: { ".wasm": "copy" }')) {
  console.log("patch-opennext: WASM loader already patched, skipping.");
} else if (content.includes(needle)) {
  content = content.replace(needle, replacement);
  writeFileSync(filePath, content, "utf-8");
  console.log("patch-opennext: Applied WASM copy loader patch to bundle-server.js");
} else {
  console.warn("patch-opennext: Could not find patch target — bundle-server.js may have changed. Manual fix required.");
}

import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/prisma";
import { getCloudflareContext } from "@opennextjs/cloudflare";

if (!("instantiateStreaming" in WebAssembly)) {
  Object.assign(WebAssembly, {
    async instantiateStreaming(
      source: Promise<Response> | Response,
      importObject?: WebAssembly.Imports,
    ) {
      const response = await source;
      const bytes = await response.arrayBuffer();
      return WebAssembly.instantiate(bytes, importObject);
    },
  });
}

type D1Binding = ConstructorParameters<typeof PrismaD1>[0];

function getD1Binding(): D1Binding {
  try {
    const context = getCloudflareContext();
    const env = context.env as { DB?: D1Binding };
    if (env.DB) return env.DB;
  } catch {}

  // Local dev fallback — only valid when running `wrangler dev`
  const globalAny = globalThis as any;
  if (globalAny.DB) return globalAny.DB;

  throw new Error(
    "[db] Cloudflare D1 binding (DB) not found. " +
    "Ensure wrangler.jsonc has d1_databases configured and you are " +
    "running via `wrangler dev` or deployed to Cloudflare Workers."
  );
}

export function getDb(): PrismaClient {
  const adapter = new PrismaD1(getD1Binding());
  return new PrismaClient({ adapter });
}

// Convenience proxy for direct usage: `db.task.findMany()`
// Each access creates a fresh client bound to the current request's D1 instance
export const db = new Proxy({} as PrismaClient, {
  get(target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

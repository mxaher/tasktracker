import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "../generated/prisma";
import { getErrorDetails } from "./api-error";

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

function isD1Binding(value: unknown): value is D1Binding {
  return Boolean(
    value &&
      typeof value === "object" &&
      "prepare" in value &&
      typeof (value as { prepare?: unknown }).prepare === "function",
  );
}

function getD1Binding(): D1Binding {
  try {
    const context = getCloudflareContext();
    const env = (context.env ?? {}) as { DB?: unknown };

    if (env.DB === undefined || env.DB === null) {
      console.error("[db] Missing Cloudflare D1 binding `DB` in getCloudflareContext().env", {
        binding: "DB",
        availableEnvKeys: Object.keys(context.env ?? {}),
      });
    } else if (!isD1Binding(env.DB)) {
      console.error("[db] Invalid Cloudflare D1 binding `DB` in getCloudflareContext().env", {
        binding: "DB",
        type: typeof env.DB,
        hasPrepare: typeof (env.DB as { prepare?: unknown }).prepare === "function",
      });
    } else {
      return env.DB;
    }
  } catch (error) {
    const { message, stack } = getErrorDetails(error);

    console.error("[db] Failed to resolve Cloudflare context for D1 binding `DB`", {
      binding: "DB",
      message,
      stack,
    });
  }

  // Local dev fallback - only valid when running `wrangler dev`
  const globalAny = globalThis as { DB?: unknown };

  if (globalAny.DB !== undefined && globalAny.DB !== null) {
    if (isD1Binding(globalAny.DB)) {
      return globalAny.DB;
    }

    console.error("[db] Invalid global D1 binding fallback `DB`", {
      binding: "DB",
      type: typeof globalAny.DB,
      hasPrepare: typeof (globalAny.DB as { prepare?: unknown })?.prepare === "function",
    });
  }

  throw new Error(
    "[db] Cloudflare D1 binding `DB` not found. " +
      "Ensure wrangler.jsonc has d1_databases configured and you are " +
      "running via `wrangler dev` or deployed to Cloudflare Workers.",
  );
}

export function getDb(): PrismaClient {
  const binding = getD1Binding();

  try {
    const adapter = new PrismaD1(binding);
    return new PrismaClient({ adapter });
  } catch (error) {
    const { message, stack } = getErrorDetails(error);

    console.error("[db] Failed to instantiate Prisma client for D1 binding `DB`", {
      binding: "DB",
      message,
      stack,
    });

    throw error;
  }
}

// Convenience proxy for direct usage: `db.task.findMany()`
// Each access creates a fresh client bound to the current request's D1 instance
export const db = new Proxy({} as PrismaClient, {
  get(target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

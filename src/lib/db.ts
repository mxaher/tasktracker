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

type GlobalPrisma = typeof globalThis & {
  localPrisma?: PrismaClient;
  cloudflarePrisma?: PrismaClient;
};

type D1Binding = ConstructorParameters<typeof PrismaD1>[0];

const globalForPrisma = globalThis as GlobalPrisma;

function getCloudflareD1Binding(): D1Binding | undefined {
  // 1. Try getCloudflareContext (standard for OpenNext)
  try {
    const context = getCloudflareContext();
    if (context?.env?.DB) return context.env.DB as D1Binding;
  } catch {}

  // 2. Try global process.env (for some local dev or older OpenNext)
  const globalAny = globalThis as any;
  if (globalAny.process?.env?.DB) return globalAny.process.env.DB;
  
  // 3. Try platform-specific globals
  if (globalAny.DB) return globalAny.DB;

  return undefined;
}

export function getDb() {
  const cloudflareDb = getCloudflareD1Binding();
  
  if (cloudflareDb) {
    if (!globalForPrisma.cloudflarePrisma) {
      const adapter = new PrismaD1(cloudflareDb);
      globalForPrisma.cloudflarePrisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.cloudflarePrisma;
  }

  // Fallback to local SQLite for local development
  if (!globalForPrisma.localPrisma) {
    globalForPrisma.localPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.localPrisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

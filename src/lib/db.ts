import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/prisma";
import { getCloudflareContext } from "@opennextjs/cloudflare";
// Explicitly import the WASM binary so the bundler includes it in the Worker bundle
import queryCompiler from "../generated/prisma/query_compiler_bg.wasm";

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
  try {
    const context = getCloudflareContext();
    const binding = (context.env as { DB?: D1Binding }).DB;
    if (binding) return binding;
  } catch {}

  try {
    const globalWithEnv = globalThis as typeof globalThis & {
      process?: { env?: { DB?: D1Binding } };
    };
    const binding = globalWithEnv.process?.env?.DB as D1Binding | undefined;
    if (binding) return binding;
  } catch {}

  return undefined;
}

function createLocalPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function createCloudflarePrismaClient(database: D1Binding) {
  const adapter = new PrismaD1(database);
  return new PrismaClient({ adapter });
}

export function getDb() {
  const cloudflareDb = getCloudflareD1Binding();
  const runningInCloudflare =
    typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

  if (cloudflareDb) {
    globalForPrisma.cloudflarePrisma ??= createCloudflarePrismaClient(cloudflareDb);
    return globalForPrisma.cloudflarePrisma;
  }

  if (runningInCloudflare) {
    throw new Error("Cloudflare DB binding was not found in the request context.");
  }

  globalForPrisma.localPrisma ??= createLocalPrismaClient();
  return globalForPrisma.localPrisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

// Ensure the WASM module reference is used to prevent tree-shaking
void queryCompiler;

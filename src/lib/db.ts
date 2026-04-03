import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type GlobalPrisma = typeof globalThis & {
  localPrisma?: PrismaClient;
  cloudflarePrisma?: PrismaClient;
};

type D1Binding = ConstructorParameters<typeof PrismaD1>[0];

const globalForPrisma = globalThis as GlobalPrisma;

function getCloudflareD1Binding(): D1Binding | undefined {
  try {
    // Try method 1: getCloudflareContext
    const context = getCloudflareContext();
    const binding = (context.env as { DB?: D1Binding }).DB;
    if (binding) return binding;
  } catch {}
  
  try {
    // Try method 2: globalThis.process.env (OpenNext Cloudflare pattern)
    const globalWithEnv = globalThis as typeof globalThis & { 
      process?: { env?: { DB?: D1Binding } } 
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

  if (cloudflareDb) {
    // Running on Cloudflare Workers: use D1
    globalForPrisma.cloudflarePrisma ??= createCloudflarePrismaClient(cloudflareDb);
    return globalForPrisma.cloudflarePrisma;
  }

  // Local development: use SQLite via DATABASE_URL
  globalForPrisma.localPrisma ??= createLocalPrismaClient();
  return globalForPrisma.localPrisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

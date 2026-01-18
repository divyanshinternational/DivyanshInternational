import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "@/lib/env";

// =============================================================================
// PRISMA CLIENT SINGLETON
// =============================================================================

const createPrismaClient = () => {
  // Use the PrismaPg adapter for better compatibility with serverless environments
  // and connection pooling (e.g. Neon, Vercel Postgres)
  const connectionString = env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

// =============================================================================
// GLOBAL EXTENSION
// =============================================================================

// Prevent multiple instances of Prisma Client in development
// due to hot reloading.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// =============================================================================
// DEVELOPMENT LOGIC
// =============================================================================

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

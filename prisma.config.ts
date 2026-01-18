import { defineConfig, env } from "prisma/config";

/**
 * Prisma Configuration
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  /**
   * Path to the Prisma schema file
   */
  schema: "prisma/schema.prisma",

  /**
   * Migration configuration
   */
  migrations: {
    path: "prisma/migrations",
  },

  /**
   * Database connection configuration
   * Using DIRECT_URL for direct database connections (bypasses connection pooling)
   * This is required for migrations and schema changes
   */
  datasource: {
    url: env("DIRECT_URL"),
  },
});

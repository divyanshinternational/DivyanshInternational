/**
 * ==============================================================================
 * ENVIRONMENT VARIABLE VALIDATION & TYPE SAFETY
 * ==============================================================================
 * This module uses @t3-oss/env-nextjs to validate and type environment variables.
 * All env vars are validated at build time and runtime using Zod schemas.
 *
 * Usage:
 *   import { env } from "@/env";
 *   const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
 *
 * Benefits:
 *   - Type safety: env.VARIABLE is fully typed
 *   - Validation: Missing/invalid vars cause immediate errors
 *   - Documentation: Each variable is described inline
 * ==============================================================================
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // ===========================================================================
  // SERVER-SIDE VARIABLES
  // These are only available on the server and never exposed to the browser.
  // ===========================================================================
  server: {
    // Environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
      .describe("Current environment mode"),

    // Database (Supabase/Prisma)
    DATABASE_URL: z.string().url().describe("Prisma pooled connection URL (port 6543)"),
    DIRECT_URL: z
      .string()
      .url()
      .describe("Prisma direct connection URL for migrations (port 5432)"),

    // Sanity CMS (Write Token)
    SANITY_API_TOKEN: z.string().min(1).describe("Sanity API token with write permissions"),

    // Email (Resend)
    RESEND_API_KEY: z.string().min(1).describe("Resend.com API key for sending emails"),
    CONTACT_EMAIL: z.string().email().describe("Email address to receive form submissions"),

    // Webhooks (Optional)
    ENQUIRY_WEBHOOK_URL: z
      .string()
      .url()
      .optional()
      .describe("Webhook URL for enquiry notifications"),
  },

  // ===========================================================================
  // CLIENT-SIDE VARIABLES
  // These must be prefixed with NEXT_PUBLIC_ and are bundled into the browser.
  // ===========================================================================
  client: {
    // Sanity CMS (Public)
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).describe("Sanity project ID"),
    NEXT_PUBLIC_SANITY_DATASET: z
      .string()
      .min(1)
      .default("production")
      .describe("Sanity dataset name"),
    NEXT_PUBLIC_SANITY_API_VERSION: z
      .string()
      .min(1)
      .default("2024-01-01")
      .describe("Sanity API version (YYYY-MM-DD)"),

    // Supabase (Public)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().describe("Supabase project URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().describe("Supabase anonymous key"),

    // Application
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url()
      .optional()
      .default("http://localhost:3000")
      .describe("Base URL for SEO and canonical links"),

    // Analytics
    NEXT_PUBLIC_GA4_ID: z.string().optional().describe("Google Analytics 4 Measurement ID"),
  },

  // ===========================================================================
  // RUNTIME ENVIRONMENT MAPPING
  // Required for Next.js to properly bundle client-side variables.
  // ===========================================================================
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env["DATABASE_URL"],
    DIRECT_URL: process.env["DIRECT_URL"],
    SANITY_API_TOKEN: process.env["SANITY_API_TOKEN"],
    RESEND_API_KEY: process.env["RESEND_API_KEY"],
    CONTACT_EMAIL: process.env["CONTACT_EMAIL"],
    ENQUIRY_WEBHOOK_URL: process.env["ENQUIRY_WEBHOOK_URL"],

    // Client
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"],
    NEXT_PUBLIC_SANITY_DATASET: process.env["NEXT_PUBLIC_SANITY_DATASET"],
    NEXT_PUBLIC_SANITY_API_VERSION: process.env["NEXT_PUBLIC_SANITY_API_VERSION"],
    NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    NEXT_PUBLIC_BASE_URL: process.env["NEXT_PUBLIC_BASE_URL"],
    NEXT_PUBLIC_GA4_ID: process.env["NEXT_PUBLIC_GA4_ID"],
  },

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================
  /**
   * Skip validation during build (useful for CI/CD where secrets aren't available)
   * Set SKIP_ENV_VALIDATION=1 to bypass
   */
  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],

  /**
   * Treat empty strings as undefined for optional fields
   */
  emptyStringAsUndefined: true,
});

// ===========================================================================
// TYPE EXPORTS
// ===========================================================================
export type Env = typeof env;

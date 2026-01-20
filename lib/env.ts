import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // ===========================================================================
  // SERVER SIDE
  // ===========================================================================
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // Database (Supabase/Prisma)
    DATABASE_URL: z.string().url().describe("Prisma/Supabase Connection URL"),
    DIRECT_URL: z.string().url().describe("Direct Database URL for migrations"),

    // Sanity (Server Token)
    SANITY_API_TOKEN: z.string().min(1).describe("Sanity API Token with write permissions"),

    // Email (Resend)
    RESEND_API_KEY: z.string().min(1).describe("Resend.com API Key"),
    CONTACT_EMAIL: z.string().email().describe("Main contact email for notifications"),

    // Webhooks
    ENQUIRY_WEBHOOK_URL: z.string().url().optional().describe("Webhook for form submissions"),
    SANITY_WEBHOOK_SECRET: z
      .string()
      .min(1)
      .optional()
      .describe("Secret for Sanity revalidation webhooks"),
  },

  // ===========================================================================
  // CLIENT SIDE
  // ===========================================================================
  client: {
    // Sanity (Public)
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1).default("2024-01-01"),

    // Supabase (Public)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // App Info
    NEXT_PUBLIC_BASE_URL: z.string().url().optional().default("http://localhost:3000"),
    NEXT_PUBLIC_GA4_ID: z.string().optional(),
  },

  // ===========================================================================
  // RUNTIME ENVIRONMENT MAPPING
  // ===========================================================================
  // For Next.js to bundle client variables correctly, we must manually map them.
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env["DATABASE_URL"],
    DIRECT_URL: process.env["DIRECT_URL"],
    SANITY_API_TOKEN: process.env["SANITY_API_TOKEN"],
    RESEND_API_KEY: process.env["RESEND_API_KEY"],
    CONTACT_EMAIL: process.env["CONTACT_EMAIL"],
    ENQUIRY_WEBHOOK_URL: process.env["ENQUIRY_WEBHOOK_URL"],
    SANITY_WEBHOOK_SECRET: process.env["SANITY_WEBHOOK_SECRET"],

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
  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],
  emptyStringAsUndefined: true,
});

"use server";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { env } from "@/lib/env";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const enquiryItemSchema = z.object({
  productTitle: z.string().min(1),
  grade: z.string().optional(),
  packFormat: z.string().optional(),
  quantity: z.string().optional(),
  MOQ: z.string().optional(),
  notes: z.string().optional(),
});

const contactInfoSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const requestBodySchema = z.object({
  items: z.array(enquiryItemSchema).min(1),
  contactInfo: contactInfoSchema.optional(),
});

// =============================================================================
// CMS CONFIGURATION SCHEMAS
// =============================================================================

const apiMessagesSchema = z.object({
  validationError: z.string().optional(),
  enquirySuccess: z.string().optional(),
  serverError: z.string().optional(),
});

const apiConfigSchema = z.object({
  httpMethodPost: z.string().optional(),
  contentTypeHeader: z.string().optional(),
  contentTypeJson: z.string().optional(),
  enquiryIdPrefix: z.string().optional(),
});

const siteSettingsSchema = z
  .object({
    apiMessages: apiMessagesSchema.optional(),
    apiConfig: apiConfigSchema.optional(),
  })
  .passthrough();

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS = {
  apiMessages: {
    validationError: "Please provide valid enquiry items.",
    enquirySuccess: "Thank you for your enquiry. We will get back to you soon.",
    serverError: "An unexpected error occurred. Please try again later.",
  },
  apiConfig: {
    httpMethodPost: "POST",
    contentTypeHeader: "Content-Type",
    contentTypeJson: "application/json",
    enquiryIdPrefix: "ENQ-",
  },
} as const;

// =============================================================================
// GET CONFIGURATION
// =============================================================================

async function getConfig() {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[API Enquiry Submit] Settings validation failed:", result.error.issues);
    }

    const settings = result.success ? result.data : null;

    return {
      apiMessages: {
        validationError:
          settings?.apiMessages?.validationError ?? DEFAULTS.apiMessages.validationError,
        enquirySuccess:
          settings?.apiMessages?.enquirySuccess ?? DEFAULTS.apiMessages.enquirySuccess,
        serverError: settings?.apiMessages?.serverError ?? DEFAULTS.apiMessages.serverError,
      },
      apiConfig: {
        httpMethodPost: settings?.apiConfig?.httpMethodPost ?? DEFAULTS.apiConfig.httpMethodPost,
        contentTypeHeader:
          settings?.apiConfig?.contentTypeHeader ?? DEFAULTS.apiConfig.contentTypeHeader,
        contentTypeJson: settings?.apiConfig?.contentTypeJson ?? DEFAULTS.apiConfig.contentTypeJson,
        enquiryIdPrefix: settings?.apiConfig?.enquiryIdPrefix ?? DEFAULTS.apiConfig.enquiryIdPrefix,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Enquiry Submit] Failed to fetch config:", error);
    }
    return {
      apiMessages: DEFAULTS.apiMessages,
      apiConfig: DEFAULTS.apiConfig,
    };
  }
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  const { apiMessages, apiConfig } = await getConfig();

  try {
    // Parse and validate request body
    const body: unknown = await request.json();
    const validation = requestBodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: apiMessages.validationError,
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { items, contactInfo } = validation.data;

    // Build payload for webhook
    const payload = {
      items,
      contactInfo,
      timestamp: new Date().toISOString(),
    };

    // Send to webhook if configured
    const webhookUrl = env.ENQUIRY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: apiConfig.httpMethodPost,
          headers: {
            [apiConfig.contentTypeHeader]: apiConfig.contentTypeJson,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok && process.env.NODE_ENV === "development") {
          console.warn(
            "[API Enquiry Submit] Webhook returned non-OK status:",
            response.status,
            response.statusText
          );
        }
      } catch (webhookError: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[API Enquiry Submit] Webhook error:", webhookError);
        }
      }
    }

    // Generate enquiry ID
    const enquiryId = `${apiConfig.enquiryIdPrefix}${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: apiMessages.enquirySuccess,
      enquiryId,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Enquiry Submit] Unhandled error:", error);
    }
    return NextResponse.json({ success: false, error: apiMessages.serverError }, { status: 500 });
  }
}

"use server";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createGeneralEnquirySchema } from "@/lib/validation/schemas";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend/client";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { env } from "@/lib/env";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS configuration
// =============================================================================

const apiMessagesSchema = z.object({
  rateLimitError: z.string().optional(),
  validationError: z.string().optional(),
  enquirySuccess: z.string().optional(),
  serverError: z.string().optional(),
});

const emailTemplatesSchema = z.object({
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  generalSubject: z.string().optional(),
  newGeneralEnquiryTitle: z.string().optional(),
  nameLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  naText: z.string().optional(),
});

const apiConfigSchema = z.object({
  unknownIpLabel: z.string().optional(),
  rateLimitMaxRequests: z.number().optional(),
  rateLimitWindowMs: z.number().optional(),
  enquiryTypeGeneral: z.string().optional(),
  enquiryStatusNew: z.string().optional(),
  fallbackEmail: z.string().email().optional(),
});

const validationConfigSchema = z
  .object({
    nameMinLength: z.number(),
    nameMinError: z.string(),
    emailInvalidError: z.string(),
    messageMinLength: z.number(),
    messageMinError: z.string(),
    companyMinLength: z.number(),
    companyRequiredError: z.string(),
    phoneMinLength: z.number(),
    phoneRequiredError: z.string(),
    countryMinLength: z.number(),
    countryRequiredError: z.string(),
    honeypotMaxLength: z.number(),
  })
  .passthrough();

const siteSettingsSchema = z
  .object({
    apiMessages: apiMessagesSchema.optional(),
    emailTemplates: emailTemplatesSchema.optional(),
    apiConfig: apiConfigSchema.optional(),
    validation: validationConfigSchema.optional(),
  })
  .passthrough();

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS = {
  apiMessages: {
    rateLimitError: "Too many requests. Please try again later.",
    validationError: "Please check your input and try again.",
    enquirySuccess: "Thank you for your enquiry. We will get back to you soon.",
    serverError: "An unexpected error occurred. Please try again later.",
  },
  emailTemplates: {
    fromName: "Divyansh International",
    fromEmail: "onboarding@resend.dev",
    generalSubject: "New General Enquiry from",
    newGeneralEnquiryTitle: "New General Enquiry",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    naText: "N/A",
  },
  apiConfig: {
    unknownIpLabel: "unknown",
    rateLimitMaxRequests: 5,
    rateLimitWindowMs: 60000,
    enquiryTypeGeneral: "general",
    enquiryStatusNew: "new",
    fallbackEmail: "contact@divyanshinternational.com",
  },
  validation: {
    nameMinLength: 2,
    nameMinError: "Name must be at least 2 characters",
    emailInvalidError: "Please enter a valid email address",
    messageMinLength: 10,
    messageMinError: "Message must be at least 10 characters",
    companyMinLength: 2,
    companyRequiredError: "Company name is required",
    phoneMinLength: 10,
    phoneRequiredError: "Phone number is required",
    countryMinLength: 2,
    countryRequiredError: "Country is required",
    honeypotMaxLength: 0,
  },
} as const;

// =============================================================================
// RATE LIMITING
// In-memory rate limiter (production should use Redis)
// =============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// =============================================================================
// GET CONFIGURATION
// Fetches and validates Sanity configuration with fallbacks
// =============================================================================

async function getConfig() {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[API General Contact] Settings validation failed:", result.error.issues);
    }

    const settings = result.success ? result.data : null;

    return {
      apiMessages: {
        rateLimitError:
          settings?.apiMessages?.rateLimitError ?? DEFAULTS.apiMessages.rateLimitError,
        validationError:
          settings?.apiMessages?.validationError ?? DEFAULTS.apiMessages.validationError,
        enquirySuccess:
          settings?.apiMessages?.enquirySuccess ?? DEFAULTS.apiMessages.enquirySuccess,
        serverError: settings?.apiMessages?.serverError ?? DEFAULTS.apiMessages.serverError,
      },
      templates: {
        fromName: settings?.emailTemplates?.fromName ?? DEFAULTS.emailTemplates.fromName,
        fromEmail: settings?.emailTemplates?.fromEmail ?? DEFAULTS.emailTemplates.fromEmail,
        generalSubject:
          settings?.emailTemplates?.generalSubject ?? DEFAULTS.emailTemplates.generalSubject,
        newGeneralEnquiryTitle:
          settings?.emailTemplates?.newGeneralEnquiryTitle ??
          DEFAULTS.emailTemplates.newGeneralEnquiryTitle,
        nameLabel: settings?.emailTemplates?.nameLabel ?? DEFAULTS.emailTemplates.nameLabel,
        emailLabel: settings?.emailTemplates?.emailLabel ?? DEFAULTS.emailTemplates.emailLabel,
        phoneLabel: settings?.emailTemplates?.phoneLabel ?? DEFAULTS.emailTemplates.phoneLabel,
        messageLabel:
          settings?.emailTemplates?.messageLabel ?? DEFAULTS.emailTemplates.messageLabel,
        naText: settings?.emailTemplates?.naText ?? DEFAULTS.emailTemplates.naText,
      },
      apiConfig: {
        unknownIpLabel: settings?.apiConfig?.unknownIpLabel ?? DEFAULTS.apiConfig.unknownIpLabel,
        rateLimitMaxRequests:
          settings?.apiConfig?.rateLimitMaxRequests ?? DEFAULTS.apiConfig.rateLimitMaxRequests,
        rateLimitWindowMs:
          settings?.apiConfig?.rateLimitWindowMs ?? DEFAULTS.apiConfig.rateLimitWindowMs,
        enquiryTypeGeneral:
          settings?.apiConfig?.enquiryTypeGeneral ?? DEFAULTS.apiConfig.enquiryTypeGeneral,
        enquiryStatusNew:
          settings?.apiConfig?.enquiryStatusNew ?? DEFAULTS.apiConfig.enquiryStatusNew,
        fallbackEmail: settings?.apiConfig?.fallbackEmail ?? DEFAULTS.apiConfig.fallbackEmail,
      },
      validationConfig: settings?.validation ?? DEFAULTS.validation,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API General Contact] Failed to fetch config:", error);
    }
    return {
      apiMessages: DEFAULTS.apiMessages,
      templates: DEFAULTS.emailTemplates,
      apiConfig: DEFAULTS.apiConfig,
      validationConfig: DEFAULTS.validation,
    };
  }
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  // Get configuration with fallbacks
  const { apiMessages, templates, apiConfig, validationConfig } = await getConfig();

  try {
    // Extract client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      apiConfig.unknownIpLabel;

    // Check rate limit
    if (!checkRateLimit(ip, apiConfig.rateLimitMaxRequests, apiConfig.rateLimitWindowMs)) {
      return NextResponse.json(
        { success: false, error: apiMessages.rateLimitError },
        { status: 429 }
      );
    }

    // Parse request body
    const body: unknown = await request.json();

    // Validate input
    const generalEnquirySchema = createGeneralEnquirySchema(validationConfig);
    const validation = generalEnquirySchema.safeParse(body);
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

    const data = validation.data;

    // Honeypot check - silently succeed if bot detected
    if (data.honeypot) {
      return NextResponse.json({ success: true });
    }

    // Save to database (non-blocking errors)
    try {
      const { EnquiryType, EnquiryStatus } = await import("@prisma/client");

      await prisma.enquiry.create({
        data: {
          type: EnquiryType.general,
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          message: data.message,
          status: EnquiryStatus.new,
        },
      });
    } catch (dbError: unknown) {
      // Log but don't fail the request - email will still be sent
      if (process.env.NODE_ENV === "development") {
        console.error("[API General Contact] Database error:", dbError);
      }
    }

    // Send notification email (non-blocking errors)
    try {
      await resend.emails.send({
        from: `${templates.fromName} <${templates.fromEmail}>`,
        to: env.CONTACT_EMAIL || apiConfig.fallbackEmail,
        subject: `${templates.generalSubject} ${data.name}`,
        html: `
          <h2>${templates.newGeneralEnquiryTitle}</h2>
          <p><strong>${templates.nameLabel}:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>${templates.emailLabel}:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>${templates.phoneLabel}:</strong> ${data.phone ? escapeHtml(data.phone) : templates.naText}</p>
          <p><strong>${templates.messageLabel}:</strong></p>
          <p>${escapeHtml(data.message)}</p>
        `,
      });
    } catch (emailError: unknown) {
      // Log but don't fail the request - data is already saved
      if (process.env.NODE_ENV === "development") {
        console.error("[API General Contact] Email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: apiMessages.enquirySuccess,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API General Contact] Unhandled error:", error);
    }
    return NextResponse.json({ success: false, error: apiMessages.serverError }, { status: 500 });
  }
}

// =============================================================================
// SECURITY HELPERS
// =============================================================================

/**
 * Escapes HTML to prevent XSS in email content
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

"use server";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createTradeEnquirySchema } from "@/lib/validation/schemas";
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
  tradeSubject: z.string().optional(),
  newTradeEnquiryTitle: z.string().optional(),
  nameLabel: z.string().optional(),
  companyLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  roleLabel: z.string().optional(),
  countryLabel: z.string().optional(),
  productsLabel: z.string().optional(),
  quantityLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  naText: z.string().optional(),
  noneText: z.string().optional(),
});

const apiConfigSchema = z.object({
  unknownIpLabel: z.string().optional(),
  rateLimitMaxRequests: z.number().optional(),
  rateLimitWindowMs: z.number().optional(),
  enquiryTypeTrade: z.string().optional(),
  enquiryStatusNew: z.string().optional(),
  fallbackEmail: z.string().email().optional(),
  listSeparator: z.string().optional(),
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
    enquirySuccess: "Thank you for your trade enquiry. We will get back to you soon.",
    serverError: "An unexpected error occurred. Please try again later.",
  },
  emailTemplates: {
    fromName: "Divyansh International",
    fromEmail: "onboarding@resend.dev",
    tradeSubject: "New Trade Enquiry from",
    newTradeEnquiryTitle: "New Trade Enquiry",
    nameLabel: "Name",
    companyLabel: "Company",
    emailLabel: "Email",
    phoneLabel: "Phone",
    roleLabel: "Role",
    countryLabel: "Country",
    productsLabel: "Products of Interest",
    quantityLabel: "Quantity",
    messageLabel: "Message",
    naText: "N/A",
    noneText: "None specified",
  },
  apiConfig: {
    unknownIpLabel: "unknown",
    rateLimitMaxRequests: 5,
    rateLimitWindowMs: 60000,
    enquiryTypeTrade: "trade",
    enquiryStatusNew: "new",
    fallbackEmail: "trade@divyanshinternational.com",
    listSeparator: ", ",
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
      console.warn("[API Trade Contact] Settings validation failed:", result.error.issues);
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
        tradeSubject:
          settings?.emailTemplates?.tradeSubject ?? DEFAULTS.emailTemplates.tradeSubject,
        newTradeEnquiryTitle:
          settings?.emailTemplates?.newTradeEnquiryTitle ??
          DEFAULTS.emailTemplates.newTradeEnquiryTitle,
        nameLabel: settings?.emailTemplates?.nameLabel ?? DEFAULTS.emailTemplates.nameLabel,
        companyLabel:
          settings?.emailTemplates?.companyLabel ?? DEFAULTS.emailTemplates.companyLabel,
        emailLabel: settings?.emailTemplates?.emailLabel ?? DEFAULTS.emailTemplates.emailLabel,
        phoneLabel: settings?.emailTemplates?.phoneLabel ?? DEFAULTS.emailTemplates.phoneLabel,
        roleLabel: settings?.emailTemplates?.roleLabel ?? DEFAULTS.emailTemplates.roleLabel,
        countryLabel:
          settings?.emailTemplates?.countryLabel ?? DEFAULTS.emailTemplates.countryLabel,
        productsLabel:
          settings?.emailTemplates?.productsLabel ?? DEFAULTS.emailTemplates.productsLabel,
        quantityLabel:
          settings?.emailTemplates?.quantityLabel ?? DEFAULTS.emailTemplates.quantityLabel,
        messageLabel:
          settings?.emailTemplates?.messageLabel ?? DEFAULTS.emailTemplates.messageLabel,
        naText: settings?.emailTemplates?.naText ?? DEFAULTS.emailTemplates.naText,
        noneText: settings?.emailTemplates?.noneText ?? DEFAULTS.emailTemplates.noneText,
      },
      apiConfig: {
        unknownIpLabel: settings?.apiConfig?.unknownIpLabel ?? DEFAULTS.apiConfig.unknownIpLabel,
        rateLimitMaxRequests:
          settings?.apiConfig?.rateLimitMaxRequests ?? DEFAULTS.apiConfig.rateLimitMaxRequests,
        rateLimitWindowMs:
          settings?.apiConfig?.rateLimitWindowMs ?? DEFAULTS.apiConfig.rateLimitWindowMs,
        enquiryTypeTrade:
          settings?.apiConfig?.enquiryTypeTrade ?? DEFAULTS.apiConfig.enquiryTypeTrade,
        enquiryStatusNew:
          settings?.apiConfig?.enquiryStatusNew ?? DEFAULTS.apiConfig.enquiryStatusNew,
        fallbackEmail: settings?.apiConfig?.fallbackEmail ?? DEFAULTS.apiConfig.fallbackEmail,
        listSeparator: settings?.apiConfig?.listSeparator ?? DEFAULTS.apiConfig.listSeparator,
      },
      validationConfig: settings?.validation ?? DEFAULTS.validation,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Trade Contact] Failed to fetch config:", error);
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
    const tradeEnquirySchema = createTradeEnquirySchema(validationConfig);
    const validation = tradeEnquirySchema.safeParse(body);
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
          type: EnquiryType.trade,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          role: data.role ?? null,
          country: data.country,
          productInterest: data.productInterest ?? [],
          quantity: data.quantity ?? null,
          message: data.message,
          status: EnquiryStatus.new,
        },
      });
    } catch (dbError: unknown) {
      // Log but don't fail the request - email will still be sent
      if (process.env.NODE_ENV === "development") {
        console.error("[API Trade Contact] Database error:", dbError);
      }
    }

    // Send notification email (non-blocking errors)
    try {
      const productsDisplay = data.productInterest?.length
        ? data.productInterest.map(escapeHtml).join(apiConfig.listSeparator)
        : templates.noneText;

      await resend.emails.send({
        from: `${templates.fromName} <${templates.fromEmail}>`,
        to: env.CONTACT_EMAIL || apiConfig.fallbackEmail,
        subject: `${templates.tradeSubject} ${escapeHtml(data.company)}`,
        html: `
          <h2>${templates.newTradeEnquiryTitle}</h2>
          <p><strong>${templates.nameLabel}:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>${templates.companyLabel}:</strong> ${escapeHtml(data.company)}</p>
          <p><strong>${templates.emailLabel}:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>${templates.phoneLabel}:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>${templates.roleLabel}:</strong> ${data.role ? escapeHtml(data.role) : templates.naText}</p>
          <p><strong>${templates.countryLabel}:</strong> ${escapeHtml(data.country)}</p>
          <p><strong>${templates.productsLabel}:</strong> ${productsDisplay}</p>
          <p><strong>${templates.quantityLabel}:</strong> ${data.quantity ? escapeHtml(data.quantity) : templates.naText}</p>
          <p><strong>${templates.messageLabel}:</strong></p>
          <p>${escapeHtml(data.message)}</p>
        `,
      });
    } catch (emailError: unknown) {
      // Log but don't fail the request - data is already saved
      if (process.env.NODE_ENV === "development") {
        console.error("[API Trade Contact] Email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: apiMessages.enquirySuccess,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Trade Contact] Unhandled error:", error);
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

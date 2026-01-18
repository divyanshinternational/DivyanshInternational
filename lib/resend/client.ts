import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

export const SendEmailSchema = z.object({
  from: z.string().min(1).optional().default("Divyansh International <onboarding@resend.dev>"),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1),
  html: z.string().min(1),
  replyTo: z.string().email().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type SendEmailOptions = z.infer<typeof SendEmailSchema>;

// =============================================================================
// CLIENT
// =============================================================================

export const resend = new Resend(env.RESEND_API_KEY);

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Sends an email using Resend with Zod validation.
 * @param options Email options (from, to, subject, html, etc.)
 * @returns Promise with success status and data/error
 */
export async function sendEmail(options: SendEmailOptions) {
  // 1. Input Validation
  const result = SendEmailSchema.safeParse(options);

  if (!result.success) {
    console.error("[Email] Validation Error:", result.error.flatten());
    return { success: false, error: result.error };
  }

  const { from, to, subject, html, replyTo } = result.data;

  try {
    // 2. Build email payload - only include replyTo if it's defined
    const emailPayload = {
      from,
      to,
      subject,
      html,
      ...(replyTo !== undefined && { replyTo }),
    };

    // 3. Send via Resend
    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("[Email] Service Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Email] Unexpected Error:", error);
    return { success: false, error };
  }
}

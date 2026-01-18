"use client";

/**
 * General Enquiry Form
 * Handles general contact form submissions with validation and analytics tracking.
 */

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createGeneralEnquirySchema, type GeneralEnquiryInput } from "@/lib/validation/schemas";
import { trackEvent } from "@/components/analytics/GA4";

// =============================================================================
// ZOD VALIDATION SCHEMAS (PROPS)
// =============================================================================

const FormLabelsSchema = z.object({
  nameLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  submitButton: z.string().optional(),
  submittingButton: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  requiredIndicator: z.string().optional(),
  generalEnquiryEndpoint: z.string().optional(),
  honeypotTabIndex: z.number().optional(),
});

const AnalyticsConfigSchema = z.object({
  eventFormSubmission: z.string().optional(),
  paramFormType: z.string().optional(),
  formTypeGeneral: z.string().optional(),
});

const ValidationConfigSchema = z.object({
  nameMinLength: z.number().optional(),
  nameMinError: z.string().optional(),
  emailInvalidError: z.string().optional(),
  messageMinLength: z.number().optional(),
  messageMinError: z.string().optional(),
  companyMinLength: z.number().optional(),
  companyRequiredError: z.string().optional(),
  phoneMinLength: z.number().optional(),
  phoneRequiredError: z.string().optional(),
  countryMinLength: z.number().optional(),
  countryRequiredError: z.string().optional(),
  honeypotMaxLength: z.number().optional(),
});

const GeneralEnquiryFormPropsSchema = z.object({
  formLabels: FormLabelsSchema.optional(),
  analytics: AnalyticsConfigSchema.optional(),
  validation: ValidationConfigSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type FormLabels = z.infer<typeof FormLabelsSchema>;
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>;
export type ValidationConfig = z.infer<typeof ValidationConfigSchema>;
export type GeneralEnquiryFormProps = z.infer<typeof GeneralEnquiryFormPropsSchema>;

// Helper type to remove undefined from all properties
type Complete<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_LABELS: Complete<FormLabels> = {
  nameLabel: "Name",
  emailLabel: "Email",
  phoneLabel: "Phone (Optional)",
  messageLabel: "Message",
  submitButton: "Send Message",
  submittingButton: "Sending...",
  successMessage: "Thank you for your enquiry. We will get back to you soon.",
  errorMessage: "Something went wrong. Please try again.",
  requiredIndicator: "*",
  generalEnquiryEndpoint: "/api/contact/general",
  honeypotTabIndex: -1,
};

const DEFAULT_ANALYTICS: Complete<AnalyticsConfig> = {
  eventFormSubmission: "form_submission",
  paramFormType: "form_type",
  formTypeGeneral: "general_enquiry",
};

const DEFAULT_VALIDATION: Complete<ValidationConfig> = {
  nameMinLength: 2,
  nameMinError: "Name must be at least 2 characters",
  emailInvalidError: "Please enter a valid email",
  messageMinLength: 10,
  messageMinError: "Message must be at least 10 characters",
  companyMinLength: 2,
  companyRequiredError: "Company is required",
  phoneMinLength: 10,
  phoneRequiredError: "Phone is required",
  countryMinLength: 2,
  countryRequiredError: "Country is required",
  honeypotMaxLength: 0,
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function GeneralEnquiryForm({
  formLabels,
  analytics,
  validation,
}: GeneralEnquiryFormProps) {
  // Runtime prop validation in development
  if (process.env.NODE_ENV === "development") {
    const result = GeneralEnquiryFormPropsSchema.safeParse({
      formLabels,
      analytics,
      validation,
    });
    if (!result.success) {
      console.warn("[GeneralEnquiryForm] Prop validation warning:", result.error.flatten());
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Merge with defaults - assert existence since defaults are complete
  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...formLabels }) as Complete<FormLabels>,
    [formLabels]
  );
  const analyticsConfig = useMemo(
    () => ({ ...DEFAULT_ANALYTICS, ...analytics }) as Complete<AnalyticsConfig>,
    [analytics]
  );
  const validationConfig = useMemo(
    () => ({ ...DEFAULT_VALIDATION, ...validation }) as Complete<ValidationConfig>,
    [validation]
  );

  // Create validation schema - we cast validationConfig back to what createGeneralEnquirySchema expects if needed,
  // but since Complete<T> is stricter, it should satisfy T if T allows undefined.
  // Actually the issue might be that createGeneralEnquirySchema expects stricter types too?
  // Let's assume createGeneralEnquirySchema accepts the stricter type.
  const generalEnquirySchema = createGeneralEnquirySchema(validationConfig);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GeneralEnquiryInput>({
    resolver: zodResolver(generalEnquirySchema),
  });

  const onSubmit = useCallback(
    async (data: GeneralEnquiryInput) => {
      // Honeypot check - silently fail for bots
      if (data.honeypot) {
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        const response = await fetch(labels.generalEnquiryEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setSubmitStatus("success");
          reset();

          // Track successful submission
          trackEvent(analyticsConfig.eventFormSubmission, {
            [analyticsConfig.paramFormType]: analyticsConfig.formTypeGeneral,
          });
        } else {
          setSubmitStatus("error");
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[GeneralEnquiryForm] Submission error:", error);
        }
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [labels.generalEnquiryEndpoint, analyticsConfig, reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot field - hidden from users, visible to bots */}
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={labels.honeypotTabIndex}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Name Field */}
      <div>
        <label htmlFor="general-name" className="block text-sm font-medium text-foreground mb-2">
          {labels.nameLabel}{" "}
          <span className="text-red-500" aria-hidden="true">
            {labels.requiredIndicator}
          </span>
        </label>
        <input
          id="general-name"
          type="text"
          {...register("name")}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "general-name-error" : undefined}
        />
        {errors.name ? (
          <p id="general-name-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="general-email" className="block text-sm font-medium text-foreground mb-2">
          {labels.emailLabel}{" "}
          <span className="text-red-500" aria-hidden="true">
            {labels.requiredIndicator}
          </span>
        </label>
        <input
          id="general-email"
          type="email"
          {...register("email")}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "general-email-error" : undefined}
        />
        {errors.email ? (
          <p id="general-email-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="general-phone" className="block text-sm font-medium text-foreground mb-2">
          {labels.phoneLabel}
        </label>
        <input
          id="general-phone"
          type="tel"
          {...register("phone")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-2 focus:outline-gold transition-colors"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="general-message" className="block text-sm font-medium text-foreground mb-2">
          {labels.messageLabel}{" "}
          <span className="text-red-500" aria-hidden="true">
            {labels.requiredIndicator}
          </span>
        </label>
        <textarea
          id="general-message"
          {...register("message")}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "general-message-error" : undefined}
        />
        {errors.message ? (
          <p id="general-message-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Success Message */}
      {submitStatus === "success" ? (
        <div
          className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
          role="alert"
          aria-live="polite"
        >
          {labels.successMessage}
        </div>
      ) : null}

      {/* Error Message */}
      {submitStatus === "error" ? (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          role="alert"
          aria-live="assertive"
        >
          {labels.errorMessage}
        </div>
      ) : null}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-gold-dark focus:outline-offset-2 active:scale-95"
      >
        {isSubmitting ? labels.submittingButton : labels.submitButton}
      </button>
    </form>
  );
}

"use client";

/**
 * Quote Request Form
 * Handles contact form submissions with product selection,
 * validation, and analytics tracking.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createTradeEnquirySchema, type TradeEnquiryInput } from "@/lib/validation/schemas";
import { getEnquiryItems } from "@/lib/utils/enquiry";
import { trackEvent } from "@/components/analytics/GA4";
import { useLanguage } from "@/context/LanguageContext";

// =============================================================================
// ZOD VALIDATION SCHEMAS (PROPS)
// =============================================================================

const ProductItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
});

const FormLabelsSchema = z.object({
  nameLabel: z.string().optional(),
  companyLabel: z.string().optional(),
  roleLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  countryLabel: z.string().optional(),
  productInterestLabel: z.string().optional(),
  quantityLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  submitButton: z.string().optional(),
  submittingButton: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  requiredIndicator: z.string().optional(),
  tradeEnquiryEndpoint: z.string().optional(),
  tradeQuantityPlaceholder: z.string().optional(),
  honeypotTabIndex: z.number().optional(),
  sampleRequestMessage: z.string().optional(),
  enquiryListIntro: z.string().optional(),
  populateEventName: z.string().optional(),
});

const AnalyticsConfigSchema = z.object({
  eventFormSubmission: z.string().optional(),
  paramFormType: z.string().optional(),
  formTypeTrade: z.string().optional(),
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

const TradeEnquiryFormPropsSchema = z.object({
  productList: z.array(ProductItemSchema).optional(),
  formLabels: FormLabelsSchema.optional(),
  analytics: AnalyticsConfigSchema.optional(),
  validation: ValidationConfigSchema.optional(),
  initialProduct: z.string().optional(),
  initialAction: z.string().optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ProductItem = z.infer<typeof ProductItemSchema>;
export type FormLabels = z.infer<typeof FormLabelsSchema>;
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>;
export type ValidationConfig = z.infer<typeof ValidationConfigSchema>;
export type TradeEnquiryFormProps = z.infer<typeof TradeEnquiryFormPropsSchema>;

// Helper type to remove undefined from all properties
type Complete<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_LABELS: Complete<FormLabels> = {
  nameLabel: "Name",
  companyLabel: "Company",
  roleLabel: "Role (Optional)",
  emailLabel: "Email",
  phoneLabel: "Phone",
  countryLabel: "Country",
  productInterestLabel: "Products of Interest",
  quantityLabel: "Estimated Quantity",
  messageLabel: "Message",
  submitButton: "Submit Enquiry",
  submittingButton: "Submitting...",
  successMessage: "Thank you for your enquiry. Our team will contact you shortly.",
  errorMessage: "Something went wrong. Please try again.",
  requiredIndicator: "*",
  tradeEnquiryEndpoint: "/api/contact/trade",
  tradeQuantityPlaceholder: "e.g., 1 MT, 500 kg",
  honeypotTabIndex: -1,
  sampleRequestMessage: "I am interested in requesting a sample for {product}.",
  enquiryListIntro: "Please find the following products in my enquiry:",
  populateEventName: "populateEnquiryForm",
};

const DEFAULT_ANALYTICS: Complete<AnalyticsConfig> = {
  eventFormSubmission: "form_submission",
  paramFormType: "form_type",
  formTypeTrade: "trade_enquiry",
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

export default function TradeEnquiryForm({
  productList,
  formLabels,
  analytics,
  validation,
  initialProduct,
  initialAction,
}: TradeEnquiryFormProps) {
  useLanguage();
  const searchParams = useSearchParams();

  // Runtime prop validation in dev
  if (process.env.NODE_ENV === "development") {
    const result = TradeEnquiryFormPropsSchema.safeParse({
      productList,
      formLabels,
      analytics,
      validation,
      initialProduct,
      initialAction,
    });
    if (!result.success) {
      console.warn("[TradeEnquiryForm] Prop validation warning:", result.error.flatten());
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Merge with defaults
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

  // Localized products list
  const products = useMemo(
    () =>
      productList?.map((p) => ({
        _id: p._id,
        title: p.title,
      })) ?? [],
    [productList]
  );

  // Create validation schema
  const tradeEnquirySchema = useMemo(
    () => createTradeEnquirySchema(validationConfig),
    [validationConfig]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TradeEnquiryInput>({
    resolver: zodResolver(tradeEnquirySchema),
  });

  // Pre-fill email from URL params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [searchParams, setValue]);

  // Handle initial product selection
  useEffect(() => {
    if (initialProduct && products.some((p) => p.title === initialProduct)) {
      setSelectedProducts((prev) => {
        if (prev.includes(initialProduct)) return prev;
        return [...prev, initialProduct];
      });
    }
  }, [initialProduct, products]);

  // Sync selected products with form
  useEffect(() => {
    setValue("productInterest", selectedProducts);
  }, [selectedProducts, setValue]);

  // Handle sample request action
  useEffect(() => {
    if (initialAction === "sample" && initialProduct) {
      const message = labels.sampleRequestMessage.replace("{product}", initialProduct);
      setValue("message", message);
    }
  }, [initialAction, initialProduct, setValue, labels.sampleRequestMessage]);

  // Handle pending enquiry population from session storage
  useEffect(() => {
    const pendingData = sessionStorage.getItem("pendingEnquiryPopulation");
    if (pendingData) {
      try {
        const items = JSON.parse(pendingData) as Array<{
          productTitle: string;
          quantity?: string;
        }>;
        if (items.length > 0) {
          const productTitles = items.map((item) => item.productTitle);
          setSelectedProducts(productTitles);
          setValue("productInterest", productTitles);

          const intro = labels.enquiryListIntro;
          const itemsList = items
            .map((item) => `- ${item.productTitle}${item.quantity ? ` (${item.quantity})` : ""}`)
            .join("\n");
          setValue("message", `${intro}\n${itemsList}`);
        }
        sessionStorage.removeItem("pendingEnquiryPopulation");
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[TradeEnquiryForm] Failed to parse pending data:", error);
        }
        sessionStorage.removeItem("pendingEnquiryPopulation");
      }
    }
  }, [setValue, labels.enquiryListIntro]);

  // Handle populate event from enquiry builder
  useEffect(() => {
    const handlePopulate = () => {
      const items = getEnquiryItems();
      if (items.length > 0) {
        const productTitles = items.map((item) => item.productTitle);
        setSelectedProducts(productTitles);
        setValue("productInterest", productTitles);

        const intro = labels.enquiryListIntro;
        const itemsList = items
          .map((item) => `- ${item.productTitle}${item.quantity ? ` (${item.quantity})` : ""}`)
          .join("\n");
        setValue("message", `${intro}\n${itemsList}`);
      }
    };

    const eventName = labels.populateEventName;
    window.addEventListener(eventName, handlePopulate);
    return () => window.removeEventListener(eventName, handlePopulate);
  }, [setValue, labels.enquiryListIntro, labels.populateEventName]);

  const onSubmit = useCallback(
    async (data: TradeEnquiryInput) => {
      // Honeypot check
      if (data.honeypot) {
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        const response = await fetch(labels.tradeEnquiryEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setSubmitStatus("success");
          reset();
          setSelectedProducts([]);

          trackEvent(analyticsConfig.eventFormSubmission, {
            [analyticsConfig.paramFormType]: analyticsConfig.formTypeTrade,
          });
        } else {
          setSubmitStatus("error");
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[TradeEnquiryForm] Submission error:", error);
        }
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [labels.tradeEnquiryEndpoint, analyticsConfig, reset]
  );

  const toggleProduct = useCallback((productTitle: string) => {
    setSelectedProducts((prev) => {
      const updated = prev.includes(productTitle)
        ? prev.filter((p) => p !== productTitle)
        : [...prev, productTitle];
      return updated;
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot field */}
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={labels.honeypotTabIndex}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label htmlFor="trade-name" className="block text-sm font-medium text-foreground mb-2">
            {labels.nameLabel}{" "}
            <span className="text-red-500" aria-hidden="true">
              {labels.requiredIndicator}
            </span>
          </label>
          <input
            id="trade-name"
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "trade-name-error" : undefined}
          />
          {errors.name ? (
            <p id="trade-name-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        {/* Company Field */}
        <div>
          <label htmlFor="trade-company" className="block text-sm font-medium text-foreground mb-2">
            {labels.companyLabel}{" "}
            <span className="text-red-500" aria-hidden="true">
              {labels.requiredIndicator}
            </span>
          </label>
          <input
            id="trade-company"
            type="text"
            {...register("company")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
              errors.company ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.company ? "true" : "false"}
            aria-describedby={errors.company ? "trade-company-error" : undefined}
          />
          {errors.company ? (
            <p id="trade-company-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.company.message}
            </p>
          ) : null}
        </div>

        {/* Role Field (Optional) */}
        <div>
          <label htmlFor="trade-role" className="block text-sm font-medium text-foreground mb-2">
            {labels.roleLabel}
          </label>
          <input
            id="trade-role"
            type="text"
            {...register("role")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-2 focus:outline-gold transition-colors"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="trade-email" className="block text-sm font-medium text-foreground mb-2">
            {labels.emailLabel}{" "}
            <span className="text-red-500" aria-hidden="true">
              {labels.requiredIndicator}
            </span>
          </label>
          <input
            id="trade-email"
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "trade-email-error" : undefined}
          />
          {errors.email ? (
            <p id="trade-email-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="trade-phone" className="block text-sm font-medium text-foreground mb-2">
            {labels.phoneLabel}{" "}
            <span className="text-red-500" aria-hidden="true">
              {labels.requiredIndicator}
            </span>
          </label>
          <input
            id="trade-phone"
            type="tel"
            {...register("phone")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "trade-phone-error" : undefined}
          />
          {errors.phone ? (
            <p id="trade-phone-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        {/* Country Field */}
        <div>
          <label htmlFor="trade-country" className="block text-sm font-medium text-foreground mb-2">
            {labels.countryLabel}{" "}
            <span className="text-red-500" aria-hidden="true">
              {labels.requiredIndicator}
            </span>
          </label>
          <input
            id="trade-country"
            type="text"
            {...register("country")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.country ? "true" : "false"}
            aria-describedby={errors.country ? "trade-country-error" : undefined}
          />
          {errors.country ? (
            <p id="trade-country-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.country.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Product Interest Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {labels.productInterestLabel}
        </label>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-gray-100 p-4 rounded-xl bg-gray-50/50"
          role="group"
          aria-label="Product selection"
        >
          {products.map((product) => (
            <label
              key={product._id}
              className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all ${
                selectedProducts.includes(product.title)
                  ? "bg-gold/10 border-gold shadow-xs"
                  : "bg-white border-gray-200 hover:border-gold/50 hover:bg-gold/5"
              }`}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.title)}
                  onChange={() => toggleProduct(product.title)}
                  className="peer h-4 w-4 appearance-none rounded border border-gray-300 checked:border-gold checked:bg-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <svg
                  className="pointer-events-none absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground select-none">
                {product.title}
              </span>
            </label>
          ))}
        </div>
        <Controller name="productInterest" control={control} render={() => <></>} />
      </div>

      {/* Quantity Field */}
      <div>
        <label htmlFor="trade-quantity" className="block text-sm font-medium text-foreground mb-2">
          {labels.quantityLabel}
        </label>
        <input
          id="trade-quantity"
          type="text"
          {...register("quantity")}
          placeholder={labels.tradeQuantityPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-2 focus:outline-gold transition-colors"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="trade-message" className="block text-sm font-medium text-foreground mb-2">
          {labels.messageLabel}{" "}
          <span className="text-red-500" aria-hidden="true">
            {labels.requiredIndicator}
          </span>
        </label>
        <textarea
          id="trade-message"
          {...register("message")}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-2 focus:outline-gold transition-colors ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "trade-message-error" : undefined}
        />
        {errors.message ? (
          <p id="trade-message-error" className="mt-1 text-sm text-red-500" role="alert">
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
        className="w-full bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-gold-dark focus:outline-offset-2 active:scale-95 shadow-md hover:shadow-lg"
      >
        {isSubmitting ? labels.submittingButton : labels.submitButton}
      </button>
    </form>
  );
}

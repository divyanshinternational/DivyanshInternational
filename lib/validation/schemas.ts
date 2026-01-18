import { z } from "zod";

// =============================================================================
// VALIDATION CONFIGURATION
// =============================================================================

export interface ValidationConfig {
  nameMinLength: number;
  nameMinError: string;
  emailInvalidError: string;
  messageMinLength: number;
  messageMinError: string;
  companyMinLength: number;
  companyRequiredError: string;
  phoneMinLength: number;
  phoneRequiredError: string;
  countryMinLength: number;
  countryRequiredError: string;
  honeypotMaxLength: number;
}

/**
 * Default validation configuration to use as fallback
 * if CMS data is missing or incomplete.
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  nameMinLength: 2,
  nameMinError: "Name must be at least 2 characters",
  emailInvalidError: "Please enter a valid email address",
  messageMinLength: 10,
  messageMinError: "Message must be at least 10 characters",
  companyMinLength: 2,
  companyRequiredError: "Company name is required",
  phoneMinLength: 6,
  phoneRequiredError: "Phone number is invalid",
  countryMinLength: 2,
  countryRequiredError: "Country is required",
  honeypotMaxLength: 0,
};

// =============================================================================
// SCHEMA FACTORIES
// =============================================================================

export const createGeneralEnquirySchema = (config: ValidationConfig = DEFAULT_VALIDATION_CONFIG) =>
  z.object({
    name: z.string().min(config.nameMinLength, { message: config.nameMinError }),
    email: z.string().email({ message: config.emailInvalidError }),
    phone: z.string().optional(),
    message: z.string().min(config.messageMinLength, { message: config.messageMinError }),
    honeypot: z.string().max(config.honeypotMaxLength).optional(), // Hidden field for spam protection
  });

export const createTradeEnquirySchema = (config: ValidationConfig = DEFAULT_VALIDATION_CONFIG) =>
  z.object({
    name: z.string().min(config.nameMinLength, { message: config.nameMinError }),
    company: z.string().min(config.companyMinLength, { message: config.companyRequiredError }),
    role: z.string().optional(),
    email: z.string().email({ message: config.emailInvalidError }),
    phone: z.string().min(config.phoneMinLength, { message: config.phoneRequiredError }),
    country: z.string().min(config.countryMinLength, { message: config.countryRequiredError }),
    productInterest: z.array(z.string()).optional(),
    quantity: z.string().optional(),
    message: z.string().min(config.messageMinLength, { message: config.messageMinError }),
    honeypot: z.string().max(config.honeypotMaxLength).optional(), // Hidden field for spam protection
  });

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type GeneralEnquirySchema = ReturnType<typeof createGeneralEnquirySchema>;
export type TradeEnquirySchema = ReturnType<typeof createTradeEnquirySchema>;

export type GeneralEnquiryInput = z.infer<GeneralEnquirySchema>;
export type TradeEnquiryInput = z.infer<TradeEnquirySchema>;

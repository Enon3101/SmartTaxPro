/**
 * Input Validation and Sanitization Utilities
 * 
 * SECURITY: Implements OWASP input validation best practices (Req A)
 * - Input canonicalization
 * - Length and format validation
 * - Allow-list approach
 * - Input sanitization
 */

import { z } from "zod";
import DOMPurify from "dompurify";

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  // SECURITY: Prevent XSS by sanitizing HTML content (Req A)
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Disallow all HTML tags for maximum security
    ALLOWED_ATTR: [], // Disallow all attributes
  });
}

/**
 * Sanitize and validate phone number input
 * SECURITY: Only allows valid Indian phone numbers (Req A)
 */
export const phoneSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number too long")
  .refine(
    (val) => /^(\+?91)?[6-9]\d{9}$/.test(val.replace(/[^0-9]/g, "")),
    { message: "Invalid Indian phone number format" }
  )
  .transform(val => val.replace(/[^0-9]/g, "")); // Canonicalize by removing non-numeric chars

/**
 * Validate PAN number format
 * SECURITY: Ensures proper format of Indian PAN numbers (Req A)
 */
export const panSchema = z.string()
  .length(10, "PAN must be exactly 10 characters")
  .refine(
    (val) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val),
    { message: "Invalid PAN format" }
  )
  .transform(val => val.toUpperCase()); // Canonicalize to uppercase

/**
 * Validate Aadhaar number format 
 * SECURITY: Validates proper Aadhaar number format (Req A)
 */
export const aadhaarSchema = z.string()
  .length(12, "Aadhaar must be exactly 12 digits")
  .refine(
    (val) => /^\d{12}$/.test(val),
    { message: "Aadhaar must contain only numbers" }
  );

/**
 * Validate and sanitize generic text input
 * SECURITY: Prevents injection attacks in text fields (Req A)
 */
export const textInputSchema = (
  minLength = 1,
  maxLength = 255,
  fieldName = "Text"
) => 
  z.string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`)
    .transform(sanitizeHtml); // Apply HTML sanitization

/**
 * Validate numeric input with specified range
 * SECURITY: Ensures numeric inputs are within acceptable ranges (Req A)
 */
export const numericInputSchema = (
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  fieldName = "Number"
) =>
  z.number()
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} cannot exceed ${max}`);

/**
 * Validate email addresses
 * SECURITY: Ensures proper email format (Req A)
 */
export const emailSchema = z.string()
  .email("Invalid email address format")
  .max(255, "Email is too long")
  .transform(val => val.toLowerCase()); // Canonicalize to lowercase

/**
 * Validate date input to ensure it's in a valid range
 * SECURITY: Prevents date-based injection attacks (Req A)
 */
export const dateSchema = z.date()
  .refine(
    (date) => !isNaN(date.getTime()),
    { message: "Invalid date" }
  );

/**
 * Validate file uploads to allow only specific file types and sizes
 * SECURITY: Restricts upload of potentially dangerous file types (Req A, H)
 */
export const fileUploadSchema = (
  allowedTypes: string[],
  maxSizeMB: number = 5
) => 
  z.any()
    .refine(
      (file) => file && file.size <= maxSizeMB * 1024 * 1024, 
      { message: `File size must be less than ${maxSizeMB}MB` }
    )
    .refine(
      (file) => file && allowedTypes.includes(file.type),
      { message: `File must be one of these types: ${allowedTypes.join(", ")}` }
    );

/**
 * Generic validator helper function
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result with success flag and data/error 
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error; // Re-throw unexpected errors
  }
}
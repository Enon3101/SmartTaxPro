import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
// SECURITY: Strong schema definition prevents data integrity issues (Req A, G)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(), // SECURITY: Length limit prevents buffer overflow
  password: varchar("password", { length: 255 }).notNull(), // SECURITY: Hash will need space
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 15 }), // SECURITY: Format for Indian phones with country code
  role: varchar("role", { length: 20 }).default("user").notNull(), // SECURITY: Ensure role is always available
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(), // SECURITY: MFA support (Req B)
  lastLogin: timestamp("last_login"), // SECURITY: Track login activity
  loginAttempts: integer("login_attempts").default(0).notNull(), // SECURITY: Track failed login attempts 
  locked: boolean("locked").default(false).notNull(), // SECURITY: Account lockout functionality
  passwordChangedAt: timestamp("password_changed_at").defaultNow(), // SECURITY: Password rotation tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    phoneIdx: index("users_phone_idx").on(table.phone),
    roleIdx: index("users_role_idx").on(table.role),
    emailIdx: index("users_email_idx").on(table.email), // SECURITY: Index for faster lookups
  };
});

// Tax form to store user's tax filing data for Indian ITR
export const taxForms = pgTable("tax_forms", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, filed
  personalInfo: jsonb("personal_info"), // PAN, Aadhaar, personal details
  formType: text("form_type").default("ITR-1"), // ITR-1, ITR-2, ITR-3, ITR-4
  incomeData: jsonb("income_data"), // Salary, house property, capital gains, business income
  deductions80C: jsonb("deductions_80c"), // Section 80C, 80CCC, 80CCD deductions
  deductions80D: jsonb("deductions_80d"), // Health insurance, medical deductions
  otherDeductions: jsonb("other_deductions"), // Other deduction sections
  taxPaid: jsonb("tax_paid"), // TDS, TCS, advance tax
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  assessmentYear: text("assessment_year").default("2024-25"), // Current assessment year
}, (table) => {
  return {
    userIdIdx: index("tax_forms_user_id_idx").on(table.userId),
    statusIdx: index("tax_forms_status_idx").on(table.status),
    formTypeIdx: index("tax_forms_form_type_idx").on(table.formType),
    assessmentYearIdx: index("tax_forms_assessment_year_idx").on(table.assessmentYear)
  };
});

// OTP verification codes
// SECURITY: Enhanced OTP handling for MFA (Req B)
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 15 }).notNull(), // SECURITY: Indian phone format with country code
  otp: varchar("otp", { length: 100 }).notNull(), // SECURITY: Store hashed OTP, not plaintext
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(), // SECURITY: Track failed verification attempts
  ipAddress: varchar("ip_address", { length: 45 }), // SECURITY: Track requestor IP for fraud detection
  userAgent: varchar("user_agent", { length: 500 }), // SECURITY: Track requestor device info
}, (table) => {
  return {
    phoneIdx: index("otp_verifications_phone_idx").on(table.phone),
    expiresAtIdx: index("otp_verifications_expires_at_idx").on(table.expiresAt),
    createdAtIdx: index("otp_verifications_created_at_idx").on(table.createdAt),
    ipAddressIdx: index("otp_verifications_ip_address_idx").on(table.ipAddress), // SECURITY: Fast lookup for fraud patterns
  };
});

// Tax documents uploaded by users
// SECURITY: Enhanced document storage with security controls (Req H)
export const documents = pgTable("documents", {
  id: varchar("id", { length: 40 }).primaryKey(), // SECURITY: Limited length nanoid
  taxFormId: text("tax_form_id").references(() => taxForms.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(), // SECURITY: Limit filename length
  type: varchar("type", { length: 100 }).notNull(), // MIME type
  size: integer("size").notNull(),
  documentType: varchar("document_type", { length: 50 }).notNull(), // W-2, 1099, etc.
  url: varchar("url", { length: 1000 }).notNull(), // SECURITY: Presigned URL with token
  contentHash: varchar("content_hash", { length: 64 }), // SECURITY: SHA-256 hash for integrity check
  virusScanned: boolean("virus_scanned").default(false), // SECURITY: Track virus scan status
  scanResult: varchar("scan_result", { length: 50 }), // SECURITY: Result of security scan
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // SECURITY: Document access expiration
  uploadedBy: integer("uploaded_by").references(() => users.id), // SECURITY: Track who uploaded
}, (table) => {
  return {
    taxFormIdIdx: index("documents_tax_form_id_idx").on(table.taxFormId),
    documentTypeIdx: index("documents_document_type_idx").on(table.documentType),
    uploadedAtIdx: index("documents_uploaded_at_idx").on(table.uploadedAt),
    uploadedByIdx: index("documents_uploaded_by_idx").on(table.uploadedBy), // SECURITY: Index for accountability
    contentHashIdx: index("documents_content_hash_idx").on(table.contentHash), // SECURITY: Fast integrity checks
  };
});

// Blog posts for the learning resources section
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  featuredImage: text("featured_image"),
  category: text("category").notNull().default("Tax"),
  tags: text("tags").array(),
  readTime: integer("read_time").notNull(), // in minutes
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("blog_posts_slug_idx").on(table.slug),
    authorIdIdx: index("blog_posts_author_id_idx").on(table.authorId),
    categoryIdx: index("blog_posts_category_idx").on(table.category),
    publishedIdx: index("blog_posts_published_idx").on(table.published),
    createdAtIdx: index("blog_posts_created_at_idx").on(table.createdAt),
  };
});

// Schema for inserting users
// SECURITY: Input validation at schema level (Req A)
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  mfaEnabled: true,
}).extend({
  // SECURITY: Additional validation rules
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_.]+$/),
  password: z.string().min(8).max(100), // Will be hashed before storage
  email: z.string().email().optional().nullable(),
  phone: z.string().regex(/^(\+?91)?[6-9]\d{9}$/).optional().nullable(), // Indian phone format
});

// Schema for OTP verification
// SECURITY: Enhanced OTP validation (Req B)
export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).pick({
  phone: true,
  otp: true,
  expiresAt: true,
  ipAddress: true,
  userAgent: true,
  attempts: true,
  verified: true,
}).extend({
  // SECURITY: Additional validation rules
  phone: z.string().regex(/^(\+?91)?[6-9]\d{9}$/), // Indian phone format
  otp: z.string(), // Will store hash, not the plaintext OTP
  ipAddress: z.string().ip().optional(),
});

// Schema for inserting tax forms
export const insertTaxFormSchema = createInsertSchema(taxForms).pick({
  id: true,
  userId: true,
  status: true,
  formType: true,
  assessmentYear: true,
});

// Schema for inserting documents
// SECURITY: Enhanced document validation (Req H)
export const insertDocumentSchema = createInsertSchema(documents).pick({
  id: true,
  taxFormId: true,
  name: true,
  type: true,
  size: true,
  documentType: true,
  url: true,
  contentHash: true,
  virusScanned: true,
  scanResult: true,
  uploadedBy: true,
  expiresAt: true,
}).extend({
  // SECURITY: Additional document validation rules
  type: z.string().refine((mime) => {
    // SECURITY: Whitelist approach for MIME types (Req A, H)
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv'
    ];
    return allowedTypes.includes(mime);
  }, { message: "File type not allowed" }),
  size: z.number().max(10 * 1024 * 1024), // SECURITY: Max 10MB file size
  name: z.string().trim().min(1).max(255), // SECURITY: Sanitize filename
});

// Schema for inserting blog posts
export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  authorId: true,
  featuredImage: true,
  category: true,
  tags: true,
  readTime: true,
  published: true,
});

// Types for the schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTaxForm = z.infer<typeof insertTaxFormSchema>;
export type TaxForm = typeof taxForms.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

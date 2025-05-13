import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"), // Added phone number field
  role: text("role").default("user"), // user or admin
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    phoneIdx: index("users_phone_idx").on(table.phone),
    roleIdx: index("users_role_idx").on(table.role),
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
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
}, (table) => {
  return {
    phoneIdx: index("otp_verifications_phone_idx").on(table.phone),
    expiresAtIdx: index("otp_verifications_expires_at_idx").on(table.expiresAt),
    createdAtIdx: index("otp_verifications_created_at_idx").on(table.createdAt),
  };
});

// Tax documents uploaded by users
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  taxFormId: text("tax_form_id").references(() => taxForms.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // MIME type
  size: integer("size").notNull(),
  documentType: text("document_type").notNull(), // W-2, 1099, etc.
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
}, (table) => {
  return {
    taxFormIdIdx: index("documents_tax_form_id_idx").on(table.taxFormId),
    documentTypeIdx: index("documents_document_type_idx").on(table.documentType),
    uploadedAtIdx: index("documents_uploaded_at_idx").on(table.uploadedAt),
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
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
});

// Schema for OTP verification
export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).pick({
  phone: true,
  otp: true,
  expiresAt: true,
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
export const insertDocumentSchema = createInsertSchema(documents).pick({
  id: true,
  taxFormId: true,
  name: true,
  type: true,
  size: true,
  documentType: true,
  url: true,
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

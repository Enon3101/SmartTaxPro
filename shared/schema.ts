import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").defaultNow(),
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
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Schema for inserting tax forms
export const insertTaxFormSchema = createInsertSchema(taxForms).pick({
  id: true,
  userId: true,
  status: true,
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

// Types for the schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTaxForm = z.infer<typeof insertTaxFormSchema>;
export type TaxForm = typeof taxForms.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

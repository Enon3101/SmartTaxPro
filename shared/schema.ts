import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar, timestamp, pgEnum, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Define an enum for user roles
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Define the users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).unique(), // Added username
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }), // Added phone
  role: userRoleEnum('role').default('user').notNull(),
  googleId: text('google_id').unique(), // Added googleId
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(), // Added mfaEnabled
  profileImageUrl: text('profile_image_url'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    emailIndex: uniqueIndex('email_idx').on(table.email),
    usernameIndex: uniqueIndex('username_idx').on(table.username),
    googleIdIndex: uniqueIndex('google_id_idx').on(table.googleId),
  };
});

// Export derived types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

// Export Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  // Add other specific Zod refinements if needed, e.g., for password complexity if not handled elsewhere
});
export const selectUserSchema = createSelectSchema(users);


// Define other tables and their types as needed, for example:
export const taxForms = pgTable('tax_forms', {
  id: varchar('id', { length: 128 }).primaryKey(), // Assuming nanoid or similar
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('in_progress').notNull(), // e.g., in_progress, completed, filed
  formType: varchar('form_type', { length: 20 }), // e.g., ITR-1, ITR-2
  assessmentYear: varchar('assessment_year', { length: 10 }), // e.g., 2023-24
  personalInfo: text('personal_info'), // JSON string or use jsonb for actual JSON
  incomeData: text('income_data'),     // JSON string
  deductions80C: text('deductions_80c'), // JSON string
  deductions80D: text('deductions_80d'), // JSON string
  otherDeductions: text('other_deductions'), // JSON string
  taxPaid: text('tax_paid'),           // JSON string
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type TaxForm = InferSelectModel<typeof taxForms>;
export type InsertTaxForm = InferInsertModel<typeof taxForms>;

export const insertTaxFormSchema = createInsertSchema(taxForms);
export const selectTaxFormSchema = createSelectSchema(taxForms);

export const documents = pgTable('documents', {
  id: varchar('id', { length: 128 }).primaryKey(),
  taxFormId: varchar('tax_form_id', { length: 128 }).references(() => taxForms.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }), // MIME type
  size: serial('size'), // size in bytes
  documentType: varchar('document_type', { length: 100 }), // User-defined type e.g., Form 16, PAN
  url: text('url').notNull(), // URL to the stored file (e.g., S3 URL)
  uploadedAt: timestamp('uploaded_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type Document = InferSelectModel<typeof documents>;
export type InsertDocument = InferInsertModel<typeof documents>;

export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);

export const otpVerifications = pgTable('otp_verifications', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull(),
  otp: text('otp').notNull(), // Store hashed OTP
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type OtpVerification = InferSelectModel<typeof otpVerifications>;
export type InsertOtpVerification = InferInsertModel<typeof otpVerifications>;

export const insertOtpVerificationSchema = createInsertSchema(otpVerifications);
export const selectOtpVerificationSchema = createSelectSchema(otpVerifications);

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull(),
  authorId: serial('author_id').references(() => users.id, { onDelete: 'set null' }), // Link to users table
  featuredImage: text('featured_image_url'),
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags'), // Comma-separated or JSON array string
  readTime: serial('read_time'), // in minutes
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type BlogPost = InferSelectModel<typeof blogPosts>;
export type InsertBlogPost = InferInsertModel<typeof blogPosts>;

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);


// You can add other tables or schemas here as the project grows.
// For example, if you had a profiles table related to users:
/*
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fullName: varchar('full_name', { length: 255 }),
  // ... other profile fields
});
*/

// It's also a good practice to define relations if you have multiple tables
/*
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  // if a user can have multiple posts, for example
  // posts: many(posts),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
*/

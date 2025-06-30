import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  pgEnum, 
  boolean, 
  uniqueIndex,
  index,
  jsonb,
  integer,
  bigint,
  inet
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Define an enum for user roles
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// File Management Enums
export const fileTypeEnum = pgEnum('file_type', [
  'PDF', 'DOCX', 'DOC', 'XLSX', 'XLS', 'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP',
  'TXT', 'CSV', 'ZIP', 'RAR', '7Z', 'MP4', 'AVI', 'MOV'
]);

export const fileCategoryEnum = pgEnum('file_category', [
  'TAX_DOCUMENT', 'INSURANCE_DOCUMENT', 'MEDICLAIM_DOCUMENT', 
  'USER_PROFILE_IMAGE', 'BLOG_IMAGE', 'WEBSITE_ASSET', 
  'REPORT_TEMPLATE', 'SYSTEM_BACKUP', 'TEMP_FILE'
]);

export const storageProviderEnum = pgEnum('storage_provider', [
  'LOCAL', 'AWS_S3', 'GOOGLE_CLOUD', 'AZURE_BLOB', 'CLOUDFLARE_R2'
]);

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended', 'pending_verification']);
export const loginMethodEnum = pgEnum('login_method', ['email_password', 'google_oauth', 'phone_otp', 'biometric']);

// Define the users table with enhanced indexing
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').default('user').notNull(),
  googleId: text('google_id').unique(),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  profileImageUrl: text('profile_image_url'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    emailIndex: uniqueIndex('email_idx').on(table.email),
    usernameIndex: uniqueIndex('username_idx').on(table.username),
    googleIdIndex: uniqueIndex('google_id_idx').on(table.googleId),
    phoneIndex: index('phone_idx').on(table.phone),
    roleIndex: index('role_idx').on(table.role),
    createdAtIndex: index('users_created_at_idx').on(table.createdAt),
  };
});

// Enhanced tax forms table with JSONB for better performance
export const taxForms = pgTable('tax_forms', {
  id: varchar('id', { length: 128 }).primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('in_progress').notNull(),
  formType: varchar('form_type', { length: 20 }),
  assessmentYear: varchar('assessment_year', { length: 10 }),
  
  // JSONB fields for better performance and querying
  personalInfo: jsonb('personal_info'),
  incomeData: jsonb('income_data'),
  deductions80C: jsonb('deductions_80c'),
  deductions80D: jsonb('deductions_80d'),
  otherDeductions: jsonb('other_deductions'),
  taxPaid: jsonb('tax_paid'),
  
  // Computed fields for faster queries
  totalIncome: integer('total_income'),
  totalTax: integer('total_tax'),
  refundAmount: integer('refund_amount'),
  
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdStatusIndex: index('tax_forms_user_id_status_idx').on(table.userId, table.status),
    assessmentYearIndex: index('tax_forms_assessment_year_idx').on(table.assessmentYear),
    formTypeIndex: index('tax_forms_form_type_idx').on(table.formType),
    createdAtIndex: index('tax_forms_created_at_idx').on(table.createdAt),
    statusIndex: index('tax_forms_status_idx').on(table.status),
    totalIncomeIndex: index('tax_forms_total_income_idx').on(table.totalIncome),
  };
});

// Enhanced documents table
export const documents = pgTable('documents', {
  id: varchar('id', { length: 128 }).primaryKey(),
  taxFormId: varchar('tax_form_id', { length: 128 }).references(() => taxForms.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }),
  size: integer('size'),
  documentType: varchar('document_type', { length: 100 }),
  url: text('url').notNull(),
  uploadedAt: timestamp('uploaded_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    taxFormIdIndex: index('documents_tax_form_id_idx').on(table.taxFormId),
    userIdIndex: index('documents_user_id_idx').on(table.userId),
    documentTypeIndex: index('documents_document_type_idx').on(table.documentType),
    uploadedAtIndex: index('documents_uploaded_at_idx').on(table.uploadedAt),
  };
});

// Enhanced OTP table with better indexing
export const otpVerifications = pgTable('otp_verifications', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull(),
  otp: text('otp').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    phoneExpiresIndex: index('otp_phone_expires_idx').on(table.phone, table.expiresAt),
    verifiedIndex: index('otp_verified_idx').on(table.verified),
    createdAtIndex: index('otp_created_at_idx').on(table.createdAt),
  };
});

// Enhanced blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'set null' }),
  featuredImage: text('featured_image_url'),
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags'), // JSONB array for better querying
  readTime: integer('read_time'),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    slugIndex: uniqueIndex('blog_posts_slug_idx').on(table.slug),
    publishedPublishedAtIndex: index('blog_posts_published_published_at_idx').on(table.published, table.publishedAt),
    categoryIndex: index('blog_posts_category_idx').on(table.category),
    authorIdIndex: index('blog_posts_author_id_idx').on(table.authorId),
    createdAtIndex: index('blog_posts_created_at_idx').on(table.createdAt),
  };
});

// Performance analytics table
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 128 }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  metric: varchar('metric', { length: 50 }).notNull(), // 'LCP', 'FID', 'CLS', etc.
  value: integer('value').notNull(),
  url: text('url'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    metricTimestampIndex: index('perf_metric_timestamp_idx').on(table.metric, table.timestamp),
    userIdIndex: index('perf_user_id_idx').on(table.userId),
    sessionIdIndex: index('perf_session_id_idx').on(table.sessionId),
  };
});

// Main Files Table
export const files = pgTable('files', {
  id: varchar('id', { length: 128 }).primaryKey(),
  originalName: varchar('original_name', { length: 500 }).notNull(),
  storedName: varchar('stored_name', { length: 500 }).notNull(),
  filePath: text('file_path').notNull(),
  fileType: fileTypeEnum('file_type').notNull(),
  fileCategory: fileCategoryEnum('file_category').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  mimeType: varchar('mime_type', { length: 255 }),
  
  // Storage Information
  storageProvider: storageProviderEnum('storage_provider').default('LOCAL'),
  storageBucket: varchar('storage_bucket', { length: 255 }),
  storageRegion: varchar('storage_region', { length: 100 }),
  cdnUrl: text('cdn_url'),
  
  // Security & Access
  isPublic: boolean('is_public').default(false),
  accessLevel: varchar('access_level', { length: 50 }).default('private'),
  encryptionKeyId: varchar('encryption_key_id', { length: 255 }),
  checksumMd5: varchar('checksum_md5', { length: 32 }),
  checksumSha256: varchar('checksum_sha256', { length: 64 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  tags: jsonb('tags'),
  
  // Ownership & Relations
  uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  organizationId: integer('organization_id'),
  parentEntityType: varchar('parent_entity_type', { length: 50 }),
  parentEntityId: varchar('parent_entity_id', { length: 128 }),
  
  // Lifecycle Management
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  deletedBy: integer('deleted_by').references(() => users.id, { onDelete: 'set null' }),
  
  // Timestamps
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  lastAccessedAt: timestamp('last_accessed_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    categoryIndex: index('files_category_idx').on(table.fileCategory),
    typeIndex: index('files_type_idx').on(table.fileType),
    uploadedByIndex: index('files_uploaded_by_idx').on(table.uploadedBy),
    parentEntityIndex: index('files_parent_entity_idx').on(table.parentEntityType, table.parentEntityId),
    createdAtIndex: index('files_created_at_idx').on(table.createdAt),
    storageProviderIndex: index('files_storage_provider_idx').on(table.storageProvider),
    isDeletedIndex: index('files_is_deleted_idx').on(table.isDeleted),
  };
});

// File Versions
export const fileVersions = pgTable('file_versions', {
  id: serial('id').primaryKey(),
  fileId: varchar('file_id', { length: 128 }).references(() => files.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: integer('version_number').notNull(),
  storedName: varchar('stored_name', { length: 500 }).notNull(),
  filePath: text('file_path').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  checksumMd5: varchar('checksum_md5', { length: 32 }),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    fileIdVersionIndex: uniqueIndex('file_versions_file_id_version_idx').on(table.fileId, table.versionNumber),
    fileIdIndex: index('file_versions_file_id_idx').on(table.fileId),
  };
});

// File Access Logs
export const fileAccessLogs = pgTable('file_access_logs', {
  id: serial('id').primaryKey(),
  fileId: varchar('file_id', { length: 128 }).references(() => files.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  accessType: varchar('access_type', { length: 50 }).notNull(),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  accessedAt: timestamp('accessed_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    fileIdIndex: index('file_access_logs_file_id_idx').on(table.fileId),
    accessedAtIndex: index('file_access_logs_accessed_at_idx').on(table.accessedAt),
    userIdIndex: index('file_access_logs_user_id_idx').on(table.userId),
  };
});

// File Permissions
export const filePermissions = pgTable('file_permissions', {
  id: serial('id').primaryKey(),
  fileId: varchar('file_id', { length: 128 }).references(() => files.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permissionType: varchar('permission_type', { length: 50 }).notNull(),
  grantedBy: integer('granted_by').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    fileUserPermissionIndex: uniqueIndex('file_permissions_file_user_permission_idx').on(table.fileId, table.userId, table.permissionType),
    fileIdIndex: index('file_permissions_file_id_idx').on(table.fileId),
    userIdIndex: index('file_permissions_user_id_idx').on(table.userId),
  };
});

// User Sessions
export const userSessions = pgTable('user_sessions', {
  id: varchar('id', { length: 128 }).primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deviceInfo: jsonb('device_info'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  loginMethod: loginMethodEnum('login_method'),
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  lastActivityAt: timestamp('last_activity_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIndex: index('user_sessions_user_id_idx').on(table.userId),
    expiresAtIndex: index('user_sessions_expires_at_idx').on(table.expiresAt),
    isActiveIndex: index('user_sessions_is_active_idx').on(table.isActive),
  };
});

// User Activity Logs
export const userActivityLogs = pgTable('user_activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 128 }).references(() => userSessions.id, { onDelete: 'set null' }),
  activityType: varchar('activity_type', { length: 100 }).notNull(),
  activityDescription: text('activity_description'),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: varchar('entity_id', { length: 128 }),
  metadata: jsonb('metadata'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIndex: index('user_activity_logs_user_id_idx').on(table.userId),
    createdAtIndex: index('user_activity_logs_created_at_idx').on(table.createdAt),
    activityTypeIndex: index('user_activity_logs_activity_type_idx').on(table.activityType),
  };
});

// Admin Permissions
export const adminPermissions = pgTable('admin_permissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  module: varchar('module', { length: 100 }).notNull(),
  permissions: jsonb('permissions').notNull(),
  grantedBy: integer('granted_by').references(() => users.id, { onDelete: 'set null' }),
  grantedAt: timestamp('granted_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userModuleIndex: uniqueIndex('admin_permissions_user_module_idx').on(table.userId, table.module),
    userIdIndex: index('admin_permissions_user_id_idx').on(table.userId),
  };
});

// Define relations for better querying
export const usersRelations = relations(users, ({ many }) => ({
  taxForms: many(taxForms),
  documents: many(documents),
  blogPosts: many(blogPosts),
  performanceMetrics: many(performanceMetrics),
  uploadedFiles: many(files, { relationName: 'uploadedFiles' }),
  deletedFiles: many(files, { relationName: 'deletedFiles' }),
  userSessions: many(userSessions),
  userActivityLogs: many(userActivityLogs),
  adminPermissions: many(adminPermissions),
  grantedPermissions: many(adminPermissions, { relationName: 'grantedPermissions' }),
  filePermissions: many(filePermissions),
  grantedFilePermissions: many(filePermissions, { relationName: 'grantedFilePermissions' }),
}));

export const taxFormsRelations = relations(taxForms, ({ one, many }) => ({
  user: one(users, {
    fields: [taxForms.userId],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  taxForm: one(taxForms, {
    fields: [documents.taxFormId],
    references: [taxForms.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  uploader: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
    relationName: 'uploadedFiles'
  }),
  deletedByUser: one(users, {
    fields: [files.deletedBy],
    references: [users.id],
    relationName: 'deletedFiles'
  }),
  versions: many(fileVersions),
  accessLogs: many(fileAccessLogs),
  permissions: many(filePermissions),
}));

export const fileVersionsRelations = relations(fileVersions, ({ one }) => ({
  file: one(files, {
    fields: [fileVersions.fileId],
    references: [files.id],
  }),
  creator: one(users, {
    fields: [fileVersions.createdBy],
    references: [users.id],
  }),
}));

export const fileAccessLogsRelations = relations(fileAccessLogs, ({ one }) => ({
  file: one(files, {
    fields: [fileAccessLogs.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [fileAccessLogs.userId],
    references: [users.id],
  }),
}));

export const filePermissionsRelations = relations(filePermissions, ({ one }) => ({
  file: one(files, {
    fields: [filePermissions.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [filePermissions.userId],
    references: [users.id],
  }),
  grantedBy: one(users, {
    fields: [filePermissions.grantedBy],
    references: [users.id],
    relationName: 'grantedFilePermissions'
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
  activityLogs: many(userActivityLogs),
}));

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [userActivityLogs.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [userActivityLogs.sessionId],
    references: [userSessions.id],
  }),
}));

export const adminPermissionsRelations = relations(adminPermissions, ({ one }) => ({
  user: one(users, {
    fields: [adminPermissions.userId],
    references: [users.id],
  }),
  grantedBy: one(users, {
    fields: [adminPermissions.grantedBy],
    references: [users.id],
    relationName: 'grantedPermissions'
  }),
}));

// Export types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export type TaxForm = InferSelectModel<typeof taxForms>;
export type InsertTaxForm = InferInsertModel<typeof taxForms>;
export type Document = InferSelectModel<typeof documents>;
export type InsertDocument = InferInsertModel<typeof documents>;
export type OtpVerification = InferSelectModel<typeof otpVerifications>;
export type InsertOtpVerification = InferInsertModel<typeof otpVerifications>;
export type BlogPost = InferSelectModel<typeof blogPosts>;
export type InsertBlogPost = InferInsertModel<typeof blogPosts>;
export type PerformanceMetric = InferSelectModel<typeof performanceMetrics>;
export type InsertPerformanceMetric = InferInsertModel<typeof performanceMetrics>;

// New File Management Types
export type File = InferSelectModel<typeof files>;
export type InsertFile = InferInsertModel<typeof files>;
export type FileVersion = InferSelectModel<typeof fileVersions>;
export type InsertFileVersion = InferInsertModel<typeof fileVersions>;
export type FileAccessLog = InferSelectModel<typeof fileAccessLogs>;
export type InsertFileAccessLog = InferInsertModel<typeof fileAccessLogs>;
export type FilePermission = InferSelectModel<typeof filePermissions>;
export type InsertFilePermission = InferInsertModel<typeof filePermissions>;
export type UserSession = InferSelectModel<typeof userSessions>;
export type InsertUserSession = InferInsertModel<typeof userSessions>;
export type UserActivityLog = InferSelectModel<typeof userActivityLogs>;
export type InsertUserActivityLog = InferInsertModel<typeof userActivityLogs>;
export type AdminPermission = InferSelectModel<typeof adminPermissions>;
export type InsertAdminPermission = InferInsertModel<typeof adminPermissions>;

// Export Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10).max(15).optional(),
});
export const selectUserSchema = createSelectSchema(users);

export const insertTaxFormSchema = createInsertSchema(taxForms, {
  assessmentYear: z.string().regex(/^\d{4}-\d{2}$/, "Invalid assessment year format"),
});
export const selectTaxFormSchema = createSelectSchema(taxForms);

export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);

export const insertOtpVerificationSchema = createInsertSchema(otpVerifications);
export const selectOtpVerificationSchema = createSelectSchema(otpVerifications);

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics);
export const selectPerformanceMetricSchema = createSelectSchema(performanceMetrics);

// File Management Zod Schemas
export const insertFileSchema = createInsertSchema(files);
export const selectFileSchema = createSelectSchema(files);

export const insertFileVersionSchema = createInsertSchema(fileVersions);
export const selectFileVersionSchema = createSelectSchema(fileVersions);

export const insertFileAccessLogSchema = createInsertSchema(fileAccessLogs);
export const selectFileAccessLogSchema = createSelectSchema(fileAccessLogs);

export const insertFilePermissionSchema = createInsertSchema(filePermissions);
export const selectFilePermissionSchema = createSelectSchema(filePermissions);

export const insertUserSessionSchema = createInsertSchema(userSessions);
export const selectUserSessionSchema = createSelectSchema(userSessions);

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs);
export const selectUserActivityLogSchema = createSelectSchema(userActivityLogs);

export const insertAdminPermissionSchema = createInsertSchema(adminPermissions);
export const selectAdminPermissionSchema = createSelectSchema(adminPermissions);


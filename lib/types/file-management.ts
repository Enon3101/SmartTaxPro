// File Management Types and Interfaces

// File Type Enums
export type FileType = 
  | 'PDF' | 'DOCX' | 'DOC' | 'XLSX' | 'XLS' 
  | 'JPG' | 'JPEG' | 'PNG' | 'GIF' | 'WEBP'
  | 'TXT' | 'CSV' | 'ZIP' | 'RAR' | '7Z' 
  | 'MP4' | 'AVI' | 'MOV';

export type FileCategory = 
  | 'TAX_DOCUMENT' | 'INSURANCE_DOCUMENT' | 'MEDICLAIM_DOCUMENT'
  | 'USER_PROFILE_IMAGE' | 'BLOG_IMAGE' | 'WEBSITE_ASSET'
  | 'REPORT_TEMPLATE' | 'SYSTEM_BACKUP' | 'TEMP_FILE';

export type StorageProvider = 
  | 'LOCAL' | 'AWS_S3' | 'GOOGLE_CLOUD' | 'AZURE_BLOB' | 'CLOUDFLARE_R2';

export type AccessLevel = 'public' | 'private' | 'restricted';

export type PermissionType = 'read' | 'write' | 'delete' | 'share';

export type AccessType = 'download' | 'view' | 'share' | 'delete' | 'upload';

// File Management Interfaces
export interface FileUploadRequest {
  file: File | Buffer;
  originalName: string;
  category: FileCategory;
  parentEntityType?: string;
  parentEntityId?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isPublic?: boolean;
  accessLevel?: AccessLevel;
  storageProvider?: StorageProvider;
}

export interface FileUploadResponse {
  id: string;
  originalName: string;
  storedName: string;
  filePath: string;
  fileType: FileType;
  fileCategory: FileCategory;
  fileSize: number;
  mimeType: string;
  cdnUrl?: string;
  uploadedAt: Date;
  uploadedBy: number;
}

export interface FileDownloadRequest {
  fileId: string;
  userId: number;
  generateThumbnail?: boolean;
}

export interface FileDownloadResponse {
  buffer: Buffer;
  contentType: string;
  filename: string;
  fileSize: number;
  lastModified: Date;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  pages?: number;
  author?: string;
  title?: string;
  subject?: string;
  extractedText?: string;
  [key: string]: any;
}

export interface FilePermissionRequest {
  fileId: string;
  userId: number;
  permissionType: PermissionType;
  expiresAt?: Date;
  grantedBy: number;
}

export interface FileShareRequest {
  fileId: string;
  shareWithUsers: number[];
  permissions: PermissionType[];
  expiresAt?: Date;
  message?: string;
}

export interface FileSearchFilters {
  category?: FileCategory;
  fileType?: FileType;
  uploadedBy?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  parentEntityType?: string;
  parentEntityId?: string;
  isDeleted?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface FileSearchResult {
  files: FileRecord[];
  total: number;
  hasMore: boolean;
}

export interface FileRecord {
  id: string;
  originalName: string;
  storedName: string;
  filePath: string;
  fileType: FileType;
  fileCategory: FileCategory;
  fileSize: number;
  mimeType: string;
  storageProvider: StorageProvider;
  storageBucket?: string;
  storageRegion?: string;
  cdnUrl?: string;
  isPublic: boolean;
  accessLevel: AccessLevel;
  encryptionKeyId?: string;
  checksumMd5: string;
  checksumSha256: string;
  metadata?: FileMetadata;
  tags?: string[];
  uploadedBy: number;
  organizationId?: number;
  parentEntityType?: string;
  parentEntityId?: string;
  expiresAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
}

export interface FileVersionRecord {
  id: number;
  fileId: string;
  versionNumber: number;
  storedName: string;
  filePath: string;
  fileSize: number;
  checksumMd5: string;
  createdBy: number;
  createdAt: Date;
}

export interface FileAccessLogRecord {
  id: number;
  fileId: string;
  userId: number;
  accessType: AccessType;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  accessedAt: Date;
}

export interface FilePermissionRecord {
  id: number;
  fileId: string;
  userId: number;
  permissionType: PermissionType;
  grantedBy: number;
  expiresAt?: Date;
  createdAt: Date;
}

// Storage Provider Interfaces
export interface StorageUploadRequest {
  file: Buffer;
  fileName: string;
  category: FileCategory;
  contentType?: string;
}

export interface StorageUploadResult {
  path: string;
  url: string;
  cdnUrl?: string;
}

export interface IStorageProvider {
  upload(request: StorageUploadRequest): Promise<StorageUploadResult>;
  download(filePath: string): Promise<Buffer>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
  getCdnUrl?(filePath: string): string;
}

// Analytics and Reporting
export interface FileAnalytics {
  totalFiles: number;
  totalSize: number;
  filesByCategory: Record<FileCategory, number>;
  filesByType: Record<FileType, number>;
  uploadTrends: {
    date: string;
    count: number;
    size: number;
  }[];
  topUploaders: {
    userId: number;
    userName: string;
    fileCount: number;
    totalSize: number;
  }[];
  storageByProvider: Record<StorageProvider, {
    fileCount: number;
    totalSize: number;
  }>;
}

export interface FileUsageReport {
  fileId: string;
  fileName: string;
  totalAccesses: number;
  uniqueUsers: number;
  lastAccessed: Date;
  accessHistory: {
    date: string;
    accessCount: number;
  }[];
}

// Utility Types
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileProcessingJob {
  id: string;
  fileId: string;
  jobType: 'thumbnail' | 'metadata_extraction' | 'virus_scan' | 'compression';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Configuration Types
export interface FileStorageConfig {
  maxFileSize: number;
  allowedFileTypes: FileType[];
  allowedCategories: FileCategory[];
  defaultStorageProvider: StorageProvider;
  enableVersioning: boolean;
  enableVirusScan: boolean;
  enableThumbnails: boolean;
  thumbnailSizes: number[];
  cdnEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface StorageProviderConfig {
  provider: StorageProvider;
  config: {
    region?: string;
    bucket?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
    [key: string]: any;
  };
}

// Error Types
export class FileManagementError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'FileManagementError';
  }
}

export class FileNotFoundError extends FileManagementError {
  constructor(fileId: string) {
    super(`File with ID ${fileId} not found`, 'FILE_NOT_FOUND', 404);
  }
}

export class FileAccessDeniedError extends FileManagementError {
  constructor(fileId: string, userId: number) {
    super(`Access denied to file ${fileId} for user ${userId}`, 'FILE_ACCESS_DENIED', 403);
  }
}

export class FileUploadError extends FileManagementError {
  constructor(message: string) {
    super(message, 'FILE_UPLOAD_ERROR', 400);
  }
}

export class FileValidationError extends FileManagementError {
  constructor(message: string) {
    super(message, 'FILE_VALIDATION_ERROR', 400);
  }
}

export class StorageProviderError extends FileManagementError {
  constructor(message: string, provider: StorageProvider) {
    super(`Storage provider ${provider} error: ${message}`, 'STORAGE_PROVIDER_ERROR', 500);
  }
} 
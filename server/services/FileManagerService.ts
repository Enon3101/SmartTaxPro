import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, and, desc, asc, count, sql, ilike, between, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import sharp from 'sharp';
import { files, fileVersions, fileAccessLogs, filePermissions, users } from '../../shared/schema';
import { 
  FileUploadRequest, 
  FileUploadResponse, 
  FileDownloadRequest, 
  FileDownloadResponse,
  FileRecord,
  FileSearchFilters,
  FileSearchResult,
  FilePermissionRequest,
  FileShareRequest,
  FileCategory,
  FileType,
  StorageProvider,
  AccessType,
  PermissionType,
  FileAnalytics,
  FileUsageReport,
  IStorageProvider,
  FileNotFoundError,
  FileAccessDeniedError,
  FileUploadError,
  StorageProviderError,
  FileValidationError
} from '../../lib/types/file-management';
import { db as rawDb } from '../db';
import { S3StorageProvider } from '../storageProviders/S3StorageProvider';
// import { trace } from '@opentelemetry/api';

// Ensure non-null database instance for compile-time strictness; will throw at runtime if missing
const db = rawDb as NonNullable<typeof rawDb>;

export class FileManagerService {
  private storageProviders: Map<StorageProvider, IStorageProvider> = new Map();
  private uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    this.initializeUploadDirectory();
    this.initializeStorageProviders();
  }

  private async initializeUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  private initializeStorageProviders(): void {
    // Initialize local storage provider
    this.storageProviders.set('LOCAL', new LocalStorageProvider(this.uploadPath));
    
    // Initialize cloud providers based on environment variables
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET) {
      this.storageProviders.set('AWS_S3', new S3StorageProvider());
    }
    
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_KEY_FILE) {
      // this.storageProviders.set('GOOGLE_CLOUD', new GCSStorageProvider());
    }
  }

  // File Upload Methods
  async uploadFile(request: FileUploadRequest, uploadedBy: number): Promise<FileUploadResponse> {
    try {
      const fileId = nanoid();
      let fileBuffer: Buffer;
      if (Buffer.isBuffer(request.file)) {
        fileBuffer = request.file;
      } else {
        // In Node.js we may not have DOM File; treat as any with arrayBuffer method
        // @ts-ignore – allow browser File type
        const arrBuf = await (request.file as any).arrayBuffer();
        fileBuffer = Buffer.from(arrBuf);
      }
      
      // Validate file
      await this.validateFile(fileBuffer, request);
      
      // Determine file type and generate stored name
      const fileType = this.getFileType(request.originalName);
      const storedName = this.generateStoredName(request.originalName, fileId);
      const mimeType = mime.lookup(request.originalName) || 'application/octet-stream';
      
      // Calculate checksums
      const checksumMd5 = crypto.createHash('md5').update(fileBuffer).digest('hex');
      const checksumSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Upload to storage provider
      const storageProvider: StorageProvider = request.storageProvider || (process.env.FILE_STORAGE_PROVIDER as StorageProvider) || 'LOCAL';
      const provider = this.storageProviders.get(storageProvider);
      if (!provider) {
        throw new StorageProviderError('Storage provider not configured', storageProvider);
      }

      const uploadResult = await provider.upload({
        file: fileBuffer,
        fileName: storedName,
        category: request.category,
        contentType: mimeType
      });

      // Extract metadata
      const metadata = await this.extractFileMetadata(fileBuffer, fileType);

      // Save to database
      const dbAny: any = db; // Non-null assertion for compile
      const fileRecord = await dbAny.insert(files).values({
        id: fileId,
        originalName: request.originalName,
        storedName,
        filePath: uploadResult.path,
        fileType,
        fileCategory: request.category,
        fileSize: fileBuffer.length,
        mimeType,
        storageProvider,
        cdnUrl: uploadResult.cdnUrl,
        isPublic: request.isPublic || false,
        accessLevel: request.accessLevel || 'private',
        checksumMd5,
        checksumSha256,
        metadata,
        tags: request.tags || [],
        uploadedBy,
        parentEntityType: request.parentEntityType,
        parentEntityId: request.parentEntityId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessedAt: new Date()
      }).returning();

      // Log the upload activity
      await this.logFileAccess(fileId, uploadedBy, 'upload', true);

      return {
        id: fileId,
        originalName: request.originalName,
        storedName,
        filePath: uploadResult.path,
        fileType,
        fileCategory: request.category,
        fileSize: fileBuffer.length,
        mimeType,
        cdnUrl: uploadResult.cdnUrl,
        uploadedAt: new Date(),
        uploadedBy
      };

    } catch (error) {
      const msg = (error as Error)?.message ?? 'Unknown error';
      throw new FileUploadError(`Upload failed: ${msg}`);
    }
  }

  // File Download Methods
  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    const fileRecord = await this.getFileById(request.fileId);
    
    if (!fileRecord) {
      throw new FileNotFoundError(request.fileId);
    }

    // Check permissions
    const hasAccess = await this.checkFileAccess(request.fileId, request.userId, 'read');
    if (!hasAccess) {
      throw new FileAccessDeniedError(request.fileId, request.userId);
    }

    try {
      const provider = this.storageProviders.get(fileRecord.storageProvider);
      if (!provider) {
        throw new StorageProviderError('Storage provider not available', fileRecord.storageProvider);
      }

      const fileBuffer = await provider.download(fileRecord.filePath);
      
      // Update last accessed time
      await db.update(files)
        .set({ 
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(files.id, request.fileId));

      // Log the download activity
      await this.logFileAccess(request.fileId, request.userId, 'download', true);

      return {
        buffer: fileBuffer,
        contentType: fileRecord.mimeType,
        filename: fileRecord.originalName,
        fileSize: fileRecord.fileSize,
        lastModified: fileRecord.updatedAt
      };

    } catch (error) {
      const msg = (error as Error)?.message ?? 'Unknown error';
      await this.logFileAccess(request.fileId, request.userId, 'download', false, msg);
      throw error;
    }
  }

  // File Search and Management
  async searchFiles(filters: FileSearchFilters): Promise<FileSearchResult> {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    let query: any = db.select().from(files);
    let countQuery: any = db.select({ count: count() }).from(files);

    // Apply filters
    const conditions = [];
    
    if (filters.category) {
      conditions.push(eq(files.fileCategory, filters.category));
    }
    
    if (filters.fileType) {
      conditions.push(eq(files.fileType, filters.fileType));
    }
    
    if (filters.uploadedBy) {
      conditions.push(eq(files.uploadedBy, filters.uploadedBy));
    }
    
    if (filters.parentEntityType && filters.parentEntityId) {
      conditions.push(
        and(
          eq(files.parentEntityType, filters.parentEntityType),
          eq(files.parentEntityId, filters.parentEntityId)
        )
      );
    }
    
    if (filters.isDeleted !== undefined) {
      conditions.push(eq(files.isDeleted, filters.isDeleted));
    } else {
      conditions.push(eq(files.isDeleted, false)); // Default to non-deleted files
    }
    
    if (filters.dateRange) {
      conditions.push(
        between(files.createdAt, filters.dateRange.start, filters.dateRange.end)
      );
    }
    
    if (filters.searchTerm) {
      conditions.push(
        ilike(files.originalName, `%${filters.searchTerm}%`)
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(
        sql`${files.tags} @> ${JSON.stringify(filters.tags)}`
      );
    }

    if (conditions.length > 0) {
      // @ts-ignore – Drizzle type interference
      query = query.where(and(...conditions));
      // @ts-ignore – Drizzle type interference
      countQuery = countQuery.where(and(...conditions));
    }

    // Execute queries
    const [fileResults, totalResults] = await Promise.all([
      query
        .orderBy(desc(files.createdAt))
        .limit(limit)
        .offset(offset),
      countQuery
    ]);

    const total = totalResults[0]?.count || 0;

    return {
      files: fileResults as FileRecord[],
      total,
      hasMore: offset + fileResults.length < total
    };
  }

  // File Permissions Management
  async grantFilePermission(request: FilePermissionRequest): Promise<void> {
    const fileRecord = await this.getFileById(request.fileId);
    if (!fileRecord) {
      throw new FileNotFoundError(request.fileId);
    }

    // Check if grantor has permission to grant access
    const hasAccess = await this.checkFileAccess(request.fileId, request.grantedBy, 'share');
    if (!hasAccess && fileRecord.uploadedBy !== request.grantedBy) {
      throw new FileAccessDeniedError(request.fileId, request.grantedBy);
    }

    await db.insert(filePermissions).values({
      fileId: request.fileId,
      userId: request.userId,
      permissionType: request.permissionType,
      grantedBy: request.grantedBy,
      expiresAt: request.expiresAt,
      createdAt: new Date()
    }).onConflictDoUpdate({
      target: [filePermissions.fileId, filePermissions.userId, filePermissions.permissionType],
      set: {
        grantedBy: request.grantedBy,
        expiresAt: request.expiresAt,
        createdAt: new Date()
      }
    });
  }

  async revokeFilePermission(fileId: string, userId: number, permissionType: PermissionType, revokedBy: number): Promise<void> {
    const fileRecord = await this.getFileById(fileId);
    if (!fileRecord) {
      throw new FileNotFoundError(fileId);
    }

    // Check if revoker has permission
    const hasAccess = await this.checkFileAccess(fileId, revokedBy, 'share');
    if (!hasAccess && fileRecord.uploadedBy !== revokedBy) {
      throw new FileAccessDeniedError(fileId, revokedBy);
    }

    await db.delete(filePermissions)
      .where(
        and(
          eq(filePermissions.fileId, fileId),
          eq(filePermissions.userId, userId),
          eq(filePermissions.permissionType, permissionType)
        )
      );
  }

  async shareFileWithUsers(request: FileShareRequest): Promise<void> {
    for (const userId of request.shareWithUsers) {
      for (const permission of request.permissions) {
        await this.grantFilePermission({
          fileId: request.fileId,
          userId,
          permissionType: permission,
          expiresAt: request.expiresAt,
          grantedBy: 0 // This should be set by the calling function
        });
      }
    }
  }

  // File Analytics and Reporting
  async getFileAnalytics(userId?: number): Promise<FileAnalytics> {
    const baseQuery = db.select().from(files);
    const query = userId ? baseQuery.where(eq(files.uploadedBy, userId)) : baseQuery;

    const [fileStats, categoryCounts, typeCounts] = await Promise.all([
      db.select({
        totalFiles: count(),
        totalSize: sql<number>`sum(${files.fileSize})`
      }).from(files).where(eq(files.isDeleted, false)),
      
      db.select({
        category: files.fileCategory,
        count: count()
      }).from(files)
        .where(eq(files.isDeleted, false))
        .groupBy(files.fileCategory),
      
      db.select({
        type: files.fileType,
        count: count()
      }).from(files)
        .where(eq(files.isDeleted, false))
        .groupBy(files.fileType)
    ]);

    // Aggregate results
    const filesByCategory: Record<FileCategory, number> = {} as Record<FileCategory, number>;
    categoryCounts.forEach(item => {
      filesByCategory[item.category] = item.count;
    });

    const filesByType: Record<FileType, number> = {} as Record<FileType, number>;
    typeCounts.forEach(item => {
      filesByType[item.type] = item.count;
    });

    return {
      totalFiles: fileStats[0]?.totalFiles || 0,
      totalSize: fileStats[0]?.totalSize || 0,
      filesByCategory,
      filesByType,
      uploadTrends: [], // TODO: Implement upload trends
      topUploaders: [], // TODO: Implement top uploaders
      storageByProvider: {} as any // TODO: Implement storage by provider
    };
  }

  // Helper Methods
  private async validateFile(fileBuffer: Buffer, request: FileUploadRequest): Promise<void> {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileBuffer.length > maxSize) {
      throw new FileValidationError('File size exceeds maximum allowed size');
    }

    const fileType = this.getFileType(request.originalName);
    const allowedTypes: FileType[] = [
      'PDF', 'DOCX', 'DOC', 'XLSX', 'XLS', 
      'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP',
      'TXT', 'CSV'
    ];

    if (!allowedTypes.includes(fileType)) {
      throw new FileValidationError(`File type ${fileType} is not allowed`);
    }
  }

  private getFileType(filename: string): FileType {
    const ext = path.extname(filename).toLowerCase().slice(1);
    const typeMap: Record<string, FileType> = {
      'pdf': 'PDF',
      'docx': 'DOCX',
      'doc': 'DOC',
      'xlsx': 'XLSX',
      'xls': 'XLS',
      'jpg': 'JPG',
      'jpeg': 'JPEG',
      'png': 'PNG',
      'gif': 'GIF',
      'webp': 'WEBP',
      'txt': 'TXT',
      'csv': 'CSV',
      'zip': 'ZIP',
      'rar': 'RAR',
      '7z': '7Z',
      'mp4': 'MP4',
      'avi': 'AVI',
      'mov': 'MOV'
    };

    return typeMap[ext] || 'TXT';
  }

  private generateStoredName(originalName: string, fileId: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    return `${fileId}_${timestamp}${ext}`;
  }

  private async extractFileMetadata(fileBuffer: Buffer, fileType: FileType): Promise<any> {
    const metadata: any = {};

    try {
      if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(fileType)) {
        const imageInfo = await sharp(fileBuffer).metadata();
        metadata.width = imageInfo.width;
        metadata.height = imageInfo.height;
        metadata.format = imageInfo.format;
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }

    return metadata;
  }

  private async getFileById(fileId: string): Promise<FileRecord | null> {
    const result = await db.select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1);

    return result[0] as FileRecord || null;
  }

  private async checkFileAccess(fileId: string, userId: number, permissionType: PermissionType): Promise<boolean> {
    const fileRecord = await this.getFileById(fileId);
    if (!fileRecord) return false;

    // File owner has all permissions
    if (fileRecord.uploadedBy === userId) return true;

    // Check if file is public and permission is read
    if (fileRecord.isPublic && permissionType === 'read') return true;

    // Check explicit permissions
    const permission = await db.select()
      .from(filePermissions)
      .where(
        and(
          eq(filePermissions.fileId, fileId),
          eq(filePermissions.userId, userId),
          eq(filePermissions.permissionType, permissionType)
        )
      )
      .limit(1);

    if (permission.length === 0) return false;

    // Check if permission has expired
    const perm = permission[0];
    if (perm.expiresAt && new Date() > perm.expiresAt) return false;

    return true;
  }

  private async logFileAccess(
    fileId: string, 
    userId: number, 
    accessType: AccessType, 
    success: boolean, 
    errorMessage?: string
  ): Promise<void> {
    // Persist in DB
    await db.insert(fileAccessLogs).values({
      fileId,
      userId,
      accessType,
      success,
      errorMessage,
      accessedAt: new Date()
    });

    // Emit OTel event if span active
    // const span = trace.getActiveSpan();
    // if (span) {
    //   span.addEvent('file.access', {
    //     'file.id': fileId,
    //     'user.id': userId,
    //     'file.access_type': accessType,
    //     'file.access_success': success,
    //   });
    // }
  }

  // Soft delete – marks record deleted, keeps physical file; cleanup job handles purge
  async softDeleteFile(fileId: string, deletedBy: number): Promise<void> {
    // const span = trace.getTracer('file-manager').startSpan('softDeleteFile');
    try {
      await db.update(files)
        .set({ isDeleted: true, deletedAt: new Date(), deletedBy })
        .where(eq(files.id, fileId));

      await this.logFileAccess(fileId, deletedBy, 'delete', true);
      // span.setStatus({ code: 1 });
    } catch (error) {
      await this.logFileAccess(fileId, deletedBy, 'delete', false, (error as Error).message);
      // span.setStatus({ code: 2, message: (error as Error).message });
      throw error;
    } finally {
      // span.end();
    }
  }
}

// Local Storage Provider Implementation
class LocalStorageProvider implements IStorageProvider {
  constructor(private basePath: string) {}

  async upload(request: any): Promise<any> {
    const categoryDir = path.join(this.basePath, request.category.toLowerCase());
    await fs.mkdir(categoryDir, { recursive: true });
    
    const filePath = path.join(categoryDir, request.fileName);
    await fs.writeFile(filePath, request.file);
    
    return {
      path: path.relative(this.basePath, filePath),
      url: `/api/files/download/${request.fileName}`,
      cdnUrl: undefined
    };
  }

  async download(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return await fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  getUrl(filePath: string): string {
    return `/api/files/download/${path.basename(filePath)}`;
  }
}

// Export singleton instance
export const fileManagerService = new FileManagerService();

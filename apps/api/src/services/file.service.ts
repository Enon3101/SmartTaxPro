import { PrismaClient, FileCategory } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const STORAGE_PATH = process.env.STORAGE_PATH || './uploads';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_REGION || 'us-east-1';

// Initialize S3 client if using cloud storage
const s3Client = STORAGE_TYPE !== 'local' ? new S3Client({
  region: S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
}) : null;

// File type validations
const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'text/plain': ['txt'],
  'text/csv': ['csv'],
  'application/zip': ['zip'],
  'application/x-rar-compressed': ['rar'],
  'application/x-7z-compressed': ['7z'],
};

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

export class FileService {
  /**
   * Configure multer for file uploads
   */
  static getMulterConfig() {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadDir = path.join(STORAGE_PATH, 'temp');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    });

    const fileFilter = (req: any, file: any, cb: any) => {
      const allowedMimeTypes = Object.keys(ALLOWED_FILE_TYPES);
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });
  }

  /**
   * Upload file to storage (local or S3)
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: number,
    category: FileCategory,
    metadata?: any
  ) {
    try {
      // Generate unique file ID and storage name
      const fileId = crypto.randomBytes(16).toString('hex');
      const fileExt = path.extname(file.originalname);
      const storedName = `${fileId}${fileExt}`;
      
      // Calculate checksums
      const fileBuffer = await fs.readFile(file.path);
      const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');
      const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      let storagePath: string;
      let storageUrl: string | null = null;
      let cdnUrl: string | null = null;
      
      if (STORAGE_TYPE === 'local') {
        // Local storage
        const categoryDir = path.join(STORAGE_PATH, category.toLowerCase());
        await fs.mkdir(categoryDir, { recursive: true });
        
        storagePath = path.join(categoryDir, storedName);
        await fs.rename(file.path, storagePath);
        
        storageUrl = `/files/${category.toLowerCase()}/${storedName}`;
      } else {
        // S3 storage
        const s3Key = `${category.toLowerCase()}/${storedName}`;
        
        await s3Client!.send(new PutObjectCommand({
          Bucket: S3_BUCKET_NAME!,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: file.mimetype,
          Metadata: {
            originalName: file.originalname,
            uploadedBy: userId.toString(),
          },
        }));
        
        storagePath = s3Key;
        
        // Generate signed URL for private files
        if (!this.isPublicCategory(category)) {
          storageUrl = await getSignedUrl(
            s3Client!,
            new GetObjectCommand({
              Bucket: S3_BUCKET_NAME!,
              Key: s3Key,
            }),
            { expiresIn: 3600 } // 1 hour
          );
        } else {
          // Public URL for public files
          cdnUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;
        }
        
        // Clean up temp file
        await fs.unlink(file.path);
      }
      
      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          id: fileId,
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: file.size,
          category,
          storageProvider: STORAGE_TYPE,
          storagePath,
          storageUrl,
          cdnUrl,
          isPublic: this.isPublicCategory(category),
          checksumMd5: md5,
          checksumSha256: sha256,
          uploadedById: userId,
          metadata,
        },
      });
      
      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'file.upload',
          resource: 'file',
          resourceId: fileId,
          metadata: {
            fileName: file.originalname,
            fileSize: file.size,
            category,
          },
        },
      });
      
      return fileRecord;
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(file.path);
      } catch {}
      
      throw error;
    }
  }

  /**
   * Get file by ID with access check
   */
  async getFile(fileId: string, userId?: number) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    if (!file) {
      throw new Error('File not found');
    }
    
    // Check access permissions
    if (!file.isPublic && userId !== file.uploadedById) {
      // Check if user has permission to view any file
      const hasPermission = userId ? await this.hasFilePermission(userId, 'file.read.any') : false;
      if (!hasPermission) {
        throw new Error('Access denied');
      }
    }
    
    // Generate fresh signed URL if needed
    if (STORAGE_TYPE !== 'local' && !file.isPublic && !file.cdnUrl) {
      file.storageUrl = await getSignedUrl(
        s3Client!,
        new GetObjectCommand({
          Bucket: S3_BUCKET_NAME!,
          Key: file.storagePath,
        }),
        { expiresIn: 3600 }
      );
    }
    
    // Log access
    await prisma.fileAccessLog.create({
      data: {
        fileId,
        userId,
        accessType: 'view',
        success: true,
      },
    });
    
    // Update last accessed time
    await prisma.file.update({
      where: { id: fileId },
      data: { lastAccessedAt: new Date() },
    });
    
    return file;
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string, userId: number) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });
    
    if (!file) {
      throw new Error('File not found');
    }
    
    // Check permissions
    const canDeleteAny = await this.hasFilePermission(userId, 'file.delete.any');
    if (file.uploadedById !== userId && !canDeleteAny) {
      throw new Error('Access denied');
    }
    
    // Delete from storage
    if (STORAGE_TYPE === 'local') {
      await fs.unlink(file.storagePath);
    } else {
      await s3Client!.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME!,
        Key: file.storagePath,
      }));
    }
    
    // Mark as deleted in database (soft delete)
    await prisma.file.update({
      where: { id: fileId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'file.delete',
        resource: 'file',
        resourceId: fileId,
        metadata: {
          fileName: file.originalName,
        },
      },
    });
  }

  /**
   * Check if category should be public
   */
  private isPublicCategory(category: FileCategory): boolean {
    return category === FileCategory.BLOG_IMAGE;
  }

  /**
   * Check if user has file permission
   */
  private async hasFilePermission(userId: number, permission: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        permissions: true,
      },
    });
    
    if (!user) return false;
    
    const rolePermissions = user.roles.flatMap(ur =>
      ur.role.permissions.map(rp => rp.permission.name)
    );
    
    const directPermissions = user.permissions.map(p => p.name);
    const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];
    
    return allPermissions.includes(permission);
  }
}
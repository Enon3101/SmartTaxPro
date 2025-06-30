import express, { Request, Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { fileManagerService } from './services/FileManagerService';
import { 
  FileUploadRequest, 
  FileSearchFilters, 
  FilePermissionRequest,
  FileShareRequest,
  ApiResponse,
  PaginatedResponse,
  FileRecord,
  FileNotFoundError,
  FileAccessDeniedError,
  FileUploadError,
  FileValidationError,
  StorageProviderError
} from '../lib/types/file-management';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'text/csv'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

// Rate limiting for file operations
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 uploads per windowMs
  message: 'Too many uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 downloads per windowMs
  message: 'Too many downloads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to extract user ID from request (assuming JWT auth)
const getUserId = (req: Request): number => {
  // This should extract user ID from JWT token or session
  // For now, we'll use a placeholder
  const user = (req as any).user;
  if (!user || !user.id) {
    throw new Error('Authentication required');
  }
  return user.id;
};

// Error handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: any) => Promise<any>) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Response helper
const sendResponse = <T>(res: Response, success: boolean, data?: T, message?: string, error?: string) => {
  const response: ApiResponse<T> = {
    success,
    data,
    message,
    error
  };
  res.json(response);
};

// 1. File Upload Routes
/**
 * @route   POST /api/v1/files/upload
 * @desc    Upload single file
 * @access  Private
 */
router.post('/upload', uploadLimiter, upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    const uploadRequest: FileUploadRequest = {
      file: file.buffer,
      originalName: file.originalname,
      category: req.body.category || 'TAX_DOCUMENT',
      parentEntityType: req.body.parentEntityType,
      parentEntityId: req.body.parentEntityId,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
      tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      isPublic: req.body.isPublic === 'true',
      accessLevel: req.body.accessLevel || 'private',
      storageProvider: req.body.storageProvider || 'LOCAL'
    };

    const result = await fileManagerService.uploadFile(uploadRequest, userId);
    sendResponse(res, true, result, 'File uploaded successfully');

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof FileUploadError || error instanceof FileValidationError) {
      return res.status(400).json({ success: false, error: error.message });
    }
    
    if (error instanceof StorageProviderError) {
      return res.status(500).json({ success: false, error: 'Storage service unavailable' });
    }
    
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
}));

/**
 * @route   POST /api/v1/files/upload/multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post('/upload/multiple', uploadLimiter, upload.array('files', 5), asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files provided' });
    }

    const uploadPromises = files.map(async (file) => {
      const uploadRequest: FileUploadRequest = {
        file: file.buffer,
        originalName: file.originalname,
        category: req.body.category || 'TAX_DOCUMENT',
        parentEntityType: req.body.parentEntityType,
        parentEntityId: req.body.parentEntityId,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
        isPublic: req.body.isPublic === 'true',
        accessLevel: req.body.accessLevel || 'private',
        storageProvider: req.body.storageProvider || 'LOCAL'
      };

      return await fileManagerService.uploadFile(uploadRequest, userId);
    });

    const results = await Promise.all(uploadPromises);
    sendResponse(res, true, results, `${results.length} files uploaded successfully`);

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
}));

// 2. File Download Routes
/**
 * @route   GET /api/v1/files/:fileId/download
 * @desc    Download file by ID
 * @access  Private
 */
router.get('/:fileId/download', downloadLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { fileId } = req.params;

    const result = await fileManagerService.downloadFile({
      fileId,
      userId,
      generateThumbnail: req.query.thumbnail === 'true'
    });

    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.fileSize.toString(),
      'Content-Disposition': `attachment; filename="${result.filename}"`,
      'Last-Modified': result.lastModified.toUTCString(),
      'Cache-Control': 'no-cache'
    });

    res.send(result.buffer);

  } catch (error) {
    console.error('Download error:', error);
    
    if (error instanceof FileNotFoundError) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    if (error instanceof FileAccessDeniedError) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.status(500).json({ success: false, error: 'Download failed' });
  }
}));

/**
 * @route   GET /api/v1/files/:fileId/preview
 * @desc    Preview file (inline display)
 * @access  Private
 */
router.get('/:fileId/preview', downloadLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { fileId } = req.params;

    const result = await fileManagerService.downloadFile({
      fileId,
      userId
    });

    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.fileSize.toString(),
      'Content-Disposition': `inline; filename="${result.filename}"`,
      'Last-Modified': result.lastModified.toUTCString(),
      'Cache-Control': 'public, max-age=3600'
    });

    res.send(result.buffer);

  } catch (error) {
    console.error('Preview error:', error);
    
    if (error instanceof FileNotFoundError) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    if (error instanceof FileAccessDeniedError) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.status(500).json({ success: false, error: 'Preview failed' });
  }
}));

// 3. File Search and Management Routes
/**
 * @route   GET /api/v1/files/search
 * @desc    Search files with filters
 * @access  Private
 */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  try {
    const filters: FileSearchFilters = {
      category: req.query.category as any,
      fileType: req.query.fileType as any,
      uploadedBy: req.query.uploadedBy ? parseInt(req.query.uploadedBy as string) : undefined,
      parentEntityType: req.query.parentEntityType as string,
      parentEntityId: req.query.parentEntityId as string,
      isDeleted: req.query.isDeleted ? req.query.isDeleted === 'true' : undefined,
      searchTerm: req.query.searchTerm as string,
      tags: req.query.tags ? JSON.parse(req.query.tags as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    if (req.query.startDate && req.query.endDate) {
      filters.dateRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string)
      };
    }

    const result = await fileManagerService.searchFiles(filters);
    
    const paginatedResponse: PaginatedResponse<FileRecord> = {
      items: result.files,
      total: result.total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
      limit: filters.limit || 20,
      hasMore: result.hasMore
    };

    sendResponse(res, true, paginatedResponse, 'Files retrieved successfully');

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
}));

/**
 * @route   GET /api/v1/files/my-files
 * @desc    Get current user's files
 * @access  Private
 */
router.get('/my-files', asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    
    const filters: FileSearchFilters = {
      uploadedBy: userId,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      category: req.query.category as any,
      searchTerm: req.query.searchTerm as string
    };

    const result = await fileManagerService.searchFiles(filters);
    sendResponse(res, true, result, 'User files retrieved successfully');

  } catch (error) {
    console.error('My files error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve files' });
  }
}));

// 4. File Permissions Routes
/**
 * @route   POST /api/v1/files/:fileId/permissions
 * @desc    Grant file permission to user
 * @access  Private
 */
router.post('/:fileId/permissions', asyncHandler(async (req: Request, res: Response) => {
  try {
    const grantedBy = getUserId(req);
    const { fileId } = req.params;

    const permissionRequest: FilePermissionRequest = {
      fileId,
      userId: req.body.userId,
      permissionType: req.body.permissionType,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
      grantedBy
    };

    await fileManagerService.grantFilePermission(permissionRequest);
    sendResponse(res, true, null, 'Permission granted successfully');

  } catch (error) {
    console.error('Grant permission error:', error);
    
    if (error instanceof FileNotFoundError) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    if (error instanceof FileAccessDeniedError) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.status(500).json({ success: false, error: 'Failed to grant permission' });
  }
}));

/**
 * @route   DELETE /api/v1/files/:fileId/permissions/:userId/:permissionType
 * @desc    Revoke file permission from user
 * @access  Private
 */
router.delete('/:fileId/permissions/:userId/:permissionType', asyncHandler(async (req: Request, res: Response) => {
  try {
    const revokedBy = getUserId(req);
    const { fileId, userId, permissionType } = req.params;

    await fileManagerService.revokeFilePermission(
      fileId, 
      parseInt(userId), 
      permissionType as any, 
      revokedBy
    );

    sendResponse(res, true, null, 'Permission revoked successfully');

  } catch (error) {
    console.error('Revoke permission error:', error);
    
    if (error instanceof FileNotFoundError) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    if (error instanceof FileAccessDeniedError) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.status(500).json({ success: false, error: 'Failed to revoke permission' });
  }
}));

/**
 * @route   POST /api/v1/files/:fileId/share
 * @desc    Share file with multiple users
 * @access  Private
 */
router.post('/:fileId/share', asyncHandler(async (req: Request, res: Response) => {
  try {
    const sharedBy = getUserId(req);
    const { fileId } = req.params;

    const shareRequest: FileShareRequest = {
      fileId,
      shareWithUsers: req.body.userIds,
      permissions: req.body.permissions,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
      message: req.body.message
    };

    // Set the sharedBy user in the permission requests
    for (const userId of shareRequest.shareWithUsers) {
      for (const permission of shareRequest.permissions) {
        await fileManagerService.grantFilePermission({
          fileId,
          userId,
          permissionType: permission,
          expiresAt: shareRequest.expiresAt,
          grantedBy: sharedBy
        });
      }
    }

    sendResponse(res, true, null, 'File shared successfully');

  } catch (error) {
    console.error('Share file error:', error);
    res.status(500).json({ success: false, error: 'Failed to share file' });
  }
}));

// 5. File Analytics Routes
/**
 * @route   GET /api/v1/files/analytics
 * @desc    Get file analytics
 * @access  Private (Admin)
 */
router.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const analytics = await fileManagerService.getFileAnalytics(userId);
    sendResponse(res, true, analytics, 'Analytics retrieved successfully');

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics' });
  }
}));

// 6. File Information Routes
/**
 * @route   GET /api/v1/files/:fileId/info
 * @desc    Get file information
 * @access  Private
 */
router.get('/:fileId/info', asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { fileId } = req.params;

    // This would need to be implemented in the service
    // const fileInfo = await fileManagerService.getFileInfo(fileId, userId);
    // sendResponse(res, true, fileInfo, 'File info retrieved successfully');

    res.status(501).json({ success: false, error: 'Not implemented yet' });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve file info' });
  }
}));

// Error handling middleware
router.use((error: Error, req: Request, res: Response, next: Function) => {
  console.error('File management route error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Too many files' });
    }
  }
  
  res.status(500).json({ success: false, error: 'Internal server error' });
});

export default router;

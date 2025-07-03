import { Router } from 'express';
import { PrismaClient, FileCategory } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requirePermission } from '../middleware/auth.middleware.js';
import { FileService } from '../services/file.service.js';

const router = Router();
const prisma = new PrismaClient();
const fileService = new FileService();

// Configure multer
const upload = FileService.getMulterConfig();

// Validation schemas
const fileUploadSchema = z.object({
  category: z.nativeEnum(FileCategory),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /api/files/upload
 * Upload a new file
 */
router.post(
  '/upload',
  authenticate,
  requirePermission('file.upload'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const validatedData = fileUploadSchema.parse(req.body);
      
      const file = await fileService.uploadFile(
        req.file,
        req.user!.userId,
        validatedData.category,
        validatedData.metadata
      );
      
      res.status(201).json(file);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      }
      
      if (error.message.includes('File type')) {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

/**
 * GET /api/files
 * List files with pagination and filters
 */
router.get('/', authenticate, requirePermission('file.read'), async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const where: any = {
      isDeleted: false,
    };
    
    // Non-admin users can only see their own files
    const canReadAny = await hasPermission(req.user!.userId, 'file.read.any');
    if (!canReadAny) {
      where.uploadedById = req.user!.userId;
    }
    
    if (category) {
      where.category = category;
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: parseInt(limit as string),
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.file.count({ where }),
    ]);
    
    res.json({
      files,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/files/:id
 * Get a single file
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const file = await fileService.getFile(req.params.id, req.user!.userId);
    res.json(file);
  } catch (error: any) {
    if (error.message === 'File not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/files/:id
 * Delete a file
 */
router.delete('/:id', authenticate, requirePermission('file.delete'), async (req, res) => {
  try {
    await fileService.deleteFile(req.params.id, req.user!.userId);
    res.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    if (error.message === 'File not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function
async function hasPermission(userId: number, permission: string): Promise<boolean> {
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

export default router;
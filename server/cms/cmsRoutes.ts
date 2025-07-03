import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

import { UserRole, authorizeRole, AuthenticatedRequest } from '../auth';
import { storage } from '../storage';
import { insertBlogPostSchema } from '../../shared/schema';

const router = Router();

// Initialize DOM for server-side DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Rate limiting for CMS operations
const cmsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 CMS requests per windowMs
  message: { error: 'Too many CMS requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 uploads per windowMs
  message: { error: 'Too many upload requests from this IP, please try again later.' },
});

// Apply rate limiting to all CMS routes
router.use(cmsRateLimit);

// Authentication middleware
const authenticateJwt = passport.authenticate('jwt', { session: false });

// Enhanced authorization middleware that checks database role
const authorizeRoleSecure = (requiredRole: UserRole) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Verify user exists and has required role in database
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Check role hierarchy (admin can do author actions, super_admin can do admin actions)
      const roleHierarchy = {
        user: 1,
        author: 2,
        admin: 3,
        super_admin: 4
      };

      const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 5;

      if (userLevel < requiredLevel) {
        return res.status(403).json({ error: `Forbidden: Requires ${requiredRole} role or higher` });
      }

      // Add verified user to request
      req.user = { ...req.user, ...user };
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};

// Input validation schemas
const blogPostCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary too long'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  tags: z.string().max(200, 'Tags too long').optional(),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  readTime: z.number().min(1).max(60).optional(),
  published: z.boolean().default(false),
  seoTitle: z.string().max(60, 'SEO title too long').optional(),
  seoDescription: z.string().max(160, 'SEO description too long').optional(),
  seoKeywords: z.string().max(200, 'SEO keywords too long').optional(),
});

const blogPostUpdateSchema = blogPostCreateSchema.partial();

// Secure file upload configuration
const createSecureUpload = (destination: string, allowedTypes: string[]) => {
  const uploadDir = path.join(process.cwd(), 'uploads', destination);
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // File type signatures for validation
  const FILE_SIGNATURES: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
  };

  return multer({
    storage: multer.memoryStorage(), // Store in memory for validation
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      files: 1, // Single file upload
    },
    fileFilter: (req, file, cb) => {
      // Check MIME type
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`File type ${file.mimetype} not allowed`));
      }

      // Validate file name
      const sanitizedName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '');
      if (sanitizedName !== path.basename(file.originalname)) {
        return cb(new Error('Invalid characters in filename'));
      }

      cb(null, true);
    },
  });
};

// Content sanitization function
const sanitizeContent = (content: string): string => {
  return purify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
      'tr', 'td', 'th', 'code', 'pre', 'div', 'span'
    ],
    ALLOWED_ATTR: {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class'],
      'span': ['class'],
      'code': ['class'],
      'pre': ['class'],
    },
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

// Validate file content by magic numbers
const validateFileContent = (buffer: Buffer, mimeType: string): boolean => {
  const FILE_SIGNATURES: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
  };

  const signature = FILE_SIGNATURES[mimeType];
  if (!signature) return false;

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }

  return true;
};

// =============================================================================
// BLOG MANAGEMENT ROUTES
// =============================================================================

// Get all blog posts (with filtering and pagination)
router.get('/blog/posts', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      searchTerm,
      published,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string))); // Max 50 posts per page
    const offset = (pageNum - 1) * limitNum;

    const options: any = {
      limit: limitNum,
      offset,
      published: published ? published === 'true' : undefined,
    };

    // Add filters with validation
    if (category && typeof category === 'string' && category.length <= 50) {
      options.category = category;
    }

    if (searchTerm && typeof searchTerm === 'string' && searchTerm.length <= 100) {
      // Sanitize search term to prevent injection
      options.searchTerm = searchTerm.replace(/[<>'"]/g, '');
    }

    if (authorId && typeof authorId === 'string') {
      const authorIdNum = parseInt(authorId);
      if (!isNaN(authorIdNum)) {
        options.authorId = authorIdNum;
      }
    }

    const result = await storage.getAllBlogPosts(options);

    res.json({
      posts: result.posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug or ID
router.get('/blog/posts/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let post;

    // Check if identifier is numeric (ID) or string (slug)
    if (/^\d+$/.test(identifier)) {
      post = await storage.getBlogPostById(parseInt(identifier));
    } else {
      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(identifier)) {
        return res.status(400).json({ error: 'Invalid slug format' });
      }
      post = await storage.getBlogPostBySlug(identifier);
    }

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // If not published, require admin access
    if (!post.published) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      // Quick admin check (full middleware not needed for GET)
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await storage.getUser(decoded.sub);
        
        if (!user || !['admin', 'super_admin', 'author'].includes(user.role)) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
      } catch {
        return res.status(404).json({ error: 'Blog post not found' });
      }
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create new blog post (Authors and Admins)
router.post('/blog/posts', authenticateJwt, authorizeRoleSecure(UserRole.AUTHOR), async (req: AuthenticatedRequest, res) => {
  try {
    // Validate input
    const validatedData = blogPostCreateSchema.parse(req.body);

    // Check slug uniqueness
    const existingPost = await storage.getBlogPostBySlug(validatedData.slug);
    if (existingPost) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(validatedData.content);

    // Process tags
    const tags = validatedData.tags 
      ? validatedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const postData = {
      ...validatedData,
      content: sanitizedContent,
      tags: tags.join(','),
      authorId: req.user!.id,
      publishedAt: validatedData.published ? new Date() : null,
      readTime: validatedData.readTime || Math.ceil(sanitizedContent.split(' ').length / 200), // Auto-calculate read time
    };

    const createdPost = await storage.createBlogPost(postData);

    res.status(201).json({
      message: 'Blog post created successfully',
      post: createdPost,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post
router.put('/blog/posts/:id', authenticateJwt, authorizeRoleSecure(UserRole.AUTHOR), async (req: AuthenticatedRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Check if post exists
    const existingPost = await storage.getBlogPostById(postId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check permissions (authors can only edit their own posts, admins can edit any)
    const userRole = req.user!.role;
    if (userRole === 'author' && existingPost.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    // Validate input
    const validatedData = blogPostUpdateSchema.parse(req.body);

    // Check slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await storage.getBlogPostBySlug(validatedData.slug);
      if (slugExists) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Sanitize content if provided
    let updateData: any = { ...validatedData };
    if (validatedData.content) {
      updateData.content = sanitizeContent(validatedData.content);
    }

    // Process tags if provided
    if (validatedData.tags !== undefined) {
      const tags = validatedData.tags 
        ? validatedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      updateData.tags = tags.join(',');
    }

    // Update published timestamp if being published
    if (validatedData.published === true && !existingPost.published) {
      updateData.publishedAt = new Date();
    } else if (validatedData.published === false) {
      updateData.publishedAt = null;
    }

    const updatedPost = await storage.updateBlogPost(postId, updateData);

    res.json({
      message: 'Blog post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post
router.delete('/blog/posts/:id', authenticateJwt, authorizeRoleSecure(UserRole.AUTHOR), async (req: AuthenticatedRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Check if post exists
    const existingPost = await storage.getBlogPostById(postId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check permissions (authors can only delete their own posts, admins can delete any)
    const userRole = req.user!.role;
    if (userRole === 'author' && existingPost.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await storage.deleteBlogPost(postId);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// =============================================================================
// MEDIA MANAGEMENT ROUTES
// =============================================================================

const imageUpload = createSecureUpload('blog-images', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// Upload image for blog posts
router.post('/media/upload', uploadRateLimit, authenticateJwt, authorizeRoleSecure(UserRole.AUTHOR), imageUpload.single('image'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file content
    if (!validateFileContent(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file content or file type mismatch' });
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = path.extname(req.file.originalname);
    const secureFilename = `${timestamp}-${randomString}${fileExtension}`;

    // Save file to disk
    const uploadDir = path.join(process.cwd(), 'uploads', 'blog-images');
    const filePath = path.join(uploadDir, secureFilename);

    fs.writeFileSync(filePath, req.file.buffer);

    // Generate URL (you might want to use a CDN in production)
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/blog-images/${secureFilename}`;

    res.json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: secureFilename,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get uploaded media files
router.get('/media/files', authenticateJwt, authorizeRoleSecure(UserRole.AUTHOR), async (req: AuthenticatedRequest, res) => {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads', 'blog-images');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const stats = fs.statSync(path.join(uploadDir, file));
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        
        return {
          filename: file,
          url: `${baseUrl}/uploads/blog-images/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    res.json({ files });
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
});

// Delete media file
router.delete('/media/files/:filename', authenticateJwt, authorizeRoleSecure(UserRole.ADMIN), async (req: AuthenticatedRequest, res) => {
  try {
    const { filename } = req.params;

    // Validate filename (security check)
    if (!/^[a-zA-Z0-9.-]+$/.test(filename) || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'blog-images', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// =============================================================================
// CATEGORIES AND TAGS MANAGEMENT
// =============================================================================

// Get all categories
router.get('/blog/categories', async (req, res) => {
  try {
    const categories = await storage.getBlogCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all tags
router.get('/blog/tags', async (req, res) => {
  try {
    const tags = await storage.getBlogTags();
    res.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// =============================================================================
// ANALYTICS AND STATISTICS
// =============================================================================

// Get blog statistics (Admin only)
router.get('/blog/stats', authenticateJwt, authorizeRoleSecure(UserRole.ADMIN), async (req: AuthenticatedRequest, res) => {
  try {
    const stats = await storage.getBlogStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    res.status(500).json({ error: 'Failed to fetch blog statistics' });
  }
});

export default router;
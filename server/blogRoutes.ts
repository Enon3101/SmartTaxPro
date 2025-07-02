// @ts-nocheck
import { Router } from 'express'; // Removed unused Request
import passport from 'passport';
import { z } from 'zod';
// Removed unused eq, desc, and from drizzle-orm

// Adjusted import order for ESLint
import { UserRole, authorizeRole, AuthenticatedRequest } from './auth'; 
import { storage } from './storage'; 
import { insertBlogPostSchema } from '../shared/schema'; 
import fs from 'fs';
import path from 'path';
import { generatePresignedUrl } from './secureFile';

const router = Router();

// Middleware for JWT authentication
const authenticateJwt = passport.authenticate('jwt', { session: false });

// Zod schema for slug parameter
const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug cannot be empty"),
});

// Zod schema for ID parameter
const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
});

// @ts-nocheck

// --- Admin Blog Image Upload Endpoint ---
/**
 * POST /api/admin/blog/upload-image
 * Allows admin to upload an image for use in blog posts.
 * Returns a secure URL to the uploaded image.
 * Only accessible to authenticated admins.
 *
 * Request: multipart/form-data with field 'image'
 * Response: { url: string }
 */
router.post(
  '/admin/blog/upload-image',
  authenticateJwt,
  authorizeRole(UserRole.ADMIN),
  // Custom middleware to store in uploads/blog-images
  (req, res, next) => {
    // Patch multer's destination to uploads/blog-images
    const blogImagesDir = path.join(process.cwd(), 'uploads', 'blog-images');
    if (!fs.existsSync(blogImagesDir)) {
      fs.mkdirSync(blogImagesDir, { recursive: true });
    }
    // Patch req for multer
    req.blogImagesDir = blogImagesDir;
    next();
  },
  // Use handleFileUpload for images
  (req, res, next) => {
    // Patch multer diskStorage to use blog-images dir
    const multer = require('multer');
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, req.blogImagesDir || path.join(process.cwd(), 'uploads', 'blog-images'));
      },
      filename: (req, file, cb) => {
        const pathMod = require('path');
        const { nanoid } = require('nanoid');
        const fileExt = pathMod.extname(file.originalname);
        const randomName = nanoid(24);
        cb(null, `${randomName}${fileExt}`);
      }
    });
    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error('Only image files are allowed.'));
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    }).single('image');
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    // Optionally scan for malware here if needed
    const imagePath = req.file.path;
    // Return a secure URL
    const url = generatePresignedUrl(imagePath, 60); // 60 min expiry for admin
    res.status(201).json({ url });
  }
);

// GET /api/blog - List all PUBLISHED blog posts (public)
router.get('/', async (req, res, next) => {
  try {
    const { 
      limit = '10', // Default limit
      offset = '0',  // Default offset
      category,
      searchTerm 
    } = req.query;

    const options: { 
      limit: number; 
      offset: number; 
      published: boolean; 
      category?: string; 
      searchTerm?: string 
    } = {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      published: true, // Always true for public listing
    };

    if (category && typeof category === 'string') {
      options.category = category;
    }
    if (searchTerm && typeof searchTerm === 'string') {
      options.searchTerm = searchTerm;
    }

    const result = await storage.getAllBlogPosts(options);
    // The result from storage.getAllBlogPosts is { posts: BlogPost[], total: number }
    // Send back the full result for pagination on the client if needed
    res.json(result); 
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/:slug - Get a single PUBLISHED blog post by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = slugParamSchema.parse(req.params);
    const post = await storage.getBlogPostBySlug(slug); // Use storage

    if (!post || !post.published) { // Check if post exists and is published
      return res.status(404).json({ message: 'Blog post not found or not published' });
    }
    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid slug format', details: error.errors });
    }
    next(error);
  }
});

// --- Admin Routes ---
// GET /api/admin/blog - List ALL blog posts (admin)
router.get('/admin', authenticateJwt, authorizeRole(UserRole.ADMIN), async (req: AuthenticatedRequest, res, next) => {
  try {
    // TODO: Add pagination options from query params
    const { posts } = await storage.getAllBlogPosts({ published: undefined }); // Get all, regardless of published status
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/blog - Create a new blog post (admin)
router.post('/admin', authenticateJwt, authorizeRole(UserRole.ADMIN), async (req: AuthenticatedRequest, res, next) => {
  try {
    const newPostDataValidated = insertBlogPostSchema.omit({ 
        id: true, 
        authorId: true, 
        createdAt: true, 
        updatedAt: true,
        publishedAt: true, 
        readTime: true, 
    }).parse(req.body);

    const authorId = req.user?.id; // Access id from AuthenticatedRequest.user
    if (!authorId) { // Should be caught by authenticateJwt if user is not found
        return res.status(403).json({ message: 'User ID not found.' });
    }
    
    const postToCreate = {
      ...newPostDataValidated,
      authorId: Number(authorId), // Ensure authorId is number if req.user.id is string from JWT sub
      publishedAt: newPostDataValidated.published ? new Date() : null,
    };

    const createdPost = await storage.createBlogPost(postToCreate);
    res.status(201).json(createdPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    next(error);
  }
});

// GET /api/admin/blog/:id - Get a single blog post by ID (admin)
router.get('/admin/:id', authenticateJwt, authorizeRole(UserRole.ADMIN), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const post = await storage.getBlogPostById(id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid ID format', details: error.errors });
    }
    next(error);
  }
});

// PUT /api/admin/blog/:id - Update a blog post (admin)
router.put('/admin/:id', authenticateJwt, authorizeRole(UserRole.ADMIN), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const postDataToUpdateValidated = insertBlogPostSchema.omit({ 
        id: true, 
        authorId: true, 
        createdAt: true,
        // publishedAt is handled by storage.updateBlogPost if 'published' field changes
    }).partial().parse(req.body);

    if (Object.keys(postDataToUpdateValidated).length === 0) {
        return res.status(400).json({ message: "No update data provided." });
    }
    
    // The storage.updateBlogPost method should handle setting updatedAt and publishedAt logic
    const updatedPost = await storage.updateBlogPost(id, postDataToUpdateValidated);

    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found or update failed' });
    }
    
    res.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    next(error);
  }
});


// DELETE /api/admin/blog/:id - Delete a blog post (admin)
router.delete('/admin/:id', authenticateJwt, authorizeRole(UserRole.ADMIN), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    
    // Check if post exists before attempting delete to provide a 404 if not found
    const existingPost = await storage.getBlogPostById(id);
    if (!existingPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await storage.deleteBlogPost(id);
    res.status(200).json({ message: 'Blog post deleted successfully', deletedId: id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid ID format', details: error.errors });
    }
    next(error);
  }
});


export default router;

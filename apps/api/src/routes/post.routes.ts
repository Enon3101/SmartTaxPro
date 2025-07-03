import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requirePermission } from '../middleware/auth.middleware.js';
import { generateSlug } from '../utils/slug.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  tagIds: z.array(z.number()).optional(),
  categoryIds: z.array(z.number()).optional(),
});

const updatePostSchema = createPostSchema.partial();

/**
 * GET /api/posts
 * Get all posts (public endpoint, filtered by status)
 */
router.get('/', async (req, res) => {
  try {
    const { status, authorId, tag, category, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    // Only show published posts to non-authenticated users
    if (!req.user || !req.user.userId) {
      where.status = 'PUBLISHED';
    } else if (status) {
      where.status = status;
    }
    
    if (authorId) {
      where.authorId = parseInt(authorId as string);
    }
    
    if (tag) {
      where.tags = {
        some: {
          slug: tag as string,
        },
      };
    }
    
    if (category) {
      where.categories = {
        some: {
          slug: category as string,
        },
      };
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              profileImageUrl: true,
            },
          },
          tags: true,
          categories: true,
          _count: {
            select: {
              revisions: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      prisma.post.count({ where }),
    ]);
    
    res.json({
      posts,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/posts/:id
 * Get a single post by ID or slug
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    const where = isNaN(Number(idOrSlug))
      ? { slug: idOrSlug }
      : { id: parseInt(idOrSlug) };
    
    const post = await prisma.post.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImageUrl: true,
          },
        },
        tags: true,
        categories: true,
        revisions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        },
        attachments: true,
      },
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user can view unpublished posts
    if (post.status !== 'PUBLISHED' && (!req.user || 
        (post.authorId !== req.user.userId && 
         !await hasPermission(req.user.userId, 'post.read.any')))) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/posts
 * Create a new post
 */
router.post('/', authenticate, requirePermission('post.create'), async (req, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const { tagIds, categoryIds, ...postData } = validatedData;
    
    // Generate slug from title
    const slug = await generateUniqueSlug(postData.title);
    
    // Calculate reading time (roughly 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
        readingTime,
        authorId: req.user!.userId,
        publishedAt: postData.status === 'PUBLISHED' ? new Date() : null,
        tags: tagIds ? {
          connect: tagIds.map(id => ({ id })),
        } : undefined,
        categories: categoryIds ? {
          connect: categoryIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImageUrl: true,
          },
        },
        tags: true,
        categories: true,
      },
    });
    
    // Create initial revision
    await prisma.postRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        authorId: req.user!.userId,
        changeNote: 'Initial version',
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'post.create',
        resource: 'post',
        resourceId: post.id.toString(),
        metadata: { title: post.title },
      },
    });
    
    res.status(201).json(post);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/posts/:id
 * Update a post
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const validatedData = updatePostSchema.parse(req.body);
    const { tagIds, categoryIds, ...postData } = validatedData;
    
    // Check if user can update this post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const canUpdateAny = await hasPermission(req.user!.userId, 'post.update.any');
    if (existingPost.authorId !== req.user!.userId && !canUpdateAny) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update slug if title changed
    if (postData.title && postData.title !== existingPost.title) {
      postData.slug = await generateUniqueSlug(postData.title);
    }
    
    // Update reading time if content changed
    if (postData.content) {
      const wordCount = postData.content.split(/\s+/).length;
      postData.readingTime = Math.ceil(wordCount / 200);
    }
    
    // Handle publishing
    if (postData.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      postData.publishedAt = new Date();
    }
    
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...postData,
        tags: tagIds !== undefined ? {
          set: [],
          connect: tagIds.map(id => ({ id })),
        } : undefined,
        categories: categoryIds !== undefined ? {
          set: [],
          connect: categoryIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImageUrl: true,
          },
        },
        tags: true,
        categories: true,
      },
    });
    
    // Create revision if content changed
    if (postData.title || postData.content || postData.excerpt) {
      await prisma.postRevision.create({
        data: {
          postId: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          authorId: req.user!.userId,
          changeNote: req.body.changeNote || 'Updated',
        },
      });
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'post.update',
        resource: 'post',
        resourceId: post.id.toString(),
        metadata: { changes: Object.keys(postData) },
      },
    });
    
    res.json(post);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    // Check if user can delete this post
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const canDeleteAny = await hasPermission(req.user!.userId, 'post.delete.any');
    if (post.authorId !== req.user!.userId && !canDeleteAny) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Archive instead of hard delete
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'ARCHIVED' },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'post.delete',
        resource: 'post',
        resourceId: post.id.toString(),
        metadata: { title: post.title },
      },
    });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
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

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

export default router;
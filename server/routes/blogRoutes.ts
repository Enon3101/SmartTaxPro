import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { storage } from '../storage';

const router = Router();

// Rate limiting for public blog routes
const blogRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(blogRateLimit);

// Get all published blog posts with pagination and filtering
router.get('/posts', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      category,
      search,
      tag
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(24, Math.max(1, parseInt(limit as string))); // Max 24 posts per page
    const offset = (pageNum - 1) * limitNum;

    const filters: any = {
      limit: limitNum,
      offset,
      published: true,
      sortBy: 'published_at',
      sortOrder: 'desc'
    };

    // Add filters with validation
    if (category && typeof category === 'string' && category.length <= 50) {
      filters.category = category;
    }

    if (search && typeof search === 'string' && search.length <= 100) {
      // Sanitize search term to prevent injection
      filters.searchTerm = search.replace(/[<>'"]/g, '');
    }

    const result = await storage.getAllBlogPosts(filters);

    // Filter by tag if specified (since we store tags as comma-separated string)
    let posts = result.posts;
    if (tag && typeof tag === 'string') {
      const tagFilter = tag.toLowerCase().trim();
      posts = posts.filter(post => 
        post.tags && post.tags.toLowerCase().split(',').some(t => t.trim() === tagFilter)
      );
    }

    res.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        authorName: post.authorName,
        publishedAt: post.publishedAt,
        views: post.views
      })),
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

// Get single blog post by slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Invalid slug format' });
    }

    const post = await storage.getBlogPostBySlug(slug);

    if (!post || !post.published) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment view count
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    try {
      await storage.incrementBlogPostViews(post.id, clientIp, userAgent, referrer);
    } catch (viewError) {
      console.error('Error incrementing view count:', viewError);
      // Don't fail the request if view tracking fails
    }

    // Get related posts
    let relatedPosts = [];
    try {
      relatedPosts = await storage.getRelatedBlogPosts(post.id, post.category, post.tags, 3);
    } catch (relatedError) {
      console.error('Error fetching related posts:', relatedError);
      // Continue without related posts if there's an error
    }

    const responsePost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      category: post.category,
      tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      featuredImage: post.featuredImage,
      readTime: post.readTime,
      authorName: post.authorName,
      publishedAt: post.publishedAt,
      views: post.views,
      seo: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.summary,
        keywords: post.seoKeywords
      },
      relatedPosts: relatedPosts.map(related => ({
        id: related.id,
        title: related.title,
        slug: related.slug,
        summary: related.summary,
        category: related.category,
        featuredImage: related.featuredImage,
        readTime: related.readTime,
        publishedAt: related.publishedAt
      }))
    };

    res.json(responsePost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Search blog posts
router.get('/search', async (req, res) => {
  try {
    const { q, limit = '10' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (q.length < 3) {
      return res.status(400).json({ error: 'Search query must be at least 3 characters' });
    }

    if (q.length > 100) {
      return res.status(400).json({ error: 'Search query too long' });
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));

    // Sanitize search query
    const sanitizedQuery = q.replace(/[<>'"]/g, '');

    const posts = await storage.searchBlogPosts(sanitizedQuery, limitNum);

    res.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        authorName: post.authorName,
        publishedAt: post.publishedAt,
        views: post.views
      })),
      query: sanitizedQuery,
      total: posts.length
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({ error: 'Failed to search blog posts' });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await storage.getBlogCategories();

    res.json({
      categories: categories.filter(cat => cat.count > 0) // Only return categories with posts
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ error: 'Failed to fetch blog categories' });
  }
});

// Get blog tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await storage.getBlogTags();

    res.json({
      tags: tags.slice(0, 30) // Return top 30 tags
    });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    res.status(500).json({ error: 'Failed to fetch blog tags' });
  }
});

// Get posts by category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = '1', limit = '12' } = req.query;

    // Validate category
    if (category.length > 50) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(24, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    const result = await storage.getAllBlogPosts({
      limit: limitNum,
      offset,
      published: true,
      category: decodeURIComponent(category),
      sortBy: 'published_at',
      sortOrder: 'desc'
    });

    res.json({
      posts: result.posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        authorName: post.authorName,
        publishedAt: post.publishedAt,
        views: post.views
      })),
      category: decodeURIComponent(category),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Failed to fetch posts by category' });
  }
});

// Get posts by tag
router.get('/tags/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = '1', limit = '12' } = req.query;

    // Validate tag
    if (tag.length > 50) {
      return res.status(400).json({ error: 'Invalid tag' });
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(24, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // Get all published posts and filter by tag
    const result = await storage.getAllBlogPosts({
      limit: limitNum * 2, // Get more posts to filter by tag
      offset: 0,
      published: true,
      sortBy: 'published_at',
      sortOrder: 'desc'
    });

    const tagFilter = decodeURIComponent(tag).toLowerCase().trim();
    const filteredPosts = result.posts.filter(post => 
      post.tags && post.tags.toLowerCase().split(',').some(t => t.trim() === tagFilter)
    );

    // Apply pagination to filtered results
    const paginatedPosts = filteredPosts.slice(offset, offset + limitNum);

    res.json({
      posts: paginatedPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        authorName: post.authorName,
        publishedAt: post.publishedAt,
        views: post.views
      })),
      tag: decodeURIComponent(tag),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Failed to fetch posts by tag' });
  }
});

// Get recent posts (for homepage, sidebar, etc.)
router.get('/recent', async (req, res) => {
  try {
    const { limit = '5' } = req.query;
    const limitNum = Math.min(10, Math.max(1, parseInt(limit as string)));

    const result = await storage.getAllBlogPosts({
      limit: limitNum,
      offset: 0,
      published: true,
      sortBy: 'published_at',
      sortOrder: 'desc'
    });

    res.json({
      posts: result.posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        publishedAt: post.publishedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({ error: 'Failed to fetch recent posts' });
  }
});

// Get popular posts
router.get('/popular', async (req, res) => {
  try {
    const { limit = '5' } = req.query;
    const limitNum = Math.min(10, Math.max(1, parseInt(limit as string)));

    const result = await storage.getAllBlogPosts({
      limit: limitNum,
      offset: 0,
      published: true,
      sortBy: 'views',
      sortOrder: 'desc'
    });

    res.json({
      posts: result.posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        category: post.category,
        featuredImage: post.featuredImage,
        readTime: post.readTime,
        views: post.views,
        publishedAt: post.publishedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    res.status(500).json({ error: 'Failed to fetch popular posts' });
  }
});

// RSS Feed endpoint
router.get('/rss', async (req, res) => {
  try {
    const result = await storage.getAllBlogPosts({
      limit: 20,
      offset: 0,
      published: true,
      sortBy: 'published_at',
      sortOrder: 'desc'
    });

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const now = new Date().toISOString();

    const rssItems = result.posts.map(post => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.summary}]]></description>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid>${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
        <category><![CDATA[${post.category}]]></category>
        <author><![CDATA[${post.authorName}]]></author>
      </item>
    `).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SmartTaxPro Blog</title>
    <description>Latest tax planning insights and financial guidance</description>
    <link>${baseUrl}/blog</link>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en-US</language>
    ${rssItems}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml');
    res.send(rssXml);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
});

export default router;
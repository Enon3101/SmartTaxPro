import { Database } from 'sqlite3';
import bcrypt from 'bcrypt';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  featuredImage?: string;
  readTime: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views?: number;
}

export interface BlogPostCreateData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  featuredImage?: string;
  readTime: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  authorId: number;
  publishedAt?: Date | null;
}

export interface BlogPostUpdateData {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  category?: string;
  tags?: string;
  featuredImage?: string;
  readTime?: number;
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  publishedAt?: Date | null;
}

export interface BlogPostFilters {
  limit?: number;
  offset?: number;
  category?: string;
  searchTerm?: string;
  published?: boolean;
  authorId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  categoriesCount: number;
  tagsCount: number;
  avgReadTime: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
  topCategories: Array<{ category: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
}

export class BlogStorage {
  constructor(private db: Database) {
    this.initializeBlogTables();
  }

  private initializeBlogTables(): void {
    const queries = [
      `CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT DEFAULT '',
        featured_image TEXT,
        read_time INTEGER DEFAULT 5,
        published BOOLEAN DEFAULT 0,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        author_id INTEGER NOT NULL,
        views INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME,
        FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS blog_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        slug TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS blog_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS blog_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE
      )`,

      // Indexes for performance
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published)`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id)`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_blog_views_post ON blog_views(post_id)`,

      // Insert default categories
      `INSERT OR IGNORE INTO blog_categories (name, description, slug) VALUES 
        ('Tax Planning', 'Strategic tax planning and optimization', 'tax-planning'),
        ('Deductions', 'Tax deductions and exemptions', 'deductions'),
        ('GST', 'Goods and Services Tax related content', 'gst'),
        ('Investments', 'Investment and wealth management', 'investments'),
        ('Capital Gains', 'Capital gains tax and strategies', 'capital-gains'),
        ('Income Tax', 'Income tax rules and regulations', 'income-tax'),
        ('News', 'Latest tax and financial news', 'news'),
        ('Guides', 'Step-by-step guides and tutorials', 'guides')`,
    ];

    queries.forEach(query => {
      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating blog table:', err);
        }
      });
    });
  }

  // Create a new blog post
  async createBlogPost(postData: BlogPostCreateData): Promise<BlogPost> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO blog_posts (
          title, slug, summary, content, category, tags, featured_image,
          read_time, published, seo_title, seo_description, seo_keywords,
          author_id, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        postData.title,
        postData.slug,
        postData.summary,
        postData.content,
        postData.category,
        postData.tags || '',
        postData.featuredImage || null,
        postData.readTime,
        postData.published ? 1 : 0,
        postData.seoTitle || null,
        postData.seoDescription || null,
        postData.seoKeywords || null,
        postData.authorId,
        postData.publishedAt || null
      ];

      this.db.run(query, params, function(err) {
        if (err) {
          reject(err);
          return;
        }

        // Get the created post
        const selectQuery = `
          SELECT p.*, u.username as author_name
          FROM blog_posts p
          LEFT JOIN users u ON p.author_id = u.id
          WHERE p.id = ?
        `;

        this.db.get(selectQuery, [this.lastID], (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(this.mapRowToBlogPost(row));
        });
      });
    });
  }

  // Get blog post by ID
  async getBlogPostById(id: number): Promise<BlogPost | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.username as author_name
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.id = ?
      `;

      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ? this.mapRowToBlogPost(row) : null);
      });
    });
  }

  // Get blog post by slug
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.username as author_name
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.slug = ?
      `;

      this.db.get(query, [slug], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ? this.mapRowToBlogPost(row) : null);
      });
    });
  }

  // Get all blog posts with filters and pagination
  async getAllBlogPosts(filters: BlogPostFilters = {}): Promise<{ posts: BlogPost[]; total: number }> {
    return new Promise((resolve, reject) => {
      const {
        limit = 10,
        offset = 0,
        category,
        searchTerm,
        published,
        authorId,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = filters;

      let whereConditions: string[] = [];
      let params: any[] = [];

      // Build WHERE conditions
      if (published !== undefined) {
        whereConditions.push('p.published = ?');
        params.push(published ? 1 : 0);
      }

      if (category) {
        whereConditions.push('p.category = ?');
        params.push(category);
      }

      if (authorId) {
        whereConditions.push('p.author_id = ?');
        params.push(authorId);
      }

      if (searchTerm) {
        whereConditions.push('(p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ?)');
        const searchPattern = `%${searchTerm}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Validate sort parameters to prevent SQL injection
      const validSortColumns = ['title', 'created_at', 'updated_at', 'published_at', 'views', 'read_time'];
      const validSortOrder = ['asc', 'desc'];
      
      const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const safeSortOrder = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM blog_posts p
        ${whereClause}
      `;

      // Main query
      const mainQuery = `
        SELECT p.*, u.username as author_name
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        ${whereClause}
        ORDER BY p.${safeSortBy} ${safeSortOrder.toUpperCase()}
        LIMIT ? OFFSET ?
      `;

      // Get total count first
      this.db.get(countQuery, params, (err, countRow: any) => {
        if (err) {
          reject(err);
          return;
        }

        const total = countRow.total;

        // Get posts
        this.db.all(mainQuery, [...params, limit, offset], (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const posts = rows.map(row => this.mapRowToBlogPost(row));
          resolve({ posts, total });
        });
      });
    });
  }

  // Update blog post
  async updateBlogPost(id: number, updateData: BlogPostUpdateData): Promise<BlogPost> {
    return new Promise((resolve, reject) => {
      const updates: string[] = [];
      const params: any[] = [];

      // Build dynamic update query
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          const columnName = this.camelToSnake(key);
          updates.push(`${columnName} = ?`);
          params.push(value);
        }
      });

      if (updates.length === 0) {
        reject(new Error('No update data provided'));
        return;
      }

      // Always update the updated_at timestamp
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      const query = `
        UPDATE blog_posts 
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      this.db.run(query, params, function(err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(new Error('Blog post not found'));
          return;
        }

        // Return updated post
        resolve(this.getBlogPostById(id));
      }.bind(this));
    });
  }

  // Delete blog post
  async deleteBlogPost(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM blog_posts WHERE id = ?';

      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(new Error('Blog post not found'));
          return;
        }

        resolve();
      });
    });
  }

  // Increment view count
  async incrementViewCount(postId: number, ipAddress?: string, userAgent?: string, referrer?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Insert view record
      const insertViewQuery = `
        INSERT INTO blog_views (post_id, ip_address, user_agent, referrer)
        VALUES (?, ?, ?, ?)
      `;

      this.db.run(insertViewQuery, [postId, ipAddress, userAgent, referrer], (err) => {
        if (err) {
          console.error('Error inserting view record:', err);
        }
      });

      // Update post view count
      const updateQuery = `
        UPDATE blog_posts 
        SET views = views + 1
        WHERE id = ?
      `;

      this.db.run(updateQuery, [postId], function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  // Get blog categories
  async getBlogCategories(): Promise<Array<{ name: string; count: number }>> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          bc.name,
          COUNT(bp.id) as count
        FROM blog_categories bc
        LEFT JOIN blog_posts bp ON bc.name = bp.category
        GROUP BY bc.name
        ORDER BY count DESC, bc.name ASC
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows.map(row => ({
          name: row.name,
          count: row.count
        })));
      });
    });
  }

  // Get blog tags
  async getBlogTags(): Promise<Array<{ name: string; count: number }>> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          TRIM(tag.value) as name,
          COUNT(*) as count
        FROM blog_posts bp,
             json_each('["' || REPLACE(bp.tags, ',', '","') || '"]') as tag
        WHERE bp.tags != '' AND TRIM(tag.value) != ''
        GROUP BY TRIM(tag.value)
        ORDER BY count DESC, name ASC
        LIMIT 50
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          // Fallback for older SQLite versions without JSON support
          const fallbackQuery = `
            SELECT DISTINCT
              TRIM(substr(tags, 1, instr(tags || ',', ',') - 1)) as name,
              1 as count
            FROM blog_posts 
            WHERE tags != ''
            ORDER BY name ASC
          `;

          this.db.all(fallbackQuery, [], (fallbackErr, fallbackRows: any[]) => {
            if (fallbackErr) {
              reject(fallbackErr);
              return;
            }

            resolve(fallbackRows.map(row => ({
              name: row.name,
              count: row.count
            })));
          });
          return;
        }

        resolve(rows.map(row => ({
          name: row.name,
          count: row.count
        })));
      });
    });
  }

  // Get blog statistics
  async getBlogStatistics(): Promise<BlogStats> {
    return new Promise((resolve, reject) => {
      const queries = {
        basic: `
          SELECT 
            COUNT(*) as total_posts,
            SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published_posts,
            SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as draft_posts,
            SUM(views) as total_views,
            AVG(read_time) as avg_read_time
          FROM blog_posts
        `,
        
        categories: `
          SELECT COUNT(DISTINCT category) as categories_count
          FROM blog_posts
          WHERE category != ''
        `,

        popularPosts: `
          SELECT p.*, u.username as author_name
          FROM blog_posts p
          LEFT JOIN users u ON p.author_id = u.id
          WHERE p.published = 1
          ORDER BY p.views DESC, p.created_at DESC
          LIMIT 5
        `,

        recentPosts: `
          SELECT p.*, u.username as author_name
          FROM blog_posts p
          LEFT JOIN users u ON p.author_id = u.id
          WHERE p.published = 1
          ORDER BY p.published_at DESC, p.created_at DESC
          LIMIT 5
        `,

        topCategories: `
          SELECT 
            category,
            COUNT(*) as count
          FROM blog_posts
          WHERE category != '' AND published = 1
          GROUP BY category
          ORDER BY count DESC
          LIMIT 5
        `
      };

      // Execute all queries
      Promise.all([
        new Promise((res, rej) => this.db.get(queries.basic, [], (err, row: any) => err ? rej(err) : res(row))),
        new Promise((res, rej) => this.db.get(queries.categories, [], (err, row: any) => err ? rej(err) : res(row))),
        new Promise((res, rej) => this.db.all(queries.popularPosts, [], (err, rows: any[]) => err ? rej(err) : res(rows))),
        new Promise((res, rej) => this.db.all(queries.recentPosts, [], (err, rows: any[]) => err ? rej(err) : res(rows))),
        new Promise((res, rej) => this.db.all(queries.topCategories, [], (err, rows: any[]) => err ? rej(err) : res(rows)))
      ]).then(([basic, categories, popularPosts, recentPosts, topCategories]: any[]) => {
        const stats: BlogStats = {
          totalPosts: basic.total_posts || 0,
          publishedPosts: basic.published_posts || 0,
          draftPosts: basic.draft_posts || 0,
          totalViews: basic.total_views || 0,
          categoriesCount: categories.categories_count || 0,
          tagsCount: 0, // Will be calculated separately if needed
          avgReadTime: Math.round(basic.avg_read_time) || 5,
          popularPosts: (popularPosts || []).map((row: any) => this.mapRowToBlogPost(row)),
          recentPosts: (recentPosts || []).map((row: any) => this.mapRowToBlogPost(row)),
          topCategories: topCategories || [],
          topTags: [] // Will be populated by separate call if needed
        };

        resolve(stats);
      }).catch(reject);
    });
  }

  // Search blog posts
  async searchBlogPosts(searchTerm: string, limit: number = 10): Promise<BlogPost[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.username as author_name
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.published = 1 
          AND (p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ? OR p.tags LIKE ?)
        ORDER BY 
          CASE 
            WHEN p.title LIKE ? THEN 1
            WHEN p.summary LIKE ? THEN 2
            WHEN p.tags LIKE ? THEN 3
            ELSE 4
          END,
          p.created_at DESC
        LIMIT ?
      `;

      const searchPattern = `%${searchTerm}%`;
      const params = [
        searchPattern, searchPattern, searchPattern, searchPattern, // WHERE clause
        searchPattern, searchPattern, searchPattern, // ORDER BY clause
        limit
      ];

      this.db.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const posts = rows.map(row => this.mapRowToBlogPost(row));
        resolve(posts);
      });
    });
  }

  // Get related posts
  async getRelatedPosts(postId: number, category: string, tags: string, limit: number = 5): Promise<BlogPost[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.username as author_name,
          CASE 
            WHEN p.category = ? THEN 2
            WHEN p.tags LIKE ? THEN 1
            ELSE 0
          END as relevance_score
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.published = 1 
          AND p.id != ?
          AND (p.category = ? OR p.tags LIKE ?)
        ORDER BY relevance_score DESC, p.views DESC, p.created_at DESC
        LIMIT ?
      `;

      const tagPattern = `%${tags}%`;
      const params = [category, tagPattern, postId, category, tagPattern, limit];

      this.db.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const posts = rows.map(row => this.mapRowToBlogPost(row));
        resolve(posts);
      });
    });
  }

  // Helper method to map database row to BlogPost interface
  private mapRowToBlogPost(row: any): BlogPost {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      content: row.content,
      category: row.category,
      tags: row.tags || '',
      featuredImage: row.featured_image || undefined,
      readTime: row.read_time,
      published: Boolean(row.published),
      seoTitle: row.seo_title || undefined,
      seoDescription: row.seo_description || undefined,
      seoKeywords: row.seo_keywords || undefined,
      authorId: row.author_id,
      authorName: row.author_name || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at || undefined,
      views: row.views || 0
    };
  }

  // Helper method to convert camelCase to snake_case
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

// Export singleton instance if needed
export const createBlogStorage = (db: Database) => new BlogStorage(db);
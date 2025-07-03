import { 
  BlogStorage, 
  BlogPost, 
  BlogPostCreateData, 
  BlogPostUpdateData, 
  BlogPostFilters, 
  BlogStats 
} from './blogStorage';

export class Storage {
  // ... existing properties ...
  private blogStorage: BlogStorage;

  constructor(dbPath: string) {
    // ... existing constructor code ...
    this.blogStorage = new BlogStorage(this.db);
  }

  // ... existing methods ...

  // Blog methods
  async createBlogPost(postData: BlogPostCreateData): Promise<BlogPost> {
    return this.blogStorage.createBlogPost(postData);
  }

  async getBlogPostById(id: number): Promise<BlogPost | null> {
    return this.blogStorage.getBlogPostById(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.blogStorage.getBlogPostBySlug(slug);
  }

  async getAllBlogPosts(filters?: BlogPostFilters): Promise<{ posts: BlogPost[]; total: number }> {
    return this.blogStorage.getAllBlogPosts(filters);
  }

  async updateBlogPost(id: number, updateData: BlogPostUpdateData): Promise<BlogPost> {
    return this.blogStorage.updateBlogPost(id, updateData);
  }

  async deleteBlogPost(id: number): Promise<void> {
    return this.blogStorage.deleteBlogPost(id);
  }

  async incrementBlogPostViews(postId: number, ipAddress?: string, userAgent?: string, referrer?: string): Promise<void> {
    return this.blogStorage.incrementViewCount(postId, ipAddress, userAgent, referrer);
  }

  async getBlogCategories(): Promise<Array<{ name: string; count: number }>> {
    return this.blogStorage.getBlogCategories();
  }

  async getBlogTags(): Promise<Array<{ name: string; count: number }>> {
    return this.blogStorage.getBlogTags();
  }

  async getBlogStatistics(): Promise<BlogStats> {
    return this.blogStorage.getBlogStatistics();
  }

  async searchBlogPosts(searchTerm: string, limit?: number): Promise<BlogPost[]> {
    return this.blogStorage.searchBlogPosts(searchTerm, limit);
  }

  async getRelatedBlogPosts(postId: number, category: string, tags: string, limit?: number): Promise<BlogPost[]> {
    return this.blogStorage.getRelatedPosts(postId, category, tags, limit);
  }
}
import { Calendar, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Newline removed if it was causing "no empty line within import group"
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient'; 

// Define the structure of a blog post (matching what the backend provides)
interface BlogPostPublic {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  authorId?: number; // Changed from authorName
  featuredImage?: string;
  category: string;
  tags?: string | null; // Changed from string[]
  readTime?: number;
  publishedAt?: string; 
  createdAt: string;
}

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const postsPerPage = 6; // Or make this configurable

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Construct query parameters
        const params = new URLSearchParams();
        params.append('limit', String(postsPerPage));
        params.append('offset', String((page - 1) * postsPerPage));
        params.append('published', 'true'); // Only fetch published posts
        if (categoryFilter !== "all") {
          params.append('category', categoryFilter);
        }
        if (searchTerm) {
          params.append('searchTerm', searchTerm);
        }

        const response = await apiRequest('GET', `/api/blog?${params.toString()}`); // Changed to /api/blog
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(Math.ceil((data.total || 0) / postsPerPage));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error",
          description: "Could not load blog posts. Please try again later.",
          variant: "destructive",
        });
        setPosts([]); // Clear posts on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, categoryFilter, searchTerm, toast]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // TODO: Get unique categories from posts or a dedicated API endpoint
  const uniqueCategories = ["all", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const parseTags = (tagsString: string | null | undefined): string[] => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
      {/* Header */}
      <Card className="mb-6 sm:mb-8 shadow-none border-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">Tax Insights & Learning Hub</CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground mt-2">
            Stay updated with the latest tax news, tips, and guides.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="w-full sm:max-w-sm min-h-[48px] text-base touch-manipulation"
        />
        <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px] min-h-[48px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat} className="py-3">
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
            <p className="text-muted-foreground">
              No blog posts found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        </div>
      ) : (
        /* Blog Posts Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <Link href={`/learning/blog/${post.slug}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-48 sm:h-52 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </Link>
              )}
              
              {/* Content */}
              <CardHeader className="pb-3">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                  {post.category}
                </span>
                <CardTitle className="mt-2 text-lg sm:text-xl leading-tight">
                  <Link 
                    href={`/learning/blog/${post.slug}`} 
                    className="hover:text-primary transition-colors block touch-manipulation"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
                
                {/* Tags */}
                {post.tags && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {parseTags(post.tags).slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {parseTags(post.tags).length > 3 && (
                      <span className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                        +{parseTags(post.tags).length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
              
              {/* Footer */}
              <CardFooter className="text-xs text-muted-foreground border-t pt-3 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    
                    {post.readTime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>{post.readTime} min read</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Read More Link */}
                  <Link 
                    href={`/learning/blog/${post.slug}`}
                    className="text-primary hover:text-primary/80 font-medium transition-colors touch-manipulation sm:ml-auto"
                  >
                    Read More →
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1 || isLoading}
              variant="outline"
              className="min-h-[48px] px-6 text-base font-medium touch-manipulation"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1 px-4">
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
            </div>
            
            <Button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages || isLoading}
              variant="outline"
              className="min-h-[48px] px-6 text-base font-medium touch-manipulation"
            >
              Next
            </Button>
          </div>
          
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * postsPerPage + 1, posts.length)} - {Math.min(page * postsPerPage, posts.length)} of {totalPages * postsPerPage} articles
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;

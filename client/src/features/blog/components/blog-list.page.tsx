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
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 shadow-none border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold">Tax Insights & Learning Hub</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Stay updated with the latest tax news, tips, and guides.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setPage(1); }}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No blog posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.featuredImage && (
                <Link href={`/learning/blog/${post.slug}`}>
                  <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="w-full h-48 object-cover cursor-pointer" 
                  />
                </Link>
              )}
              <CardHeader>
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">{post.category}</span>
                <CardTitle className="mt-1 text-xl">
                  <Link href={`/learning/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
                {post.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {parseTags(post.tags).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                {post.readTime && (
                  <div className="flex items-center mr-4"> {/* Added mr-4 for spacing */}
                    <Clock className="h-4 w-4 mr-1.5" />
                    {post.readTime} min read
                  </div>
                )}
                {/* Optionally display authorId or fetch author name later */}
                {/* {post.authorId && <span className="text-xs">Author ID: {post.authorId}</span>} */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || isLoading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || isLoading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;

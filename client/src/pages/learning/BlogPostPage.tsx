import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Clock } from 'lucide-react'; // Removed UserCircle and Card components
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';

import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Define the structure of a single blog post (matching backend, including full content)
interface BlogPostSingle {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string; // Full content
  authorId?: number;
  // authorName?: string; // API might not provide this directly, handle separately if needed
  featuredImage?: string;
  category: string;
  tags?: string | null;
  readTime?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const BlogPostPage: React.FC = () => {
  const params = useParams<{ slug?: string }>();
  const [post, setPost] = useState<BlogPostSingle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) {
        setIsLoading(false);
        toast({ title: "Error", description: "Blog post slug not provided.", variant: "destructive" });
        return;
      }
      setIsLoading(true);
      try {
        const response = await apiRequest('GET', `/api/blog-posts/${params.slug}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Blog post not found or not published.' }));
          throw new Error(errorData.message);
        }
        const data: BlogPostSingle = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Could not load the blog post.",
          variant: "destructive",
        });
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug, toast]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const parseTags = (tagsString: string | null | undefined): string[] => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  };

  // Sanitize HTML content before rendering
  const sanitizedContent = post?.content ? DOMPurify.sanitize(post.content) : '';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-muted-foreground mb-4">Blog post not found.</p>
        <Link href="/learning/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/learning/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog List
          </Button>
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">{post.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              Published on {formatDate(post.publishedAt || post.createdAt)}
            </div>
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                {post.readTime} min read
              </div>
            )}
            {/* Placeholder for author name - ideally fetch from authorId */}
            {/* <div className="flex items-center"><UserCircle className="h-4 w-4 mr-1.5" /> By Admin</div> */}
          </div>
          {post.summary && <p className="mt-4 text-lg text-muted-foreground">{post.summary}</p>}
        </header>

        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8" 
          />
        )}

        {/* Render sanitized HTML content */}
        <div 
          className="prose dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />

        {post.tags && parseTags(post.tags).length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-md font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {parseTags(post.tags).map((tag, index) => (
                <span key={index} className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;

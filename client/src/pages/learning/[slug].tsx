import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import blogContents from "@/data/blogContent";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorId: number;
  authorName?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  
  // Fetch blog post details
  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/blog-posts/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${slug}`);
      if (!response.ok) {
        throw new Error("Blog post not found");
      }
      return response.json() as Promise<BlogPost>;
    },
  });
  
  // Fetch detailed content if available
  const detailedContent = slug && Object.prototype.hasOwnProperty.call(blogContents, slug)
    ? blogContents[slug as keyof typeof blogContents]
    : null;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/learning")}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Learning Resources
        </Button>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/learning")}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Learning Resources
        </Button>
        
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            Sorry, the blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => setLocation("/learning")}>
            View All Articles
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => setLocation("/learning")}
        className="mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Learning Resources
      </Button>
      
      <article className="prose prose-blue max-w-none dark:prose-invert">
        <div className="mb-8">
          <Badge className="mb-4" variant="outline">
            {post.category}
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight mb-4 mt-2">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.summary}
          </p>
        </div>
        
        {/* Use detailed content if available, otherwise use normal content */}
        <div className="blog-content" dangerouslySetInnerHTML={{ 
          __html: detailedContent || post.content 
        }} />
        
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t">
          <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
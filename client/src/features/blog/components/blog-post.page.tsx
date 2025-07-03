import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Tags, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  ChevronUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import blogContents from "../api/blogContent";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Sample blog post data
const blogPostsData = [
  {
    id: 1,
    title: "How to Choose Between Old and New Tax Regimes in 2025",
    slug: "old-vs-new-tax-regime-2025",
    summary: "Understand the key differences between old and new tax regimes to make the best choice for your financial situation.",
    // The actual content is stored in blogContents
    authorId: 1,
    authorName: "Priya Sharma",
    authorBio: "Priya Sharma is a Chartered Accountant with over 10 years of experience in tax planning and advisory.",
    featuredImage: "/blog/tax-regime-comparison.jpg",
    category: "Tax Planning",
    tags: ["tax regime", "tax planning", "income tax"],
    readTime: 6,
    published: true,
    publishedAt: "2025-04-15T10:30:00Z",
    createdAt: "2025-04-10T14:25:00Z",
    updatedAt: "2025-04-15T09:15:00Z"
  },
  {
    id: 2,
    title: "Section 80C Investments: Maximize Your Tax Savings",
    slug: "section-80c-investments-guide",
    summary: "Learn about the various Section 80C investment options that can help you save up to ₹1,50,000 on your taxable income.",
    // Content in blogContents
    authorId: 2,
    authorName: "Rajesh Kumar",
    authorBio: "Rajesh Kumar is a financial planner with expertise in tax optimization strategies for individuals and small businesses.",
    featuredImage: "/blog/80c-investments.jpg",
    category: "Deductions",
    tags: ["80C", "tax deductions", "investments"],
    readTime: 8,
    published: true,
    publishedAt: "2025-04-08T12:00:00Z",
    createdAt: "2025-04-01T09:45:00Z",
    updatedAt: "2025-04-08T10:30:00Z"
  },
  {
    id: 3,
    title: "NPS vs ELSS: Which is Better for Tax Saving?",
    slug: "nps-vs-elss-comparison",
    summary: "Compare National Pension System (NPS) and Equity-Linked Savings Scheme (ELSS) for tax-saving and long-term wealth creation.",
    // Content in blogContents
    authorId: 1,
    authorName: "Priya Sharma",
    authorBio: "Priya Sharma is a Chartered Accountant with over 10 years of experience in tax planning and advisory.",
    featuredImage: "/blog/nps-elss-comparison.jpg",
    category: "Investments",
    tags: ["NPS", "ELSS", "mutual funds", "retirement"],
    readTime: 7,
    published: true,
    publishedAt: "2025-03-25T14:15:00Z",
    createdAt: "2025-03-20T11:30:00Z",
    updatedAt: "2025-03-25T13:00:00Z"
  }
];

const BlogPost = () => {
  const { slug } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  
  // Find the blog post by slug
  const post = blogPostsData.find(post => post.slug === slug);
  
  // Get the detailed content from our content store
  const content = post ? blogContents[post.slug as keyof typeof blogContents] : '';
  
  // Calculate reading progress on scroll
  useEffect(() => {
    const calculateReadingProgress = () => {
      if (articleRef.current) {
        const articleHeight = articleRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Show/hide scroll-to-top button
        setShowScrollTop(scrollY > 500);
        
        // How far the user has scrolled into the article
        const scrolled = scrollY - articleRef.current.offsetTop;
        
        // Total scrollable distance (total height minus window height)
        const scrollableHeight = articleHeight - windowHeight;
        
        // Calculate progress as a percentage, clamped between 0 and 100
        const progress = Math.max(0, Math.min(100, (scrolled / scrollableHeight) * 100));
        
        setReadingProgress(progress);
      }
    };
    
    window.addEventListener('scroll', calculateReadingProgress);
    calculateReadingProgress(); // Initial calculation
    
    return () => window.removeEventListener('scroll', calculateReadingProgress);
  }, []);
  
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Copy link to clipboard handler
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "The article link has been copied to your clipboard.",
      duration: 3000,
    });
  };
  
  // Smooth scroll for TOC links
  useEffect(() => {
    const handleTocClick = (e: any) => {
      if (e.target.matches('.toc-link')) {
        e.preventDefault();
        const el = document.getElementById(e.target.getAttribute('href').slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    document.addEventListener('click', handleTocClick);
    return () => document.removeEventListener('click', handleTocClick);
  }, []);
  
  if (!post || !content) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/learning">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning Resources
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract headings for table of contents
  const headings = content.match(/<h2.*?>(.*?)<\/h2>/g)?.map(heading => {
    const title = heading.replace(/<h2.*?>(.*?)<\/h2>/, '$1');
    const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    return { title, slug };
  }) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Reading progress bar - fixed at the top */}
      <div className="fixed top-[64px] left-0 w-full z-40">
        <div 
          className="h-2 bg-gray-200 dark:bg-gray-800 rounded-b-lg shadow-md overflow-hidden"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
        >
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-b-lg"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>
      {/* Scroll to top button with fade and tooltip */}
      <div className={cn(
        "fixed right-8 bottom-8 z-50 transition-opacity duration-500",
        showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          onClick={scrollToTop}
          className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
        {showTooltip && (
          <div className="absolute right-0 bottom-14 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg dark:bg-gray-700" role="tooltip">
            Back to top
          </div>
        )}
      </div>
      {/* Blog header with featured image */}
      <div className="mb-6 relative rounded-lg overflow-hidden shadow-sm">
        {post.featuredImage && (
          <div className="h-48 sm:h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${post.featuredImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}
        <div className={cn(
          "absolute left-0 right-0 bottom-0 px-6 py-4",
          post.featuredImage ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white" : "bg-white dark:bg-gray-900"
        )}>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
              {post.category}
            </span>
            {post.tags.map((tag, index) => (
              <span key={index} className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-2">{post.summary}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Back button */}
      <div className="mb-6">
        <Link href="/learning">
          <Button variant="ghost" size="sm" className="pl-0" aria-label="Back to Learning Resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <article className="flex-grow max-w-3xl mx-auto" ref={articleRef}>
          {/* Blog content */}
          <div className="prose prose-blue max-w-none dark:prose-invert mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          
          {/* Author info */}
          <div className="border rounded-lg p-6 bg-muted/20">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 mr-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{post.authorName}</h3>
                <p className="text-sm text-muted-foreground">{post.authorBio}</p>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-2">
              <Tags className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link key={index} href={`/learning/tag/${tag}`}>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Share buttons */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share this article:</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${window.location.href}`)}`, '_blank')}
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3 h-9"
                onClick={copyLinkToClipboard}
              >
                Copy Link
              </Button>
            </div>
          </div>
          
          {/* Related posts */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogPostsData
                .filter(relatedPost => 
                  relatedPost.slug !== post.slug && 
                  (relatedPost.category === post.category || 
                   relatedPost.tags.some(tag => post.tags.includes(tag)))
                )
                .slice(0, 2)
                .map(relatedPost => (
                  <Link key={relatedPost.id} href={`/learning/blog/${relatedPost.slug}`}>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-medium mt-2 line-clamp-2">{relatedPost.title}</h4>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{relatedPost.readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </article>
        
        {/* Sidebar - Table of Contents with reading progress */}
        <aside className="w-full md:w-64 lg:w-80 order-first md:order-last">
          <div className="md:sticky md:top-[80px] bg-card p-5 rounded-lg border">
            <h4 className="font-semibold mb-4">Table of Contents</h4>
            <nav className="text-sm">
              <ul className="space-y-3">
                {headings.map((heading, index) => {
                  // Calculate progress through article sections
                  const sectionProgress = Math.min(100, Math.max(0, 
                    (readingProgress - (index * (100 / (headings.length || 1)))) 
                    * ((headings.length || 1) / 100) * 3
                  ));
                  
                  return (
                    <li key={index} className="relative">
                      {/* Progress indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted rounded-full">
                        <div 
                          className="bg-primary w-full rounded-full transition-all duration-200 ease-out"
                          style={{ height: `${sectionProgress}%` }}
                        />
                      </div>
                      <a 
                        href={`#${heading.slug}`}
                        className={cn(
                          'pl-4 inline-block hover:text-primary transition-colors toc-link',
                          sectionProgress > 50 ? 'text-primary font-medium' : 'text-muted-foreground'
                        )}
                        aria-label={`Jump to section: ${heading.title}`}
                      >
                        {heading.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            {/* Reading progress indicator */}
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Reading progress</span>
                <span className="font-medium">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
            
            {/* Estimated reading time */}
            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Reading time:</span>
              </div>
              <span className="text-sm font-medium">{post.readTime} minutes</span>
            </div>
            
            {/* Share buttons in sidebar */}
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm mb-3 font-medium">Share Article</div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={copyLinkToClipboard}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;

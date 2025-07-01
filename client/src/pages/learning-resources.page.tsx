import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  FileText, 
  Lightbulb, 
  HelpCircle,
  Pencil,
  Youtube,
  BarChart3,
  ScrollText,
  GraduationCap,
  BookMarked,
  Search,
  Clock,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Filter,
  Book,
  Video,
  Calculator
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import blogContents from "@/data/blogContent";

// Blog post interface
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

// Tax guide interface 
interface TaxGuide {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

// Sample blog data (to be replaced with API call)
const blogPostsData: BlogPost[] = [
  {
    id: 1,
    title: "How to Choose Between Old and New Tax Regimes in 2025",
    slug: "old-vs-new-tax-regime-2025",
    summary: "Understand the key differences between old and new tax regimes to make the best choice for your financial situation.",
    content: "The choice between India's old and new tax regimes can significantly impact your tax liability...",
    authorId: 1,
    authorName: "Priya Sharma",
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
    content: "Section 80C is one of the most popular tax-saving sections under the Income Tax Act...",
    authorId: 2,
    authorName: "Rajesh Kumar",
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
    content: "Both NPS and ELSS offer tax benefits under the Income Tax Act, but they differ significantly...",
    authorId: 1,
    authorName: "Priya Sharma",
    featuredImage: "/blog/nps-elss-comparison.jpg",
    category: "Investments",
    tags: ["NPS", "ELSS", "mutual funds", "retirement"],
    readTime: 7,
    published: true,
    publishedAt: "2025-03-25T14:15:00Z",
    createdAt: "2025-03-20T11:30:00Z",
    updatedAt: "2025-03-25T13:00:00Z"
  },
  {
    id: 4,
    title: "Capital Gains Tax on Real Estate: Everything You Need to Know",
    slug: "capital-gains-real-estate",
    summary: "A comprehensive guide to understanding capital gains tax implications when selling property in India.",
    content: "When you sell a property in India, you may be liable to pay capital gains tax...",
    authorId: 3,
    authorName: "Amit Patel",
    featuredImage: "/blog/capital-gains-property.jpg",
    category: "Capital Gains",
    tags: ["real estate", "capital gains", "property tax"],
    readTime: 9,
    published: true,
    publishedAt: "2025-03-18T09:00:00Z",
    createdAt: "2025-03-10T15:45:00Z",
    updatedAt: "2025-03-18T08:30:00Z"
  },
  {
    id: 5,
    title: "GST Filing for Small Businesses: Step-by-Step Guide",
    slug: "gst-filing-small-business",
    summary: "Learn how to file GST returns for your small business with this easy-to-follow guide.",
    content: "Filing GST returns can be complex for small business owners, but with the right approach...",
    authorId: 2,
    authorName: "Rajesh Kumar",
    featuredImage: "/blog/gst-filing-guide.jpg",
    category: "GST",
    tags: ["GST", "small business", "tax filing"],
    readTime: 6,
    published: true,
    publishedAt: "2025-03-10T11:30:00Z",
    createdAt: "2025-03-05T13:15:00Z",
    updatedAt: "2025-03-10T10:00:00Z"
  },
  {
    id: 6,
    title: "Understanding TDS: How Much Tax is Deducted from Your Income",
    slug: "understanding-tds-deductions",
    summary: "A complete breakdown of Tax Deducted at Source (TDS) rates for different types of income in India.",
    content: "Tax Deducted at Source (TDS) is a mechanism where the person making certain payments...",
    authorId: 3,
    authorName: "Amit Patel",
    featuredImage: "/blog/tds-guide.jpg",
    category: "Income Tax",
    tags: ["TDS", "income tax", "salary taxation"],
    readTime: 5,
    published: true,
    publishedAt: "2025-02-28T10:45:00Z",
    createdAt: "2025-02-22T14:30:00Z",
    updatedAt: "2025-02-28T09:15:00Z"
  },
  {
    id: 7,
    title: "Understanding Capital Gains Tax in India",
    slug: "understanding-capital-gains",
    summary: "Learn the basics of capital gains tax in India, including the difference between short-term and long-term capital gains.",
    content: "Capital gains tax is a tax on the profit when you sell an asset that has increased in value...",
    authorId: 2,
    authorName: "Rajesh Kumar",
    featuredImage: "/blog/capital-gains-basics.jpg",
    category: "Capital Gains",
    tags: ["capital gains", "taxation basics", "STCG", "LTCG"],
    readTime: 9,
    published: true,
    publishedAt: "2025-02-20T14:30:00Z",
    createdAt: "2025-02-15T09:45:00Z",
    updatedAt: "2025-02-20T12:30:00Z"
  },
  {
    id: 8,
    title: "Capital Gains on Stocks and Mutual Funds",
    slug: "stocks-mutual-funds-capital-gains",
    summary: "Understand how capital gains tax applies to your investments in stocks and mutual funds, and strategies to minimize tax liability.",
    content: "When you sell stocks or mutual funds at a profit, you're liable to pay capital gains tax...",
    authorId: 1,
    authorName: "Priya Sharma",
    featuredImage: "/blog/stock-capital-gains.jpg",
    category: "Capital Gains",
    tags: ["stocks", "mutual funds", "capital gains", "equity"],
    readTime: 8,
    published: true,
    publishedAt: "2025-02-15T10:45:00Z",
    createdAt: "2025-02-10T11:30:00Z",
    updatedAt: "2025-02-15T09:15:00Z"
  },
  {
    id: 9,
    title: "Capital Gains Tax on Real Estate",
    slug: "real-estate-capital-gains",
    summary: "Learn about capital gains tax implications when selling property, and how to use exemptions under Section 54 and 54F.",
    content: "Real estate transactions often involve significant amounts and understanding the capital gains implications is crucial...",
    authorId: 3,
    authorName: "Amit Patel",
    featuredImage: "/blog/property-capital-gains.jpg",
    category: "Capital Gains",
    tags: ["real estate", "property tax", "section 54", "exemptions"],
    readTime: 10,
    published: true,
    publishedAt: "2025-02-05T11:20:00Z",
    createdAt: "2025-01-30T09:45:00Z",
    updatedAt: "2025-02-05T10:00:00Z"
  }
];

// Tax guides data 
const taxGuides: TaxGuide[] = [
  {
    id: "new-vs-old-regime",
    title: "New vs Old Tax Regime: Which Should You Choose?",
    description: "Understand the differences between the new and old tax regimes in India, and determine which option might save you more tax based on your income and investments.",
    image: "/guides/tax-regime-guide.jpg",
    category: "Tax Planning"
  },
  {
    id: "section-80c-80u",
    title: "Tax Benefits Under Section 80C to 80U",
    description: "Explore the comprehensive list of deductions available under various subsections from 80C to 80U, including investments, insurance, and medical expenses.",
    image: "/guides/tax-deductions.jpg",
    category: "Deductions"
  },
  {
    id: "gst-for-business",
    title: "GST for Small Businesses & Professionals",
    description: "Navigate the Goods and Services Tax framework for small businesses, freelancers, and professionals. Learn about registration, filing requirements, and input tax credits.",
    image: "/guides/gst-guide.jpg",
    category: "GST"
  },
  {
    id: "nps-elss-benefits",
    title: "Tax Benefits for NPS and ELSS Investments",
    description: "Discover the tax advantages of investing in National Pension System (NPS) and Equity-Linked Savings Schemes (ELSS) under Indian tax laws.",
    image: "/guides/investment-tax-benefits.jpg",
    category: "Investments"
  }
];

const LearningResources = () => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("blogs");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [activeCategory, setActiveCategory] = useState("all");
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Fetch blog posts from API
  const { data: blogData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['/api/blog-posts', activeCategory, searchTerm],
    queryFn: async () => {
      let url = '/api/blog-posts?published=true';
      
      if (activeCategory && activeCategory !== 'all') {
        url += `&category=${encodeURIComponent(activeCategory)}`;
      }
      
      if (searchTerm) {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }
      
      return fetch(url).then(res => res.json());
    },
    enabled: currentTab === "blogs",
  });
  
  // Check if blog post has detailed content
  const hasDetailedContent = (slug: string) => {
    return Object.keys(blogContents).includes(slug);
  };
  
  // Parse URL params for category and search query
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    
    if (category && categories.includes(category)) {
      setActiveCategory(category);
    }
    
    if (query) {
      setSearchTerm(query);
    }
  }, [location]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeCategory !== "all") {
      params.set('category', activeCategory);
    }
    
    if (searchTerm) {
      params.set('query', searchTerm);
    }
    
    if (currentTab !== "blogs") {
      params.set('tab', currentTab);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `/learning?${queryString}` : '/learning';
    
    if (newPath !== location) {
      setLocation(newPath);
    }
  }, [activeCategory, searchTerm, currentTab, setLocation]);
  
  // Process blog data from API
  // If API data isn't available yet, use dummy data temporarily to avoid errors
  const blogPosts = blogData?.posts || blogPostsData;
  const totalBlogCount = blogData?.total || blogPostsData.length;
  
  // Filter and search updates
  const filteredUpdates = taxGuides.filter(guide => {
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || guide.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from blog posts and tax guides
  const allCategories = [...(blogPosts?.map(post => post.category) || []), ...taxGuides.map(guide => guide.category)];
  const categories = ["all", ...Array.from(new Set(allCategories))];
  
  // Pagination logic for blogs
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalBlogPages = Math.ceil(blogPosts.length / postsPerPage);
  
  // Pagination logic for updates
  const currentUpdates = filteredUpdates.slice(indexOfFirstPost, indexOfLastPost);
  const totalUpdatePages = Math.ceil(filteredUpdates.length / postsPerPage);
  
  // Current total pages based on active tab
  const totalPages = currentTab === "blogs" ? totalBlogPages : totalUpdatePages;
  
  // Page change handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
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

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Learning Resources</h1>
        <p className="text-muted-foreground">
          Educational resources and guides to help you understand tax concepts and investment strategies.
        </p>
      </div>

      <Tabs defaultValue="blogs" className="w-full mb-12" onValueChange={(value) => setCurrentTab(value)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="blogs">Tax Blogs</TabsTrigger>
          <TabsTrigger value="latest-updates">Latest Updates</TabsTrigger>
        </TabsList>
        
        {/* Search bar - always visible */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={currentTab === "blogs" 
                ? "Search articles by title, content, or tags..." 
                : "Search updates by title or category..."}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-1/2 justify-start md:justify-end">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className="text-xs capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <TabsContent value="blogs">
          {/* Blog posts with pagination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoadingBlogs ? (
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex items-center mt-2 space-x-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex gap-1 mt-auto">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className={`flex flex-col h-full hover:shadow-md transition-all overflow-hidden group
                    ${hasDetailedContent(post.slug) ? 'border border-primary/30' : ''}
                  `}
                >
                  <div className="h-40 bg-muted dark:bg-muted/40 relative overflow-hidden">
                    {post.featuredImage ? (
                      <div className="absolute inset-0 bg-muted/20 group-hover:bg-muted/0 transition-all"></div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/90 text-white text-[10px] px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    {hasDetailedContent(post.slug) && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500/90 text-white text-[10px] px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-2 w-2 mr-1" />
                          {post.readTime} min read
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-[9px] px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {post.summary}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-xs">
                          <User className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">By {post.authorName}</span>
                        </div>
                        {hasDetailedContent(post.slug) && (
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                            Detailed Article
                          </span>
                        )}
                      </div>
                      <Link href={`/learning/blog/${post.slug}`}>
                        <Button 
                          variant={hasDetailedContent(post.slug) ? "default" : "ghost"} 
                          size="sm" 
                          className={`text-xs w-full justify-between ${!hasDetailedContent(post.slug) ? 'p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent' : ''}`}
                        >
                          Read Full Article
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                <div className="mb-4">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No blog posts match your search criteria. Try adjusting your search terms or category filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination controls */}
          {blogPosts.length > postsPerPage && !isLoadingBlogs && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="text-sm text-center">
                <span className="font-medium">Page {currentPage}</span>
                <span className="text-muted-foreground"> of {totalPages}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, blogPosts.length)} of {blogPosts.length} articles
                </div>
              </div>
              
              {/* Page numbers - visible on larger screens */}
              <div className="hidden md:flex items-center space-x-1">
                {totalPages > 5 && currentPage > 3 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="mx-1 text-muted-foreground">...</span>
                    )}
                  </>
                )}
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, 2 before and 2 after
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <Button
                        key={i}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  }
                  // Show ellipsis once
                  if (
                    (pageNumber === currentPage - 3 && currentPage > 3) ||
                    (pageNumber === currentPage + 3 && currentPage < totalPages - 2)
                  ) {
                    return <span key={i} className="mx-1 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="latest-updates">
          {/* Latest Updates with blog-like cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentUpdates.length > 0 ? (
              currentUpdates.map((guide) => (
                <Card 
                  key={guide.id} 
                  className="flex flex-col h-full hover:shadow-md transition-all overflow-hidden group border border-primary/30"
                >
                  <div className="h-40 bg-muted dark:bg-muted/40 relative overflow-hidden">
                    <div className="h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/30" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/90 text-white text-[10px] px-2 py-1 rounded-full">
                        {guide.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500/90 text-white text-[10px] px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-2 w-2 mr-1" />
                        5 min read
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>May 10, 2025</span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          tax guide
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          update
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {guide.description}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-xs">
                          <User className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">By Tax Expert</span>
                        </div>
                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                          Latest Update
                        </span>
                      </div>
                      <Link href={`/learning/guides/${guide.id}`}>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="text-xs w-full justify-between"
                        >
                          Read Full Update
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                <div className="mb-4">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No updates match your search criteria. Try adjusting your search terms or category filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination controls for updates */}
          {filteredUpdates.length > postsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="text-sm text-center">
                <span className="font-medium">Page {currentPage}</span>
                <span className="text-muted-foreground"> of {totalPages}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredUpdates.length)} of {filteredUpdates.length} updates
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>

      </Tabs>
      
      {/* Featured Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="bg-muted dark:bg-muted/40 p-6 flex justify-center">
              <BookMarked className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tax Ebooks & Guides</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Download our comprehensive tax guides, ebooks, and checklists to navigate your tax filing journey.
              </p>
              <Link href="/learning/ebooks">
                <div className="text-primary font-medium hover:underline">Browse Library →</div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="bg-muted dark:bg-muted/40 p-6 flex justify-center">
              <Youtube className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Watch step-by-step video guides on tax filing, deductions, and common tax scenarios explained.
              </p>
              <Link href="/learning/videos">
                <div className="text-primary font-medium hover:underline">Watch Videos →</div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="bg-muted dark:bg-muted/40 p-6 flex justify-center">
              <Calculator className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tax Calculators</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Use our online calculators to estimate taxes, compare tax regimes, and plan your investments.
              </p>
              <Link href="/calculators">
                <div className="text-primary font-medium hover:underline">Try Calculators →</div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Tax Filing Academy Section */}
      <div className="bg-muted dark:bg-muted/30 rounded-lg p-6 md:p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Tax Filing Academy</h2>
          <p className="text-muted-foreground">
            Learn the fundamentals of Indian taxation through our structured courses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center text-blue-600 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Basics of Income Tax</h3>
              <p className="text-xs text-muted-foreground">Understanding tax slabs, surcharge, and filing requirements</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 w-12 h-12 flex items-center justify-center text-green-600 mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Deductions Masterclass</h3>
              <p className="text-xs text-muted-foreground">Maximize your tax savings through legal deductions</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 w-12 h-12 flex items-center justify-center text-purple-600 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Investment & Taxation</h3>
              <p className="text-xs text-muted-foreground">Tax-efficient investment strategies for wealth building</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-12 h-12 flex items-center justify-center text-yellow-600 mb-4">
                <ScrollText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">ITR Filing Guide</h3>
              <p className="text-xs text-muted-foreground">Step-by-step walkthrough of the tax filing process</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/learning/courses">
            <Button className="w-full md:w-auto">
              Explore All Courses
            </Button>
          </Link>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div>
                  <HelpCircle className="h-6 w-6 text-primary/80" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How do I know which ITR form to use?</h3>
                  <p className="text-sm text-muted-foreground">
                    The ITR form selection depends on your income sources. Our platform automatically suggests the appropriate form based on your income details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div>
                  <HelpCircle className="h-6 w-6 text-primary/80" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What is the due date for filing ITR for AY 2025-26?</h3>
                  <p className="text-sm text-muted-foreground">
                    For individuals not subject to audit, the due date is July 31, 2025. For businesses requiring audit, it's October 31, 2025.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div>
                  <HelpCircle className="h-6 w-6 text-primary/80" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What documents do I need for filing ITR?</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll need Form 16, Form 26AS, bank statements, investment proofs, property documents (if applicable), and Aadhaar or PAN details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div>
                  <HelpCircle className="h-6 w-6 text-primary/80" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How long does it take to file ITR on your platform?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most users complete the process in 15-30 minutes if they have all documents ready. For complex returns, it may take up to an hour.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/support/faq">
            <Button variant="outline" size="lg">
              View All FAQs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;
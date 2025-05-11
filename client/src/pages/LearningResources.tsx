import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
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
  
  // Filter and search blogs
  const filteredBlogs = blogPostsData.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from blog posts
  const categories = ["all", ...Array.from(new Set(blogPostsData.map(post => post.category)))];
  
  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  
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
  
  // Tax guides data
  const taxGuides = [
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

  // Capital Gains guides data
  const capitalGainsGuides = [
    {
      id: "understanding-capital-gains",
      title: "Understanding Capital Gains Tax in India",
      description: "Learn the basics of capital gains tax in India, including the difference between short-term and long-term capital gains, and how they are taxed.",
      category: "Basics"
    },
    {
      id: "stocks-mutual-funds",
      title: "Capital Gains on Stocks and Mutual Funds",
      description: "Understand how capital gains tax applies to your investments in stocks and mutual funds, and strategies to minimize your tax liability.",
      category: "Equity"
    },
    {
      id: "real-estate-capital-gains",
      title: "Capital Gains Tax on Real Estate",
      description: "Learn about capital gains tax implications when selling property, and how to use exemptions under Section 54 and 54F.",
      category: "Real Estate"
    },
    {
      id: "capital-gains-indexation",
      title: "Indexation Benefits for Long-Term Capital Gains",
      description: "Understand how indexation can help reduce your tax liability on long-term capital gains from debt funds and property.",
      category: "Tax Planning"
    },
    {
      id: "foreign-assets",
      title: "Capital Gains on Foreign Assets",
      description: "Learn about tax implications for Indian residents selling assets located outside India, including foreign stocks and property.",
      category: "International"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Learning Resources</h1>
        <p className="text-muted-foreground">
          Educational resources and guides to help you understand tax concepts and investment strategies.
        </p>
      </div>

      <Tabs defaultValue="blogs" className="w-full mb-12" onValueChange={(value) => setCurrentTab(value)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="blogs">Tax Blogs</TabsTrigger>
          <TabsTrigger value="tax-guides">Tax Guides</TabsTrigger>
          <TabsTrigger value="capital-gains">Capital Gains</TabsTrigger>
        </TabsList>
        
        {/* Search bar - only visible on the blogs tab */}
        {currentTab === "blogs" && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, content, or tags..."
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
        )}
        
        <TabsContent value="blogs">
          {/* Blog posts with pagination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPosts.length > 0 ? (
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
          {filteredBlogs.length > postsPerPage && (
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
                  Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredBlogs.length)} of {filteredBlogs.length} articles
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
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Logic to show current page and nearby pages
                  let pageNum: number;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all page numbers
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start, show pages 1-5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end, show the last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Show current page and 2 pages before and after
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="mx-1 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
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
          
          {isAuthenticated && user?.role === "admin" && (
            <div className="mt-8 text-center">
              <Link href="/admin/blog/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Pencil className="mr-2 h-4 w-4" /> Create New Blog Post
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tax-guides">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxGuides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-video bg-muted dark:bg-muted/40 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/70" />
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{guide.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{guide.description}</p>
                  <Link href={`/learning/${guide.id}`}>
                    <div className="text-primary font-medium hover:underline">Read Full Guide →</div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/learning">
              <Button variant="outline" size="lg" className="mt-4">
                View All Tax Guides
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="capital-gains">
          <div className="flex flex-col space-y-6">
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 border border-border mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Capital Gains Learning Center</h2>
                  <p className="text-muted-foreground mb-4">
                    Understanding capital gains tax is crucial for investors. Explore our comprehensive guides to learn about taxation of different asset classes, holding periods, and strategies to optimize your tax liability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Stocks
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Mutual Funds
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Real Estate
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Gold
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Debt
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Foreign Assets
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capitalGainsGuides.map((guide, index) => (
                <Card key={index} className="flex flex-col h-full transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm flex-grow">{guide.description}</p>
                    <Link href={`/learning/capital-gains/${guide.id}`}>
                      <div className="text-primary font-medium hover:underline">Read More →</div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/import-cg">
                <Button className="mt-4">
                  Import Capital Gains Data
                </Button>
              </Link>
            </div>
          </div>
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
                Visual learner? Watch our video tutorials explaining complex tax concepts in simple terms.
              </p>
              <Link href="/learning/videos">
                <div className="text-primary font-medium hover:underline">Watch Now →</div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="bg-muted dark:bg-muted/40 p-6 flex justify-center">
              <GraduationCap className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tax Webinars</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Join our expert-led webinars on tax planning, investment strategies, and regulatory updates.
              </p>
              <Link href="/learning/webinars">
                <div className="text-primary font-medium hover:underline">View Schedule →</div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Box */}
      <Card className="bg-primary/5 dark:bg-primary/10 border-0 mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Need Personalized Tax Guidance?</h3>
              <p className="text-muted-foreground mb-4">
                Our tax experts are ready to help you navigate complex Indian tax situations 
                and find the best solutions for your specific needs.
              </p>
              <Link href="/support" className="text-primary hover:underline font-medium">
                Contact Our Tax Experts →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningResources;
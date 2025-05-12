import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  Save, 
  Calendar 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Sample blog post data (to be replaced with API call)
const blogPostsData = [
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
  }
];

// Category options (can be fetched from API)
const categoryOptions = [
  "Tax Planning",
  "Deductions",
  "GST",
  "Investments",
  "Capital Gains",
  "Income Tax"
];

// Component to manage blog posts
const BlogAdmin = () => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(blogPostsData);
  const [tabValue, setTabValue] = useState("published");
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Filter posts based on search and tab
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = (tabValue === "published" && post.published) || 
                      (tabValue === "drafts" && !post.published);
    
    return matchesSearch && matchesTab;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handle delete post
  const handleDeleteConfirm = () => {
    if (deletePostId) {
      setPosts(posts.filter(post => post.id !== deletePostId));
      setConfirmDeleteOpen(false);
      setDeletePostId(null);
    }
  };
  
  // Check for admin access
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this page.
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage blog posts for the learning resources section.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/blog/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Post
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Search and filtering */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/2">
            <Input
              placeholder="Search posts by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Published vs Drafts */}
      <Tabs defaultValue="published" className="w-full mb-6" onValueChange={setTabValue}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="published">Published ({posts.filter(p => p.published).length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({posts.filter(p => !p.published).length})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Blog post list */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-sm transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {post.published ? (
                            <><Check className="h-3 w-3 mr-1" /> Published</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> Draft</>
                          )}
                        </span>
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                          {post.category}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.published ? formatDate(post.publishedAt) : 'Not published'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>By {post.authorName}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 items-center p-4 md:p-6 bg-muted/30 dark:bg-muted/10">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/learning/blog/${post.slug}`}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => {
                        setDeletePostId(post.id);
                        setConfirmDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-10 text-center">
            <div className="mb-4">
              <svg className="h-16 w-16 mx-auto text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchTerm 
                ? "No posts match your search criteria. Try adjusting your search terms."
                : `No ${tabValue === "published" ? "published posts" : "drafts"} available.`
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdmin;
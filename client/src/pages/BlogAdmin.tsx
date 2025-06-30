import {
  ArrowLeft,
  Calendar,
  Check,
  Eye,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react"; // Sorted imports
import { useEffect, useState } from "react"; // Sorted imports
import { Link, useLocation } from "wouter";

import TiptapEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminGuard } from '@/hooks/useAdminGuard';

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

// Define component props interface
interface BlogAdminProps {
  mode?: "create" | "edit" | "list";
  id?: string;
}

interface BlogPostFormState {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[]; // Ensure this is string[]
  readTime: number;
  published: boolean;
  featuredImage: string;
  authorId?: number; // Made optional as it's set by server
  authorName?: string; // Made optional, for display, not submission
}

// Component to manage blog posts
const BlogAdmin = ({ mode = "list", id }: BlogAdminProps) => {
  const [, setLocation] = useLocation();
  const isAdmin = useAdminGuard();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(blogPostsData); // This state holds the full post structure from sample data
  const [tabValue, setTabValue] = useState(mode === "create" ? "new" : mode === "edit" ? "edit" : "published");
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const initialFormState: BlogPostFormState = {
    title: "",
    slug: "",
    summary: "",
    content: "", 
    category: categoryOptions[0] || "",
    tags: [], 
    readTime: 5,
    published: false,
    featuredImage: "", 
    authorId: 1, 
    authorName: "Admin", 
  };

  const [currentPostData, setCurrentPostData] = useState<BlogPostFormState>(initialFormState);
  
  // If in edit mode, find the post by id and set form data
  const editingPost = mode === "edit" && id ?
    posts.find(post => post.id === Number(id)) : null;

  useEffect(() => {
    if (mode === "edit" && editingPost) {
      setCurrentPostData({
        title: editingPost.title || "",
        slug: editingPost.slug || "",
        summary: editingPost.summary || "",
        content: editingPost.content || "",
        category: editingPost.category || categoryOptions[0] || "",
        tags: Array.isArray(editingPost.tags) ? editingPost.tags : [], // Ensure tags is an array
        readTime: editingPost.readTime || 5,
        published: editingPost.published || false,
        featuredImage: editingPost.featuredImage || "",
        authorId: editingPost.authorId || 1,
        authorName: editingPost.authorName || "Admin",
      });
    } else if (mode === "create") {
      setCurrentPostData(initialFormState);
    }
  }, [mode, id, editingPost, posts]); 
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentPostData(prev => ({ ...prev, published: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setCurrentPostData(prev => ({ ...prev, category: value }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simple comma-separated tags for now
    setCurrentPostData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
  };

  const handleContentChange = (newContent: string) => {
    setCurrentPostData(prev => ({ ...prev, content: newContent }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = mode === "create" ? "/api/blog-posts/admin" : `/api/blog-posts/admin/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

    // Ensure tags are an array of strings, even if input was empty
    // Server expects tags as a comma-separated string or null
    const tagsAsString = currentPostData.tags.length > 0 ? currentPostData.tags.join(',') : null;

    // authorId and authorName should not be sent; server sets authorId.
    // Prefix with _ to indicate they are intentionally unused after destructuring.
    const { authorId: _authorId, authorName: _authorName, ...payloadToSend } = currentPostData;

    const postPayload = {
      ...payloadToSend,
      tags: tagsAsString, 
      readTime: Number(currentPostData.readTime) || 0,
    };
    
    try {
      const response = await fetchWithAdminAuth(url, {
        method: method,
        body: JSON.stringify(postPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to ${mode === "create" ? "create" : "update"} post` }));
        throw new Error(errorData.message);
      }

      const savedPostData = await response.json();
      
      // The API returns the full post object including authorId and potentially joined authorName.
      // We need to ensure our local 'posts' state matches this structure.
      // For now, assume savedPostData has a compatible structure or adapt as needed.
      const newOrUpdatedPostForState = {
        ...initialFormState, // Start with a base structure
        ...savedPostData, // Overlay with API response
        tags: Array.isArray(savedPostData.tags) ? savedPostData.tags : (typeof savedPostData.tags === 'string' ? savedPostData.tags.split(',').map((t:string) => t.trim()) : []),
        // Ensure authorName is present if needed for display, API might not return it.
        authorName: savedPostData.authorName || currentPostData.authorName || "Admin", 
      };


      toast({
        title: `Post ${mode === "create" ? "Created" : "Updated"}`,
        description: `"${newOrUpdatedPostForState.title}" has been successfully saved.`,
      });

      if (mode === "create") {
        // Add the new post to the local state
        // Ensure the structure matches what the list expects (e.g., if it needs authorName)
        setPosts(prevPosts => [newOrUpdatedPostForState, ...prevPosts]);
      } else {
        // Update the existing post in the local state
        setPosts(prevPosts => prevPosts.map(p => (p.id === newOrUpdatedPostForState.id ? newOrUpdatedPostForState : p)));
      }
      setLocation("/admin/blog"); 
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} post:`, error);
      toast({
        title: `Error ${mode === "create" ? "Creating" : "Updating"} Post`,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  // Use admin tokens for all fetch requests
  const fetchWithAdminAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) throw new Error('No admin auth token');
      
      const { token } = JSON.parse(adminAuth);
      
      // Create new Headers object
      const defaultHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      // Add any existing headers from options
      if (options.headers) {
        const existingHeaders = options.headers instanceof Headers 
          ? options.headers 
          : new Headers(options.headers as HeadersInit);
          
        // Merge headers
        for (const [key, value] of Array.from(existingHeaders.entries())) {
          defaultHeaders.set(key, value);
        }
      }
      
      return fetch(url, {
        ...options,
        headers: defaultHeaders
      });
    } catch (error) {
      console.error('Fetch with admin auth error:', error);
      throw error;
    }
  };
  
  // Fetch posts from API
  useEffect(() => {
    const loadPosts = async () => {
      if (isAdmin) { // This check is good
        try {
          // Fetch all posts (published and drafts) for admin view
          const response = await fetchWithAdminAuth('/api/blog-posts/admin'); 
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch blog posts' }));
            throw new Error(errorData.message);
          }
          
          const data = await response.json();
          // The API /api/blog-posts/admin returns an array of posts directly
          setPosts(Array.isArray(data) ? data : blogPostsData); 
        } catch (error) {
          console.error('Error loading blog posts:', error);
          toast({
            title: 'Error',
            description: 'Failed to load blog posts. Using sample data instead.',
            variant: 'destructive'
          });
        }
      }
    };
    
    loadPosts();
  }, [isAdmin]);
  
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
  const handleDeleteConfirm = async () => {
    if (deletePostId) {
      try {
        const response = await fetchWithAdminAuth(`/api/blog-posts/admin/${deletePostId}`, {
          method: "DELETE",
        });

        if (!response.ok && response.status !== 204) { // Check for non-OK and not 204
            const errorData = await response.json().catch(() => ({ message: 'Failed to delete post' }));
            throw new Error(errorData.message);
        }
        // If response.ok or response.status is 204, deletion was successful

        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletePostId));
        toast({
          title: "Post Deleted",
          description: "The blog post has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          title: "Error Deleting Post",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
          variant: "destructive",
        });
      } finally {
        setConfirmDeleteOpen(false);
        setDeletePostId(null);
      }
    }
  };
  
  // Check for admin access
  if (isAdmin === false) {
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
  
  // Show loading state while checking admin status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (mode === "create" || mode === "edit") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" size="sm" onClick={() => setLocation("/admin/blog")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog List
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}</CardTitle>
            <CardDescription>
              {mode === "create" ? "Fill in the details for your new blog post." : `Editing: ${editingPost?.title || 'post'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentPostData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={currentPostData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., my-awesome-post"
                  required
                />
                 <p className="text-xs text-muted-foreground mt-1">
                    Tip: A good slug is short, descriptive, and uses hyphens. Example: `understanding-tax-brackets`
                  </p>
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={currentPostData.summary}
                  onChange={handleInputChange}
                  placeholder="Write a short summary of the post (1-2 sentences)"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <TiptapEditor
                  content={currentPostData.content}
                  onChange={handleContentChange}
                  className="mt-1" // Add any specific styling needed for the container
                />
                 {/* The Textarea is now replaced by TiptapEditor */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={currentPostData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    value={currentPostData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={currentPostData.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g., tax, finance, guide"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={currentPostData.published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <Input
                  id="featuredImage"
                  name="featuredImage"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("image", file); // "image" should match the fieldName in handleFileUpload

                      try {
                        // Assuming fetchWithAdminAuth handles admin token
                        const response = await fetchWithAdminAuth("/api/admin/upload-image", {
                          method: "POST",
                          body: formData,
                          // Content-Type is set automatically by browser for FormData
                        });
                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.message || "Image upload failed");
                        }
                        const result = await response.json();
                        setCurrentPostData(prev => ({ ...prev, featuredImage: result.imageUrl }));
                        toast({ title: "Image Uploaded", description: "Featured image updated." });
                      } catch (error) {
                        console.error("Error uploading featured image:", error);
                        toast({
                          title: "Image Upload Failed",
                          description: error instanceof Error ? error.message : "Could not upload image.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                />
                {currentPostData.featuredImage && (
                  <div className="mt-2">
                    <img src={currentPostData.featuredImage} alt="Featured preview" className="max-h-40 rounded-md border" />
                    <p className="text-xs text-muted-foreground mt-1">Current image: {currentPostData.featuredImage}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/admin/blog")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Save Post" : "Update Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Original list view rendering
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
      <Tabs defaultValue={tabValue} className="w-full mb-6" onValueChange={setTabValue}> {/* Use tabValue here */}
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
                            <><Calendar className="h-3 w-3 mr-1" /> Draft</>
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
                      <Link href={`/learning/blog/${post.slug}`}> {/* Corrected path for viewing post */}
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

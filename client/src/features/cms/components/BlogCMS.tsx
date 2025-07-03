import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  Upload, 
  Image, 
  Calendar, 
  Tag, 
  Globe, 
  Settings,
  BarChart,
  Users,
  FileText,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import TiptapEditor from '@/components/RichTextEditor';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';

// Types
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  featuredImage?: string;
  readTime: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
}

// API Helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const adminAuth = localStorage.getItem('adminAuth');
  if (!adminAuth) throw new Error('Not authenticated');

  const { token } = JSON.parse(adminAuth);
  
  const response = await fetch(`/api/cms${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Main CMS Component
const BlogCMS: React.FC = () => {
  const [, setLocation] = useLocation();
  const isAdmin = useAdminGuard();
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for creating/editing posts
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: '',
    readTime: 5,
    published: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  // Load initial data
  useEffect(() => {
    if (isAdmin) {
      loadPosts();
      loadStats();
      loadMediaFiles();
    }
  }, [isAdmin, currentPage, categoryFilter, statusFilter, searchTerm]);

  // API Functions
  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { published: statusFilter === 'published' ? 'true' : 'false' }),
        ...(searchTerm && { searchTerm }),
      });

      const data = await apiRequest(`/blog/posts?${params}`);
      setPosts(data.posts);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiRequest('/blog/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadMediaFiles = async () => {
    try {
      const data = await apiRequest('/media/files');
      setMediaFiles(data.files);
    } catch (error) {
      console.error('Failed to load media files:', error);
    }
  };

  const savePost = async () => {
    try {
      setLoading(true);

      // Auto-generate slug if empty
      if (!postForm.slug && postForm.title) {
        postForm.slug = postForm.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }

      const data = selectedPost
        ? await apiRequest(`/blog/posts/${selectedPost.id}`, {
            method: 'PUT',
            body: JSON.stringify(postForm),
          })
        : await apiRequest('/blog/posts', {
            method: 'POST',
            body: JSON.stringify(postForm),
          });

      toast({
        title: 'Success',
        description: `Post ${selectedPost ? 'updated' : 'created'} successfully`,
      });

      setIsEditing(false);
      setSelectedPost(null);
      resetForm();
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiRequest(`/blog/posts/${postId}`, { method: 'DELETE' });
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) throw new Error('Not authenticated');

      const { token } = JSON.parse(adminAuth);

      const response = await fetch('/api/cms/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      loadMediaFiles();
      return data.url;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: '',
      tags: '',
      featuredImage: '',
      readTime: 5,
      published: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
  };

  const editPost = (post: BlogPost) => {
    setSelectedPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage || '',
      readTime: post.readTime,
      published: post.published,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: post.seoKeywords || '',
    });
    setIsEditing(true);
  };

  const createNewPost = () => {
    setSelectedPost(null);
    resetForm();
    setIsEditing(true);
  };

  // Access control check
  if (isAdmin === false) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need administrator privileges to access the Content Management System.
        </p>
        <Button onClick={() => setLocation('/login')}>Login</Button>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Blog CMS</h1>
              <Badge variant="secondary">WordPress-like Editor</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={createNewPost}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isEditing ? (
          // Post Editor
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedPost ? 'Edit Post' : 'Create New Post'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedPost(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={savePost}
                    disabled={loading || !postForm.title || !postForm.content}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Post'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="Enter post title"
                      className="text-lg font-medium"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={postForm.slug}
                      onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                      placeholder="url-friendly-slug"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL: /blog/{postForm.slug || 'your-post-slug'}
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <Label htmlFor="summary">Summary *</Label>
                    <Textarea
                      id="summary"
                      value={postForm.summary}
                      onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>

                  {/* Content Editor */}
                  <div>
                    <Label>Content *</Label>
                    <div className="mt-2 border rounded-md">
                      <TiptapEditor
                        content={postForm.content}
                        onChange={(content) => setPostForm({ ...postForm, content })}
                        onImageUpload={uploadFile}
                      />
                    </div>
                  </div>

                  {/* SEO Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        SEO Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="seoTitle">SEO Title</Label>
                        <Input
                          id="seoTitle"
                          value={postForm.seoTitle}
                          onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                          placeholder="Optimized title for search engines"
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground">
                          {postForm.seoTitle.length}/60 characters
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="seoDescription">Meta Description</Label>
                        <Textarea
                          id="seoDescription"
                          value={postForm.seoDescription}
                          onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                          placeholder="Description that appears in search results"
                          rows={3}
                          maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground">
                          {postForm.seoDescription.length}/160 characters
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="seoKeywords">Keywords</Label>
                        <Input
                          id="seoKeywords"
                          value={postForm.seoKeywords}
                          onChange={(e) => setPostForm({ ...postForm, seoKeywords: e.target.value })}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Publish Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Publish</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="published">Published</Label>
                        <Switch
                          id="published"
                          checked={postForm.published}
                          onCheckedChange={(checked) => setPostForm({ ...postForm, published: checked })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="readTime">Read Time (minutes)</Label>
                        <Input
                          id="readTime"
                          type="number"
                          value={postForm.readTime}
                          onChange={(e) => setPostForm({ ...postForm, readTime: parseInt(e.target.value) || 0 })}
                          min={1}
                          max={60}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Categories & Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={postForm.category} onValueChange={(value) => setPostForm({ ...postForm, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                            <SelectItem value="Deductions">Deductions</SelectItem>
                            <SelectItem value="GST">GST</SelectItem>
                            <SelectItem value="Investments">Investments</SelectItem>
                            <SelectItem value="Capital Gains">Capital Gains</SelectItem>
                            <SelectItem value="Income Tax">Income Tax</SelectItem>
                            <SelectItem value="News">News</SelectItem>
                            <SelectItem value="Guides">Guides</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          value={postForm.tags}
                          onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                          placeholder="tag1, tag2, tag3"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate tags with commas
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Featured Image */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Image className="h-5 w-5 mr-2" />
                        Featured Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {postForm.featuredImage ? (
                        <div className="space-y-2">
                          <img
                            src={postForm.featuredImage}
                            alt="Featured"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPostForm({ ...postForm, featuredImage: '' })}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowMediaLibrary(true)}
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Add Featured Image
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Main Dashboard
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search posts..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                          <SelectItem value="Deductions">Deductions</SelectItem>
                          <SelectItem value="GST">GST</SelectItem>
                          <SelectItem value="Investments">Investments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Posts</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Drafts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setCategoryFilter('');
                          setStatusFilter('all');
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{post.title}</h3>
                              <Badge variant={post.published ? 'default' : 'secondary'}>
                                {post.published ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.summary}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>By {post.authorName}</span>
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span>{post.readTime} min read</span>
                              {post.tags && (
                                <span className="flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {post.tags.split(',').slice(0, 2).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editPost(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => deletePost(post.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No posts found</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first blog post to get started.
                      </p>
                      <Button onClick={createNewPost}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Media Library</CardTitle>
                    <Button onClick={() => document.getElementById('file-upload')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file);
                    }}
                  />
                  
                  {mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {mediaFiles.map((file) => (
                        <div
                          key={file.filename}
                          className="border rounded-lg overflow-hidden hover:border-primary cursor-pointer"
                          onClick={() => setPostForm({ ...postForm, featuredImage: file.url })}
                        >
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <p className="text-xs truncate">{file.filename}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No media files</h3>
                      <p className="text-muted-foreground">Upload images to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.totalPosts}</div>
                      <p className="text-xs text-muted-foreground">Total Posts</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                      <p className="text-xs text-muted-foreground">Published</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.draftPosts}</div>
                      <p className="text-xs text-muted-foreground">Drafts</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.totalViews}</div>
                      <p className="text-xs text-muted-foreground">Total Views</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Settings</CardTitle>
                  <CardDescription>
                    Configure your blog settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      Blog settings configuration will be available in the next update.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Media Library Modal */}
      <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>
              Select an image or upload a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {mediaFiles.map((file) => (
              <div
                key={file.filename}
                className="border rounded-lg overflow-hidden hover:border-primary cursor-pointer"
                onClick={() => {
                  setPostForm({ ...postForm, featuredImage: file.url });
                  setShowMediaLibrary(false);
                }}
              >
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogCMS;
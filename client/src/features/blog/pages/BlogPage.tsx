import React, { useState, useEffect } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { Search, Calendar, Clock, Eye, Tag, Filter, Grid, List, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  readTime: number;
  authorName: string;
  publishedAt: string;
  views: number;
}

interface Category {
  name: string;
  count: number;
}

interface BlogPageProps {
  category?: string;
  tag?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ category, tag }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedTag, setSelectedTag] = useState(tag || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [, setLocation] = useLocation();

  // Load posts
  const loadPosts = async (page = 1, search = '', cat = '', t = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(cat && { category: cat }),
        ...(t && { tag: t }),
      });

      const response = await fetch(`/api/blog/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    loadPosts(1, searchTerm, selectedCategory, selectedTag);
    loadCategories();
  }, [selectedCategory, selectedTag]);

  // Handle search
  const handleSearch = () => {
    loadPosts(1, searchTerm, selectedCategory, selectedTag);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadPosts(page, searchTerm, selectedCategory, selectedTag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get page title
  const getPageTitle = () => {
    if (category) return `${category} Articles`;
    if (tag) return `Posts tagged "${tag}"`;
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    return 'Blog';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{getPageTitle()}</h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert insights on tax planning, compliance, and financial strategies
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search articles..."
                  className="pl-10 pr-20 py-3 text-gray-900"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-1 top-1 bottom-1 px-4"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedTag('');
                        setSearchTerm('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.slice(0, 5).map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedCategory(cat.name)}
                      >
                        <span className="text-sm">{cat.name}</span>
                        <Badge variant="secondary">{cat.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle & Results */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${posts.length} articles found`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Posts Grid/List */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {posts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                    {viewMode === 'grid' ? (
                      <>
                        {post.featuredImage && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{post.category}</Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.readTime} min
                            </div>
                          </div>
                          
                          <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                            <Link href={`/blog/${post.slug}`} className="block">
                              {post.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.summary}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(post.publishedAt)}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {post.views}
                              </span>
                            </div>
                            <span>By {post.authorName}</span>
                          </div>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedTag(tag);
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {post.featuredImage && (
                            <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{post.category}</Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {post.readTime} min
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(post.publishedAt)}
                                </span>
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {post.views}
                                </span>
                                <span>By {post.authorName}</span>
                              </div>
                              
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="ghost" size="sm">
                                  Read More
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              </Link>
                            </div>
                            
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {post.tags.slice(0, 5).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs cursor-pointer"
                                    onClick={() => setSelectedTag(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedTag('');
                    setSearchTerm('');
                    loadPosts(1);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span>...</span>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
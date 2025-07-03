import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  FileText,
  FileImage,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  Clock,
  Activity,
} from 'lucide-react';
import { formatDate } from '@myeca/ui';
import { useAuthStore } from '../stores/auth.store';

interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    views: number;
  };
  files: {
    total: number;
    totalSize: number;
    uploadedToday: number;
  };
  users: {
    total: number;
    activeToday: number;
    newThisWeek: number;
  };
  activity: {
    recentPosts: Array<{
      id: number;
      title: string;
      status: string;
      createdAt: string;
      viewCount: number;
    }>;
  };
}

export default function DashboardPage() {
  const { user, hasRole } = useAuthStore();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get<DashboardStats>('/api/admin/dashboard-stats');
      return response.data;
    },
    // Placeholder data while API is not implemented
    placeholderData: {
      posts: { total: 42, published: 35, drafts: 7, views: 15234 },
      files: { total: 128, totalSize: 524288000, uploadedToday: 5 },
      users: { total: 23, activeToday: 12, newThisWeek: 3 },
      activity: {
        recentPosts: [
          {
            id: 1,
            title: 'Getting Started with Tax Planning',
            status: 'PUBLISHED',
            createdAt: new Date().toISOString(),
            viewCount: 1234,
          },
          {
            id: 2,
            title: 'Understanding GST Compliance',
            status: 'DRAFT',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            viewCount: 0,
          },
        ],
      },
    },
  });
  
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<{ className?: string }>; 
    description?: string; 
    trend?: number;
  }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your platform today.
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="dashboard-grid">
        <StatCard
          title="Total Posts"
          value={stats?.posts.total || 0}
          icon={FileText}
          description={`${stats?.posts.published || 0} published, ${stats?.posts.drafts || 0} drafts`}
          trend={12}
        />
        
        <StatCard
          title="Total Views"
          value={stats?.posts.views.toLocaleString() || 0}
          icon={Eye}
          description="Across all published posts"
          trend={8}
        />
        
        {hasRole('ADMIN') && (
          <StatCard
            title="Total Files"
            value={stats?.files.total || 0}
            icon={FileImage}
            description={`${stats?.files.uploadedToday || 0} uploaded today`}
            trend={5}
          />
        )}
        
        {hasRole('SUPER_ADMIN') && (
          <StatCard
            title="Total Users"
            value={stats?.users.total || 0}
            icon={Users}
            description={`${stats?.users.activeToday || 0} active today`}
            trend={15}
          />
        )}
      </div>
      
      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {stats?.activity.recentPosts.map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-md ${
                  post.status === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* System status */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium">45ms</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-1/5"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">2.4GB / 10GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/4"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Database Size</span>
                <span className="text-sm font-medium">156MB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-1/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
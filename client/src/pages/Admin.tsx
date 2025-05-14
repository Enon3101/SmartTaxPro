import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Users, FileText, ChevronRight, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TaxForm, User as UserType } from '@shared/schema';

// Admin guard hook to protect admin routes
export function useAdminGuard() {
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Check localStorage first
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) {
          setLocation('/admin-login');
          setIsAdmin(false);
          return;
        }

        // Validate token on the server
        const response = await apiRequest("GET", "/api/auth/verify-admin", undefined, {});

        if (!response.ok) {
          // Token invalid or expired
          localStorage.removeItem('adminAuth');
          setLocation('/admin-login');
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin verification error:", error);
        localStorage.removeItem('adminAuth');
        setLocation('/admin-login');
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [setLocation]);

  return isAdmin;
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) return;

        const response = await apiRequest("GET", "/api/admin/users");

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button variant="outline">Add New User</Button>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Username</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4 align-middle">{user.id}</td>
                    <td className="p-4 align-middle">{user.username}</td>
                    <td className="p-4 align-middle">{user.email || '-'}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Tax Forms Management Component
function TaxFormManagement() {
  const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTaxForms = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) return;

        const response = await apiRequest("GET", "/api/admin/tax-forms");

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tax forms");
        }
        
        setTaxForms(data);
      } catch (error) {
        console.error("Error fetching tax forms:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load tax forms",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaxForms();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tax Form Management</h2>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">User ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Form Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Assessment Year</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxForms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">No tax forms found</td>
                </tr>
              ) : (
                taxForms.map((form) => (
                  <tr key={form.id} className="border-b">
                    <td className="p-4 align-middle">{form.id.substring(0, 8)}...</td>
                    <td className="p-4 align-middle">{form.userId || '-'}</td>
                    <td className="p-4 align-middle">{form.formType}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        form.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        form.status === 'filed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {form.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{form.assessmentYear}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({
    userCount: 0,
    taxFormCount: 0,
    completedForms: 0,
    inProgressForms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) return;

        const response = await apiRequest("GET", "/api/admin/dashboard-stats");

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch dashboard stats");
        }
        
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <div className="flex items-center pt-2">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taxFormCount}</div>
            <div className="flex items-center pt-2">
              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-xs text-muted-foreground">ITR forms created</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedForms}</div>
            <div className="flex items-center pt-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-xs text-muted-foreground">Filing complete</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressForms}</div>
            <div className="flex items-center pt-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-xs text-muted-foreground">Filing in progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New users that have registered</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock data - will be replaced with real data */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">User will appear here</p>
                  <p className="text-xs text-muted-foreground">Connected to real data</p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  View
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Tax Forms</CardTitle>
            <CardDescription>Latest tax forms created</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock data - will be replaced with real data */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Form will appear here</p>
                  <p className="text-xs text-muted-foreground">Connected to real data</p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  View
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Component
function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your admin account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Change Admin Password</h3>
              <p className="text-sm text-muted-foreground">Update your admin account password</p>
              <Button variant="outline">Change Password</Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Security Settings</h3>
              <p className="text-sm text-muted-foreground">Update security preferences</p>
              <Button variant="outline">Security Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Manage system-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Application Settings</h3>
              <p className="text-sm text-muted-foreground">Configure application behavior</p>
              <Button variant="outline">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Admin Component
export default function Admin() {
  const isAdmin = useAdminGuard();
  const [, setLocation] = useLocation();
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setLocation('/admin-login');
  };
  
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (isAdmin === false) {
    // This will not actually show as useAdminGuard will redirect
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <TabsList className="flex-col h-auto space-y-1">
            <TabsTrigger value="dashboard" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tax-forms" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Tax Forms
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full flex items-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold md:hidden">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/">
                <span className="sr-only">Go to home</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </Link>
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="dashboard" className="flex-1">
          <div className="block md:hidden p-2 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="dashboard" className="flex-1">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tax-forms" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <main className="flex-1 p-6 overflow-auto">
            <TabsContent value="dashboard">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="tax-forms">
              <TaxFormManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  );
}
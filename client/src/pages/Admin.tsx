import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Users, FileText, ChevronRight, LogOut, User, Settings, LayoutDashboard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TaxForm, User as UserType } from '@shared/schema';
import UserProfile from '@/components/UserProfile';
import { formatDate } from '@/lib/formatters';
import { useAdminGuard } from '@/hooks/useAdminGuard';

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) return;

        const response = await fetch("/api/admin/users", {
          headers: {
            "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
          }
        });

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

  // View user profile
  const handleViewUser = (userId: number) => {
    setSelectedUser(userId);
  };

  // Close user profile
  const handleCloseUserProfile = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If a user is selected, show their profile
  if (selectedUser !== null) {
    const adminAuth = localStorage.getItem('adminAuth');
    const token = adminAuth ? JSON.parse(adminAuth).token : null;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleCloseUserProfile}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Users
          </Button>
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>
        
        <div className="mt-6">
          <UserProfile userId={selectedUser} token={token} />
        </div>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewUser(Number(user.id))}
                        >
                          View
                        </Button>
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
  const [selectedForm, setSelectedForm] = useState<string | null>(null); 
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTaxForms = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) return;

        const response = await fetch("/api/admin/tax-forms", {
          headers: {
            "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
          }
        });

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

  // View tax form details
  const handleViewForm = (formId: string) => {
    setSelectedForm(formId);
  };

  // View user profile
  const handleViewUser = (userId: number) => {
    setSelectedForm(null);
    setSelectedUser(userId);
  };

  // Close form detail or user profile view
  const handleBack = () => {
    setSelectedForm(null);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If a user profile is selected
  if (selectedUser !== null) {
    const adminAuth = localStorage.getItem('adminAuth');
    const token = adminAuth ? JSON.parse(adminAuth).token : null;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Tax Forms
          </Button>
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>
        
        <div className="mt-6">
          <UserProfile userId={selectedUser} token={token} />
        </div>
      </div>
    );
  }

  // If a tax form is selected
  if (selectedForm !== null) {
    const form = taxForms.find(f => f.id === selectedForm);
    
    if (!form) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack}>
              <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Tax Forms
            </Button>
          </div>
          <div className="p-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Form not found</h3>
            <p className="text-muted-foreground">The requested tax form could not be found.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Tax Forms
          </Button>
          <h2 className="text-2xl font-bold">Tax Form Details</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Form Information</CardTitle>
            <CardDescription>Detailed information about this tax form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Form ID</h3>
                <p>{form.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Form Type</h3>
                <p>{form.formType || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assessment Year</h3>
                <p>{form.assessmentYear || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  form.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  form.status === 'filed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {form.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p>{formatDate(form.createdAt || new Date())}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{formatDate(form.updatedAt || new Date())}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                <div className="flex items-center gap-2">
                  <p>{form.userId || 'Not assigned'}</p>
                  {form.userId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewUser(Number(form.userId))}
                    >
                      View User
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Display form data if available */}
            {(form.personalInfo !== undefined || form.incomeData !== undefined || form.deductions80C !== undefined || 
              form.deductions80D !== undefined || form.otherDeductions !== undefined || form.taxPaid !== undefined) && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Form Data</h3>
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="deductions80c">80C</TabsTrigger>
                    <TabsTrigger value="deductions80d">80D</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                    <TabsTrigger value="taxpaid">Tax Paid</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.personalInfo !== undefined ? 
                        (typeof form.personalInfo === 'object' ? 
                          JSON.stringify(form.personalInfo, null, 2) : 
                          String(form.personalInfo)) 
                        : "No personal info data"}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="income" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.incomeData !== undefined ? 
                        (typeof form.incomeData === 'object' ? 
                          JSON.stringify(form.incomeData, null, 2) : 
                          String(form.incomeData)) 
                        : "No income data"}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="deductions80c" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.deductions80C !== undefined ? 
                        (typeof form.deductions80C === 'object' ? 
                          JSON.stringify(form.deductions80C, null, 2) : 
                          String(form.deductions80C)) 
                        : "No 80C deduction data"}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="deductions80d" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.deductions80D !== undefined ? 
                        (typeof form.deductions80D === 'object' ? 
                          JSON.stringify(form.deductions80D, null, 2) : 
                          String(form.deductions80D)) 
                        : "No 80D deduction data"}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="other" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.otherDeductions !== undefined ? 
                        (typeof form.otherDeductions === 'object' ? 
                          JSON.stringify(form.otherDeductions, null, 2) : 
                          String(form.otherDeductions)) 
                        : "No other deduction data"}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="taxpaid" className="p-4 border rounded-md mt-2">
                    <pre className="text-xs overflow-auto max-h-60">
                      {form.taxPaid !== undefined ? 
                        (typeof form.taxPaid === 'object' ? 
                          JSON.stringify(form.taxPaid, null, 2) : 
                          String(form.taxPaid)) 
                        : "No tax paid data"}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default tax forms list view
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
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span>{form.userId || '-'}</span>
                        {form.userId && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => handleViewUser(Number(form.userId))}
                          >
                            <User className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewForm(form.id)}
                        >
                          View
                        </Button>
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

        const response = await fetch("/api/admin/stats", {
          headers: {
            "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
          }
        });

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setLocation('/admin-login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
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
          <Tabs defaultValue="dashboard" orientation="vertical">
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
              <TabsTrigger value="blogs" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Blog Posts
              </TabsTrigger>
              <TabsTrigger value="settings" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium flex items-center gap-2"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard Home
              </Button>
              <span className="text-gray-300">|</span>
              <Link href="/admin/blog" className="text-sm hover:underline text-blue-600">
                Blog Manager
              </Link>
              <span className="text-gray-300">|</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-800 hover:bg-red-50" 
                onClick={handleLogout}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="block md:hidden p-2 border-b">
            <TabsList className="w-full grid grid-cols-5">
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
              <TabsTrigger value="blogs" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Blog
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
            
            <TabsContent value="blogs">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Blog Management</h2>
                  <Link href="/admin/blog/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                      Create New Post
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  Manage blog posts for the tax learning resources section. Create new posts, edit existing ones, and control publication status.
                </p>
                <div className="mt-6">
                  <Link href="/admin/blog">
                    <Button size="lg" className="w-full sm:w-auto">
                      View All Blog Posts
                    </Button>
                  </Link>
                </div>
              </div>
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
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/taxCalculations";
import { Search, FileText, User, Download, Trash2, Edit, Plus, RefreshCw, Database } from "lucide-react";

// Define types for our admin panel data
interface UserData {
  id: number;
  username: string;
  email: string;
  role?: string;
  createdAt: string;
}

interface TaxFormData {
  id: string;
  userId: number;
  formType: string;
  status: string;
  assessmentYear: string;
  personalInfo?: any;
  incomeData?: any;
  deductions80C?: any;
  deductions80D?: any;
  otherDeductions?: any;
  taxPaid?: any;
  createdAt: string;
  updatedAt: string;
}

interface DocumentData {
  id: string;
  taxFormId: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt: string;
}

interface StatsData {
  users: {
    total: number;
    new: number;
  };
  taxForms: {
    total: number;
    draft: number;
    submitted: number;
    processing: number;
    completed: number;
    rejected: number;
  };
  documents: {
    total: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
  };
}

// User management component
const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
    refetchOnWindowFocus: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User has been successfully removed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Username</label>
                  <Input
                    id="username"
                    className="col-span-3"
                    placeholder="username"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Email</label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Password</label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Role</label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length > 0 ? (
              filteredUsers?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                      {user.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteUserMutation.mutate(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Tax Forms management component
const TaxFormsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: taxForms = [], isLoading, refetch } = useQuery<TaxFormData[]>({
    queryKey: ["/api/admin/tax-forms"],
    refetchOnWindowFocus: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest(`/api/admin/tax-forms/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Tax form status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tax-forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredTaxForms = taxForms?.filter((form: any) => {
    const matchesSearch = form.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.personalInfo?.name && form.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && form.status === statusFilter;
  });

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "draft": return "secondary";
      case "submitted": return "default";
      // We need to handle our warning and success as "secondary" or other allowed values
      case "processing": return "secondary";
      case "completed": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by ID or name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Form Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Assessment Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading tax forms...
                </TableCell>
              </TableRow>
            ) : filteredTaxForms?.length > 0 ? (
              filteredTaxForms?.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell className="font-mono text-xs">{form.id.substring(0, 8)}...</TableCell>
                  <TableCell>{form.userId}</TableCell>
                  <TableCell>{form.formType}</TableCell>
                  <TableCell>{form.personalInfo?.name || "—"}</TableCell>
                  <TableCell>{form.assessmentYear}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={form.status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: form.id, status: value })}
                    >
                      <SelectTrigger className="w-32 h-7">
                        <Badge variant={getStatusBadgeVariant(form.status)}>
                          {form.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No tax forms found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Documents management component
const DocumentsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: documents = [], isLoading, refetch } = useQuery<DocumentData[]>({
    queryKey: ["/api/admin/documents"],
    refetchOnWindowFocus: false,
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest(`/api/admin/documents/${documentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Document deleted",
        description: "Document has been successfully removed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete document: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredDocuments = documents?.filter((doc: any) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Tax Form ID</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading documents...
                </TableCell>
              </TableRow>
            ) : filteredDocuments?.length > 0 ? (
              filteredDocuments?.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono text-xs">{doc.id.substring(0, 8)}...</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell className="font-mono text-xs">{doc.taxFormId.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteDocumentMutation.mutate(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Dashboard Overview
const DashboardOverview = () => {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/admin/stats"],
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard statistics...</div>;
  }

  const defaultStats = {
    users: { total: 0, new: 0 },
    taxForms: { 
      total: 0, 
      draft: 0, 
      submitted: 0, 
      processing: 0, 
      completed: 0, 
      rejected: 0 
    },
    documents: { total: 0 },
    revenue: { total: 0, thisMonth: 0 }
  };

  const data = stats || defaultStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.total}</div>
          <p className="text-xs text-muted-foreground">
            +{data.users.new} new this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tax Returns</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.taxForms.total}</div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
            <div>
              <span className="text-muted-foreground">Draft: </span>
              <span className="font-medium">{data.taxForms.draft}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Processing: </span>
              <span className="font-medium">{data.taxForms.processing}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Completed: </span>
              <span className="font-medium">{data.taxForms.completed}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.documents.total}</div>
          <p className="text-xs text-muted-foreground">
            Uploaded documents
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.revenue.total)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(data.revenue.thisMonth)} this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  
  // Check if the user is an admin, if not redirect to home page
  useEffect(() => {
    console.log("User in Admin:", user);
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  // If not authenticated or not an admin, show loading or nothing
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container max-w-7xl mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You need administrator privileges to access this page.
        </p>
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500">
          Manage users, tax forms, and documents.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tax-forms">Tax Forms</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <DashboardOverview />
        </TabsContent>
        
        <TabsContent value="tax-forms">
          <TaxFormsManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsManagement />
        </TabsContent>
        
        <TabsContent value="blog">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Blog Management</h2>
            <Link href="/blog-admin/new">
              <Button className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create New Blog Post
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-6">
              <p>Manage your blog posts, create new content, and edit existing articles.</p>
              <div className="mt-4">
                <Link href="/blog-admin">
                  <Button variant="outline">Manage Blog Posts</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
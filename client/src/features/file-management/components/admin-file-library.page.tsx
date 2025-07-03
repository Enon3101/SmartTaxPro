import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  File, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Upload,
  RefreshCw,
  FolderOpen,
  Image,
  FileText,
  Archive,
  CheckSquare,
  Square,
  Calendar,
  User,
  HardDrive,
  Shield,
  AlertCircle,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import { formatDate } from '@/lib/formatters';

interface FileRecord {
  id: string;
  originalName: string;
  storedName: string;
  fileType: string;
  fileCategory: string;
  fileSize: number;
  mimeType: string;
  storageProvider: string;
  cdnUrl?: string;
  isPublic: boolean;
  accessLevel: string;
  uploadedBy: number;
  uploaderName?: string;
  createdAt: string;
  lastAccessedAt: string;
  tags?: string[];
}

interface FileStats {
  totalFiles: number;
  totalSize: number;
  publicFiles: number;
  privateFiles: number;
  storageBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

const AdminFileLibrary = () => {
  const isAdmin = useAdminGuard();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    publicFiles: 0,
    privateFiles: 0,
    storageBreakdown: {},
    categoryBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(20);

  useEffect(() => {
    if (isAdmin) {
      fetchFiles();
      fetchStats();
    }
  }, [isAdmin]);

  const fetchFiles = async () => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) return;

      const response = await fetch("/api/admin/files", {
        headers: {
          "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch files");
      }
      
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) return;

      const response = await fetch("/api/admin/files/stats", {
        headers: {
          "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching file stats:", error);
    }
  };

  const handleFileSelect = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDownloadFile = async (file: FileRecord) => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) return;

      const response = await fetch(`/api/admin/files/${file.id}/download`, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Downloaded ${file.originalName}`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) return;

      const response = await fetch("/api/admin/files/bulk-download", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(adminAuth).token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fileIds: selectedFiles })
      });

      if (!response.ok) {
        throw new Error("Failed to create bulk download");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk-download-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Downloaded ${selectedFiles.length} files`,
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error bulk downloading:", error);
      toast({
        title: "Error",
        description: "Failed to download files",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) return;

      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${JSON.parse(adminAuth).token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setFiles(prev => prev.filter(file => file.id !== fileId));
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, fileType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.includes('pdf') || fileType === 'DOCUMENT') return <FileText className="h-4 w-4" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  // Filter files based on search and filters
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.fileCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || file.fileCategory === categoryFilter;
    const matchesAccess = accessFilter === "all" || 
                         (accessFilter === "public" && file.isPublic) ||
                         (accessFilter === "private" && !file.isPublic);
    
    return matchesSearch && matchesCategory && matchesAccess;
  });

  // Pagination
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access the file library.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">File Library</h1>
              <p className="text-gray-600">Manage and download all uploaded files</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={fetchFiles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {selectedFiles.length > 0 && (
                <Button size="sm" onClick={handleBulkDownload} disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected ({selectedFiles.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Files</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFiles.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <File className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <HardDrive className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Public Files</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.publicFiles}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Eye className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Private Files</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.privateFiles}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="TAX_DOCUMENT">Tax Documents</SelectItem>
                  <SelectItem value="PROFILE_IMAGE">Profile Images</SelectItem>
                  <SelectItem value="BLOG_IMAGE">Blog Images</SelectItem>
                  <SelectItem value="SYSTEM_FILE">System Files</SelectItem>
                </SelectContent>
              </Select>
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="public">Public Files</SelectItem>
                  <SelectItem value="private">Private Files</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* File Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Files ({filteredFiles.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={(checked) => handleFileSelect(file.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.mimeType, file.fileType)}
                          <div>
                            <p className="font-medium text-gray-900">{file.originalName}</p>
                            <p className="text-sm text-gray-500">{file.mimeType}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{file.fileCategory}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                      <TableCell>
                        <Badge variant={file.isPublic ? "default" : "outline"}>
                          {file.isPublic ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{file.uploaderName || `User ${file.uploadedBy}`}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(file.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                  Showing {indexOfFirstFile + 1} to {Math.min(indexOfLastFile, filteredFiles.length)} of{" "}
                  {filteredFiles.length} files
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>File Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setPreviewFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">File Name</p>
                  <p className="text-sm">{previewFile.originalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">File Size</p>
                  <p className="text-sm">{formatFileSize(previewFile.fileSize)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-sm">{previewFile.fileCategory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Access Level</p>
                  <p className="text-sm">{previewFile.isPublic ? "Public" : "Private"}</p>
                </div>
              </div>
              
              {previewFile.mimeType.startsWith('image/') && previewFile.cdnUrl && (
                <div className="border rounded-lg p-4">
                  <img 
                    src={previewFile.cdnUrl} 
                    alt={previewFile.originalName}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadFile(previewFile)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Download Progress Modal */}
      <Dialog open={isDownloading} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Downloading Files</DialogTitle>
            <DialogDescription>
              Please wait while we prepare your download...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={downloadProgress} className="w-full" />
            <p className="text-sm text-gray-600">
              Creating archive with {selectedFiles.length} files...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFileLibrary; 

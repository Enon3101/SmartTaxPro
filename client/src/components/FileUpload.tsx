import { useMutation } from "@tanstack/react-query";
import { FileUp, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { queryClient , apiRequest } from "@/lib/queryClient";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile) => void;
  accept?: string;
  maxSize?: number; // in bytes
  taxFormId?: string;
  documentType: string;
}

const FileUpload = ({
  onUploadComplete,
  accept = "application/pdf,image/jpeg,image/png",
  maxSize = 10 * 1024 * 1024, // 10MB
  taxFormId,
  documentType,
}: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest(
        "POST",
        `/api/tax-forms/${taxFormId}/documents`,
        formData
      );
      return await response.json();
    },
    onSuccess: (data: UploadedFile) => {
      setFiles((prevFiles) => [...prevFiles, data]);
      toast({
        title: "File uploaded successfully",
        description: `${data.name} has been uploaded.`,
      });
      if (onUploadComplete) {
        onUploadComplete(data);
      }
      queryClient.invalidateQueries({ queryKey: [`/api/tax-forms/${taxFormId}`] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [taxFormId]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleFileUpload = (fileList: FileList) => {
    const file = fileList[0];
    
    if (!file) return;
    
    if (!accept.split(",").some(type => file.type.match(type))) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${accept.replace(/,/g, " or ")} file.`,
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size should be less than ${maxSize / (1024 * 1024)}MB.`,
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    
    uploadMutation.mutate(formData);
  };

  const handleRemoveFile = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/documents/${id}`, undefined);
      setFiles(files.filter(file => file.id !== id));
      toast({
        title: "File removed",
        description: "The document has been removed."
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tax-forms/${taxFormId}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Upload {documentType} Document
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative border border-[#E9ECEF] rounded-md p-3 bg-white flex items-center max-w-xs"
            >
              <div className="text-primary text-xl mr-3">
                {file.type.includes("pdf") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-[#ADB5BD]">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                className="ml-2 text-[#ADB5BD] hover:text-destructive"
                aria-label="Remove document"
                onClick={() => handleRemoveFile(file.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`border-2 border-dashed ${
          isDragging ? "border-primary bg-primary/5" : "border-[#E9ECEF]"
        } rounded-lg p-6 text-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <FileUp className="h-8 w-8 text-[#ADB5BD] mb-2" />
          <p className="text-[#ADB5BD] mb-2">
            Drag and drop your {documentType} here or
          </p>
          <Button
            type="button"
            onClick={() => document.getElementById(`file-upload-${documentType}`)?.click()}
          >
            Browse Files
          </Button>
          <input
            id={`file-upload-${documentType}`}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
          <p className="text-sm text-[#ADB5BD] mt-2">
            PDF, JPG or PNG files up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'wouter'; // Assuming routing like /filings/:filingId/documents

import { useAuth } from '@/features/auth/AuthContext';
import { apiRequest } from '@/lib/queryClient';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { toast } from '@/components/ui/use-toast'; // If using ShadCN toast

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  documentType: string; // User-defined type e.g., Form 16, PAN
  url: string; // This might be a presigned URL for display/download
  uploadedAt: string;
}

const DocumentVault: React.FC = () => {
  const params = useParams<{ filingId?: string }>(); // Optional filingId for now
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('Other');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // For now, let's assume a default/test filingId if not provided,
  // or prompt user to select one.
  // In a real app, this would be more robustly handled, e.g., selected from MyFilings.
  const filingIdToUse = params.filingId || 'default_test_filing_id'; // Placeholder

  const fetchDocuments = useCallback(async () => {
    if (!user || !filingIdToUse) {
      // setError("User not authenticated or no filing selected.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('GET', `/api/tax-forms/${filingIdToUse}/documents`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [user, filingIdToUse]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !filingIdToUse) {
      setError("Please select a file and ensure a filing is active.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', documentType); // User-defined type

    try {
      // The API endpoint is /api/tax-forms/:id/documents
      const response = await apiRequest('POST', `/api/tax-forms/${filingIdToUse}/documents`, {
        body: formData, // For FormData, browser sets Content-Type to multipart/form-data
        // Do not set Content-Type manually when using FormData with fetch/apiRequest
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Failed to upload file');
      }
      // const newDocument = await response.json();
      alert('File uploaded successfully!'); // Replace with toast
      setSelectedFile(null);
      setDocumentType('Other');
      fetchDocuments(); // Refresh the list
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Document Vault</h1>
      {/* TODO: Add a way to select or confirm the current tax filing ID if params.filingId is not present */}
      <p className="mb-4 text-sm text-gray-600">Managing documents for Filing ID: <strong>{filingIdToUse}</strong></p>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Select File (PDF, JPG, PNG)
            </label>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-dark" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
            <input 
              type="text" 
              name="documentType" 
              id="documentType" 
              value={documentType} 
              onChange={(e) => setDocumentType(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="E.g., Form 16, PAN Card, Bank Statement"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Documents</h2>
        {loading && <p>Loading documents...</p>}
        {!loading && documents.length === 0 && !error && (
          <p className="text-gray-600">No documents uploaded for this filing yet.</p>
        )}
        {documents.length > 0 && (
          <ul className="space-y-3">
            {documents.map(doc => (
              <li key={doc.id} className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-500">Type: {doc.documentType} | Size: {(doc.size / 1024).toFixed(2)} KB</p>
                  <p className="text-xs text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
                {/* In a real app, doc.url would be a secure link to view/download */}
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  View/Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentVault;

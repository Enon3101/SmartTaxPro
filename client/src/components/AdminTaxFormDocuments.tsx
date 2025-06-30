import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface DocumentInfo {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface AdminTaxFormDocumentsProps {
  taxFormId: string;
}

const AdminTaxFormDocuments: React.FC<AdminTaxFormDocumentsProps> = ({ taxFormId }) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        const token = adminAuth ? JSON.parse(adminAuth).token : null;
        const res = await fetch(`/api/admin/tax-forms/${taxFormId}/documents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setDocuments(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [taxFormId]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading documents...</div>;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (documents.length === 0) return <div className="text-muted-foreground text-sm">No documents uploaded.</div>;

  return (
    <div className="space-y-3">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center gap-3 p-2 border rounded-lg bg-muted/10">
          <FileText className="text-blue-600" />
          <div className="flex-1">
            <div className="font-medium">{doc.name}</div>
            <div className="text-xs text-muted-foreground">{doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleString()}</div>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
              <Download className="mr-1 h-4 w-4" /> Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AdminTaxFormDocuments;

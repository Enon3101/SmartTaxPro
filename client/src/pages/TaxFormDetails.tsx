import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "wouter";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxForm {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalInfo?: Record<string, unknown>;
  incomeData?: Record<string, unknown>;
  deductions80C?: Record<string, unknown>;
  // Add other fields as needed
}

const TaxFormDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: taxForm,
    isLoading,
    error,
  } = useQuery<TaxForm | null>({
    queryKey: ["tax-form", id],
    queryFn: async () => {
      const res = await fetch(`/api/tax-forms/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch tax form details");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="animate-spin h-5 w-5 mr-2 border-2 border-gray-300 border-t-primary rounded-full inline-block align-middle" />
        Loading tax form details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading tax form: {(error as Error).message}
      </div>
    );
  }

  if (!taxForm) {
    return <div className="text-center text-red-500">Tax form not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tax Form Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-sm text-muted-foreground">
            <strong>ID:</strong> {taxForm.id}
          </div>
          <div className="mb-2 text-sm text-muted-foreground">
            <strong>Created:</strong> {new Date(taxForm.createdAt).toLocaleString()}
          </div>
          <div className="mb-2 text-sm text-muted-foreground">
            <strong>Updated:</strong> {new Date(taxForm.updatedAt).toLocaleString()}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Personal Info</h3>
            <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
              {JSON.stringify(taxForm.personalInfo, null, 2)}
            </pre>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Income Data</h3>
            <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
              {JSON.stringify(taxForm.incomeData, null, 2)}
            </pre>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Deductions (80C)</h3>
            <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
              {JSON.stringify(taxForm.deductions80C, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxFormDetails;

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Fetch user's tax forms if authenticated
  const { data: taxForms, isLoading } = useQuery({
    queryKey: ['/api/tax-forms/user', user?.id],
    queryFn: async () => {
      if (!isAuthenticated || !user) return [];
      
      try {
        const response = await fetch('/api/tax-forms/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tax forms: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tax forms:', error);
        toast({
          title: 'Error',
          description: 'Could not load your tax forms. Please try again later.',
          variant: 'destructive'
        });
        return [];
      }
    },
    enabled: !!isAuthenticated && !!user
  });
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="history">Filing History</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Tax Filing History</CardTitle>
              <CardDescription>
                View all your past and in-progress tax filings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : !taxForms || taxForms.length === 0 ? (
                <div className="py-8 text-center border rounded-md bg-muted/10">
                  <p className="text-muted-foreground mb-2">You haven't created any tax filings yet.</p>
                  <a 
                    href="/start-filing"
                    className="text-primary font-medium hover:underline"
                  >
                    Start a new tax filing
                  </a>
                </div>
              ) : (
                <div className="grid gap-4">
                  {taxForms.map((form: any) => (
                    <Card key={form.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-primary">
                            {form.formType || 'ITR Form'} - {form.assessmentYear || 'AY 2026-27'}
                          </h3>
                          <div className="flex gap-3 text-sm mt-1">
                            <p>
                              <span className="text-muted-foreground">Status:</span>{' '}
                              <span className={`capitalize font-medium ${
                                form.status === 'completed' ? 'text-green-600' : 
                                form.status === 'in-progress' ? 'text-amber-600' : 'text-blue-600'
                              }`}>
                                {form.status || 'Draft'}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Last Updated:</span>{' '}
                              <span>{new Date(form.updatedAt || form.createdAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <a 
                            href={`/itr-wizard?form=${form.id}`}
                            className="text-primary font-medium hover:underline text-sm"
                          >
                            Continue Filing
                          </a>
                          <a 
                            href={`/tax-form/${form.id}`}
                            className="text-primary font-medium hover:underline text-sm ml-4"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>
                Access and manage your uploaded tax documents and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="p-4 border-dashed flex flex-col items-center justify-center hover:bg-muted/5 cursor-pointer transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Upload Document</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add a new document or receipt
                        </p>
                      </div>
                    </Card>
                    
                    {/* Example documents - these will be replaced with real data from API */}
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">PAN Card</h3>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>PDF</span>
                            <span>Uploaded on 12 Apr 2026</span>
                          </div>
                        </div>
                        <button className="text-primary hover:underline text-sm">View</button>
                      </div>
                    </Card>
                    
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">Form 16</h3>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>PDF</span>
                            <span>Uploaded on 10 Apr 2026</span>
                          </div>
                        </div>
                        <button className="text-primary hover:underline text-sm">View</button>
                      </div>
                    </Card>
                    
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">Investment Proof</h3>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>PDF</span>
                            <span>Uploaded on 5 Apr 2026</span>
                          </div>
                        </div>
                        <button className="text-primary hover:underline text-sm">View</button>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Documents are securely stored and only accessible by you
                    </p>
                    <a href="#" className="text-primary text-sm hover:underline">
                      Manage all documents
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
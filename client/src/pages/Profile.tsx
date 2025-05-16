import React from 'react';
import UserProfile from '@/components/UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
      </Tabs>
    </div>
  );
};

export default Profile;
import React from 'react';
import UserProfile from '@/components/UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useGoogleAuth();
  
  // Fetch user's tax forms if authenticated
  const { data: taxForms, isLoading } = useQuery({
    queryKey: ['/api/tax-forms/user'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return [];
      const res = await apiRequest('GET', '/api/tax-forms/user');
      if (!res.ok) throw new Error('Failed to fetch tax forms');
      return res.json();
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
                <div className="py-4 text-center">Loading your tax forms...</div>
              ) : !taxForms || taxForms.length === 0 ? (
                <div className="py-4 text-center">
                  <p>You haven't created any tax filings yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {taxForms.map((form: any) => (
                    <Card key={form.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {form.formType || 'Tax Form'} - {form.assessmentYear || 'Unknown Year'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Status: <span className="capitalize">{form.status || 'Draft'}</span>
                          </p>
                        </div>
                        <a 
                          href={`/tax-filing/${form.id}`}
                          className="text-primary text-sm hover:underline"
                        >
                          View Details
                        </a>
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